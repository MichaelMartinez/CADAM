/**
 * Inflection Point Card
 *
 * Displays a decision card at workflow inflection points, allowing users to:
 * - Review the current workflow state (images, analysis, code)
 * - Choose from available options (proceed, modify, retry, cancel)
 * - Provide optional feedback for modifications
 */

import { useState } from 'react';
import type {
  InflectionPoint,
  InflectionPointOption,
  VLMStructuredOutput,
  VerificationResult,
} from '@shared/workflowTypes';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowRight,
  RefreshCw,
  Edit3,
  X,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Code,
  FileText,
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

interface InflectionPointCardProps {
  inflectionPoint: InflectionPoint;
  onResolve: (optionId: string, feedback?: string) => void;
  isResolving?: boolean;
  imageUrlResolver?: (imageId: string) => string;
}

// =============================================================================
// Icon Mapping
// =============================================================================

const iconMap: Record<string, React.ReactNode> = {
  proceed: <ArrowRight className="h-4 w-4" />,
  retry: <RefreshCw className="h-4 w-4" />,
  edit: <Edit3 className="h-4 w-4" />,
  cancel: <X className="h-4 w-4" />,
  verify: <CheckCircle className="h-4 w-4" />,
};

// =============================================================================
// Sub-Components
// =============================================================================

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const colorMap: Record<string, string> = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-red-100 text-red-800',
  };

  return (
    <Badge className={colorMap[confidence] || 'bg-gray-100 text-gray-800'}>
      {confidence} confidence
    </Badge>
  );
}

function ImagePreview({
  imageId,
  label,
  imageUrlResolver,
}: {
  imageId: string;
  label?: string;
  imageUrlResolver?: (id: string) => string;
}) {
  const url = imageUrlResolver?.(imageId) || `/api/images/${imageId}`;

  return (
    <div className="space-y-1">
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-md border bg-muted">
        <img
          src={url}
          alt={label || 'Preview'}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}

function AnalysisDisplay({ analysis }: { analysis: VLMStructuredOutput }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline">{analysis.image_type}</Badge>
        <ConfidenceBadge confidence={analysis.confidence} />
      </div>

      <div>
        <h4 className="mb-1 text-sm font-medium">Description</h4>
        <p className="text-sm text-muted-foreground">{analysis.description}</p>
      </div>

      {analysis.geometry.primary_shapes.length > 0 && (
        <div>
          <h4 className="mb-1 text-sm font-medium">Detected Shapes</h4>
          <div className="flex flex-wrap gap-1">
            {analysis.geometry.primary_shapes.map((shape, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {typeof shape === 'string' ? shape : JSON.stringify(shape)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {analysis.dimensions?.overall && (
        <div>
          <h4 className="mb-1 text-sm font-medium">Dimensions</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {analysis.dimensions.overall.length && (
              <div>
                <span className="text-muted-foreground">Length:</span>{' '}
                {analysis.dimensions.overall.length}mm
              </div>
            )}
            {analysis.dimensions.overall.width && (
              <div>
                <span className="text-muted-foreground">Width:</span>{' '}
                {analysis.dimensions.overall.width}mm
              </div>
            )}
            {analysis.dimensions.overall.height && (
              <div>
                <span className="text-muted-foreground">Height:</span>{' '}
                {analysis.dimensions.overall.height}mm
              </div>
            )}
          </div>
        </div>
      )}

      {analysis.ambiguities && analysis.ambiguities.length > 0 && (
        <div>
          <h4 className="mb-1 flex items-center gap-1 text-sm font-medium">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            Ambiguities
          </h4>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {analysis.ambiguities.map((ambiguity, i) => (
              <li key={i}>{ambiguity}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CodePreview({ code }: { code: string }) {
  return (
    <div className="relative">
      <pre className="max-h-[300px] overflow-x-auto overflow-y-auto rounded-md bg-muted p-4 text-xs">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function VerificationDisplay({
  verification,
}: {
  verification: VerificationResult;
}) {
  const qualityColors: Record<string, string> = {
    excellent: 'text-green-600',
    good: 'text-green-500',
    fair: 'text-yellow-500',
    poor: 'text-red-500',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">Match Quality:</span>
          <span
            className={`font-medium ${qualityColors[verification.match_quality]}`}
          >
            {verification.match_quality.charAt(0).toUpperCase() +
              verification.match_quality.slice(1)}
          </span>
        </div>
        {verification.similarity_score !== undefined && (
          <Badge variant="outline">
            {verification.similarity_score}% similar
          </Badge>
        )}
      </div>

      {verification.discrepancies.length > 0 && (
        <div>
          <h4 className="mb-1 text-sm font-medium">Discrepancies Found</h4>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {verification.discrepancies.map((discrepancy, i) => (
              <li key={i}>{discrepancy}</li>
            ))}
          </ul>
        </div>
      )}

      {verification.details && (
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1">
            {verification.details.proportions_match ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
            Proportions
          </div>
          <div className="flex items-center gap-1">
            {verification.details.features_match ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
            Features
          </div>
          <div className="flex items-center gap-1">
            {verification.details.dimensions_match ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
            Dimensions
          </div>
        </div>
      )}
    </div>
  );
}

function ComparisonView({
  comparison,
  imageUrlResolver,
}: {
  comparison: {
    before: { image_id: string; label: string };
    after: { image_id: string; label: string };
  };
  imageUrlResolver?: (id: string) => string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ImagePreview
        imageId={comparison.before.image_id}
        label={comparison.before.label}
        imageUrlResolver={imageUrlResolver}
      />
      <ImagePreview
        imageId={comparison.after.image_id}
        label={comparison.after.label}
        imageUrlResolver={imageUrlResolver}
      />
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function InflectionPointCard({
  inflectionPoint,
  onResolve,
  isResolving = false,
  imageUrlResolver,
}: InflectionPointCardProps) {
  const [selectedOption, setSelectedOption] =
    useState<InflectionPointOption | null>(null);
  const [feedback, setFeedback] = useState('');

  const { context, options } = inflectionPoint;
  const hasImages = context.images && context.images.length > 0;
  const hasAnalysis = context.analysis !== undefined;
  const hasCode = context.preview_code !== undefined;
  const hasComparison = context.comparison !== undefined;
  const hasVerification = context.verification !== undefined;

  const handleOptionSelect = (option: InflectionPointOption) => {
    if (
      option.action.type === 'modify' &&
      'requires_feedback' in option.action &&
      option.action.requires_feedback
    ) {
      setSelectedOption(option);
    } else {
      onResolve(option.id);
    }
  };

  const handleSubmitWithFeedback = () => {
    if (selectedOption) {
      onResolve(selectedOption.id, feedback);
      setFeedback('');
      setSelectedOption(null);
    }
  };

  const getVariantClass = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return 'default';
      case 'destructive':
        return 'destructive';
      case 'outline':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          {inflectionPoint.title}
        </CardTitle>
        {inflectionPoint.description && (
          <CardDescription>{inflectionPoint.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Content Tabs */}
        {(hasImages ||
          hasAnalysis ||
          hasCode ||
          hasComparison ||
          hasVerification) && (
          <Tabs
            defaultValue={
              hasComparison ? 'comparison' : hasAnalysis ? 'analysis' : 'images'
            }
          >
            <TabsList
              className="grid w-full"
              style={{
                gridTemplateColumns: `repeat(${[hasImages, hasAnalysis, hasCode, hasComparison, hasVerification].filter(Boolean).length}, 1fr)`,
              }}
            >
              {hasImages && (
                <TabsTrigger value="images" className="flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" /> Images
                </TabsTrigger>
              )}
              {hasAnalysis && (
                <TabsTrigger
                  value="analysis"
                  className="flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" /> Analysis
                </TabsTrigger>
              )}
              {hasCode && (
                <TabsTrigger value="code" className="flex items-center gap-1">
                  <Code className="h-4 w-4" /> Code
                </TabsTrigger>
              )}
              {hasComparison && (
                <TabsTrigger
                  value="comparison"
                  className="flex items-center gap-1"
                >
                  <ImageIcon className="h-4 w-4" /> Compare
                </TabsTrigger>
              )}
              {hasVerification && (
                <TabsTrigger
                  value="verification"
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-4 w-4" /> Results
                </TabsTrigger>
              )}
            </TabsList>

            {hasImages && (
              <TabsContent value="images" className="mt-4">
                <div className="flex flex-wrap gap-4">
                  {context.images?.map((img) => (
                    <ImagePreview
                      key={img.id}
                      imageId={img.id}
                      label={img.label}
                      imageUrlResolver={imageUrlResolver}
                    />
                  ))}
                </div>
              </TabsContent>
            )}

            {hasAnalysis && (
              <TabsContent value="analysis" className="mt-4">
                <AnalysisDisplay analysis={context.analysis!} />
              </TabsContent>
            )}

            {hasCode && (
              <TabsContent value="code" className="mt-4">
                <CodePreview code={context.preview_code!} />
              </TabsContent>
            )}

            {hasComparison && (
              <TabsContent value="comparison" className="mt-4">
                <ComparisonView
                  comparison={context.comparison!}
                  imageUrlResolver={imageUrlResolver}
                />
              </TabsContent>
            )}

            {hasVerification && (
              <TabsContent value="verification" className="mt-4">
                <VerificationDisplay verification={context.verification!} />
              </TabsContent>
            )}
          </Tabs>
        )}

        {/* Feedback Input (shown when modify option selected) */}
        {selectedOption && (
          <div className="space-y-2 border-t pt-4">
            <label className="text-sm font-medium">
              Provide feedback for: {selectedOption.label}
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe what changes you'd like..."
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitWithFeedback}
                disabled={isResolving || !feedback.trim()}
              >
                Submit Feedback
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedOption(null);
                  setFeedback('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Action Buttons */}
      {!selectedOption && (
        <CardFooter className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button
              key={option.id}
              variant={getVariantClass(option.variant)}
              onClick={() => handleOptionSelect(option)}
              disabled={isResolving}
              className="flex items-center gap-2"
            >
              {option.icon && iconMap[option.icon]}
              {option.label}
            </Button>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}

export default InflectionPointCard;
