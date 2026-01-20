/**
 * Mesh Analysis Panel
 *
 * Displays analysis results for STL meshes including:
 * - Manifold/topology status
 * - Orientation recommendations
 * - Undercut analysis
 * - Draft angle analysis
 */

import { useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Info,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  RotateCcw,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type {
  MeshAnalysisResult,
  OrientationScore,
} from '@/types/meshAnalysis';
import type { SplitAxis } from '@/types/mold';

interface MeshAnalysisPanelProps {
  /** Analysis result from server */
  analysisResult: MeshAnalysisResult | null;
  /** Whether analysis is in progress */
  isAnalyzing: boolean;
  /** Selected orientation (from config) */
  selectedOrientation: SplitAxis;
  /** Callback when orientation is selected */
  onOrientationSelect: (axis: SplitAxis) => void;
  /** Callback to re-run analysis */
  onReanalyze?: () => void;
}

export function MeshAnalysisPanel({
  analysisResult,
  isAnalyzing,
  selectedOrientation,
  onOrientationSelect,
  onReanalyze,
}: MeshAnalysisPanelProps) {
  // Determine status colors and icons
  const topologyStatus = useMemo(() => {
    if (!analysisResult) return null;

    if (analysisResult.isManifold) {
      return {
        icon: CheckCircle2,
        color: 'text-adam-green',
        bgColor: 'bg-adam-green/10',
        label: 'Watertight',
        description: 'Mesh is manifold and ready for mold generation',
      };
    }

    if (analysisResult.repairInfo?.wasRepaired) {
      return {
        icon: AlertTriangle,
        color: 'text-adam-orange',
        bgColor: 'bg-adam-orange/10',
        label: 'Repaired',
        description: `Mesh was repaired (${analysisResult.repairInfo.repairType})`,
      };
    }

    return {
      icon: XCircle,
      color: 'text-adam-red',
      bgColor: 'bg-adam-red/10',
      label: 'Not Watertight',
      description:
        'Mesh has holes or non-manifold edges - repair may be needed',
    };
  }, [analysisResult]);

  // Get undercut severity for selected orientation
  const selectedUndercuts = useMemo(() => {
    if (!analysisResult) return null;
    return analysisResult.undercutAnalysis[selectedOrientation];
  }, [analysisResult, selectedOrientation]);

  if (isAnalyzing) {
    return (
      <Card className="border-adam-neutral-700 bg-adam-background-1 p-4">
        <div className="flex flex-col items-center justify-center space-y-3 py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-adam-blue border-t-transparent" />
          <p className="text-sm text-adam-text-secondary">Analyzing mesh...</p>
          <p className="text-xs text-adam-neutral-500">
            Checking manifold status, undercuts, and draft angles
          </p>
        </div>
      </Card>
    );
  }

  if (!analysisResult) {
    return (
      <Card className="border-adam-neutral-700 bg-adam-background-1 p-4">
        <div className="flex flex-col items-center justify-center space-y-2 py-6 text-center">
          <Info className="h-8 w-8 text-adam-neutral-500" />
          <p className="text-sm text-adam-text-secondary">
            No analysis available
          </p>
          <p className="text-xs text-adam-neutral-500">
            Select an STL file to analyze for moldability
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Topology Status */}
      {topologyStatus && (
        <Card
          className={`border-adam-neutral-700 ${topologyStatus.bgColor} p-3`}
        >
          <div className="flex items-start gap-3">
            <topologyStatus.icon
              className={`h-5 w-5 ${topologyStatus.color}`}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${topologyStatus.color}`}>
                  {topologyStatus.label}
                </span>
                {onReanalyze && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReanalyze}
                    className="h-6 px-2 text-xs"
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Re-analyze
                  </Button>
                )}
              </div>
              <p className="mt-0.5 text-xs text-adam-text-secondary">
                {topologyStatus.description}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Mesh Statistics */}
      <Card className="border-adam-neutral-700 bg-adam-background-1 p-3">
        <Label className="mb-2 block text-sm font-medium text-adam-text-secondary">
          Mesh Statistics
        </Label>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-adam-neutral-400">Triangles:</span>
            <span className="text-adam-text-primary">
              {analysisResult.triangleCount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-adam-neutral-400">Vertices:</span>
            <span className="text-adam-text-primary">
              {analysisResult.vertexCount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-adam-neutral-400">Surface Area:</span>
            <span className="text-adam-text-primary">
              {analysisResult.surfaceArea.toFixed(1)} mm²
            </span>
          </div>
          {analysisResult.volume && (
            <div className="flex justify-between">
              <span className="text-adam-neutral-400">Volume:</span>
              <span className="text-adam-text-primary">
                {analysisResult.volume.toFixed(1)} mm³
              </span>
            </div>
          )}
          <div className="col-span-2 flex justify-between">
            <span className="text-adam-neutral-400">Bounding Box:</span>
            <span className="text-adam-text-primary">
              {analysisResult.boundingBox[0].toFixed(1)} x{' '}
              {analysisResult.boundingBox[1].toFixed(1)} x{' '}
              {analysisResult.boundingBox[2].toFixed(1)} mm
            </span>
          </div>
        </div>
      </Card>

      {/* Orientation Recommendations */}
      <Card className="border-adam-neutral-700 bg-adam-background-1 p-3">
        <Label className="mb-2 block text-sm font-medium text-adam-text-secondary">
          Orientation Analysis
        </Label>
        <div className="space-y-2">
          {analysisResult.orientationScores.map((score, index) => (
            <OrientationOption
              key={score.axis}
              score={score}
              isSelected={selectedOrientation === score.axis}
              isRecommended={index === 0}
              onClick={() => onOrientationSelect(score.axis)}
            />
          ))}
        </div>
        <div className="mt-2 flex gap-2 rounded-md bg-adam-blue/10 p-2">
          <Lightbulb className="h-4 w-4 flex-shrink-0 text-adam-blue" />
          <p className="text-xs text-adam-blue">
            Recommended: {analysisResult.recommendedOrientation.toUpperCase()}
            -axis
            {analysisResult.orientationScores[0]?.summary && (
              <> &mdash; {analysisResult.orientationScores[0].summary}</>
            )}
          </p>
        </div>
      </Card>

      {/* Undercut Analysis */}
      {selectedUndercuts && (
        <Card className="border-adam-neutral-700 bg-adam-background-1 p-3">
          <Label className="mb-2 block text-sm font-medium text-adam-text-secondary">
            Undercut Analysis ({selectedOrientation.toUpperCase()}-axis)
          </Label>
          <UndercutDisplay undercuts={selectedUndercuts} />
        </Card>
      )}

      {/* Draft Angle Analysis */}
      <Card className="border-adam-neutral-700 bg-adam-background-1 p-3">
        <Label className="mb-2 block text-sm font-medium text-adam-text-secondary">
          Draft Angle Analysis
        </Label>
        <DraftAngleDisplay draft={analysisResult.draftAnalysis} />
      </Card>

      {/* Warnings and Errors */}
      {(analysisResult.warnings.length > 0 ||
        analysisResult.errors.length > 0) && (
        <Card className="border-adam-orange/30 bg-adam-orange/10 p-3">
          <div className="space-y-2">
            {analysisResult.errors.map((error, i) => (
              <div key={`error-${i}`} className="flex gap-2">
                <XCircle className="text-adam-red h-4 w-4 flex-shrink-0" />
                <p className="text-adam-red text-xs">{error}</p>
              </div>
            ))}
            {analysisResult.warnings.map((warning, i) => (
              <div key={`warning-${i}`} className="flex gap-2">
                <AlertTriangle className="text-adam-orange h-4 w-4 flex-shrink-0" />
                <p className="text-adam-orange text-xs">{warning}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Analysis Time */}
      <p className="text-center text-xs text-adam-neutral-500">
        Analysis completed in {analysisResult.analysisTimeMs}ms
      </p>
    </div>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

interface OrientationOptionProps {
  score: OrientationScore;
  isSelected: boolean;
  isRecommended: boolean;
  onClick: () => void;
}

function OrientationOption({
  score,
  isSelected,
  isRecommended,
  onClick,
}: OrientationOptionProps) {
  const AxisIcon =
    score.axis === 'z' ? ArrowUp : score.axis === 'x' ? ArrowRight : ArrowDown;

  // Undercut severity color
  const undercutColor =
    score.undercutPercentage < 5
      ? 'text-adam-green'
      : score.undercutPercentage < 15
        ? 'text-adam-orange'
        : 'text-adam-red';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border p-2 text-left transition-colors ${
        isSelected
          ? 'border-adam-blue bg-adam-blue/10'
          : 'border-adam-neutral-600 hover:border-adam-neutral-400'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AxisIcon className="h-4 w-4 text-adam-neutral-400" />
          <span className="text-sm font-medium text-adam-text-primary">
            {score.axis.toUpperCase()}-axis
          </span>
          {isRecommended && (
            <Badge variant="secondary" className="h-4 px-1 text-[10px]">
              Recommended
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-adam-neutral-400">
            {score.height.toFixed(1)}mm
          </span>
          <span className={undercutColor}>
            {score.undercutPercentage.toFixed(1)}%
          </span>
        </div>
      </div>
      {score.summary && (
        <p className="mt-1 text-xs text-adam-neutral-500">{score.summary}</p>
      )}
    </button>
  );
}

interface UndercutDisplayProps {
  undercuts: {
    undercutVertexCount: number;
    undercutPercentage: number;
    maxUndercutDepth: number;
    severity: string;
    description: string;
  };
}

function UndercutDisplay({ undercuts }: UndercutDisplayProps) {
  const severityColors = {
    none: { bar: 'bg-adam-green', text: 'text-adam-green' },
    minor: { bar: 'bg-adam-blue', text: 'text-adam-blue' },
    moderate: { bar: 'bg-adam-orange', text: 'text-adam-orange' },
    severe: { bar: 'bg-adam-red', text: 'text-adam-red' },
  };

  const colors =
    severityColors[undercuts.severity as keyof typeof severityColors] ||
    severityColors.none;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-adam-neutral-400">Undercut severity</span>
        <Badge
          variant="outline"
          className={`capitalize ${colors.text} border-current`}
        >
          {undercuts.severity}
        </Badge>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-adam-neutral-400">Undercut vertices</span>
          <span className="text-adam-text-primary">
            {undercuts.undercutPercentage.toFixed(1)}%
          </span>
        </div>
        <Progress
          value={Math.min(undercuts.undercutPercentage, 100)}
          className="h-1.5"
        />
      </div>

      {undercuts.maxUndercutDepth > 0 && (
        <div className="flex justify-between text-xs">
          <span className="text-adam-neutral-400">Max depth</span>
          <span className="text-adam-text-primary">
            {undercuts.maxUndercutDepth.toFixed(2)}mm
          </span>
        </div>
      )}

      <p className="text-xs text-adam-neutral-500">{undercuts.description}</p>
    </div>
  );
}

interface DraftAngleDisplayProps {
  draft: {
    minDraft: number;
    maxDraft: number;
    avgDraft: number;
    problemFaceCount: number;
    recommendedDraft: number;
  };
}

function DraftAngleDisplay({ draft }: DraftAngleDisplayProps) {
  const hasProblemFaces = draft.problemFaceCount > 0;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-adam-background-2 p-2">
          <div className="text-lg font-semibold text-adam-text-primary">
            {draft.minDraft.toFixed(1)}°
          </div>
          <div className="text-xs text-adam-neutral-400">Min</div>
        </div>
        <div className="rounded-md bg-adam-background-2 p-2">
          <div className="text-lg font-semibold text-adam-text-primary">
            {draft.avgDraft.toFixed(1)}°
          </div>
          <div className="text-xs text-adam-neutral-400">Avg</div>
        </div>
        <div className="rounded-md bg-adam-background-2 p-2">
          <div className="text-lg font-semibold text-adam-text-primary">
            {draft.maxDraft.toFixed(1)}°
          </div>
          <div className="text-xs text-adam-neutral-400">Max</div>
        </div>
      </div>

      {hasProblemFaces && (
        <div className="bg-adam-orange/10 flex gap-2 rounded-md p-2">
          <AlertTriangle className="text-adam-orange h-4 w-4 flex-shrink-0" />
          <div className="text-xs">
            <span className="text-adam-orange">
              {draft.problemFaceCount} faces have less than 1° draft
            </span>
            {draft.recommendedDraft > 0 && (
              <p className="mt-0.5 text-adam-text-secondary">
                Recommended draft correction: {draft.recommendedDraft}°
              </p>
            )}
          </div>
        </div>
      )}

      {!hasProblemFaces && (
        <div className="bg-adam-green/10 flex gap-2 rounded-md p-2">
          <CheckCircle2 className="text-adam-green h-4 w-4 flex-shrink-0" />
          <p className="text-adam-green text-xs">
            All faces have adequate draft angle for demolding
          </p>
        </div>
      )}
    </div>
  );
}
