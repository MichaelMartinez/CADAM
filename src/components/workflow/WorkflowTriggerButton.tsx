/**
 * Workflow Trigger Button
 *
 * Button component that triggers the vision-to-scad workflow when
 * the user has uploaded images and wants to convert them to CAD code.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  useStartWorkflow,
  useModelTierDisplay,
} from '@/services/workflowService';
import { WorkflowPanel } from './WorkflowPanel';
import type {
  WorkflowConfig,
  ModelTier,
  Workflow,
} from '@shared/workflowTypes';
import {
  Wand2,
  ChevronDown,
  Zap,
  Star,
  Gauge,
  FlaskConical,
  Settings2,
  Loader2,
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

interface WorkflowTriggerButtonProps {
  conversationId: string;
  messageId: string;
  hasImages: boolean;
  onWorkflowComplete?: (workflow: Workflow, code?: string) => void;
  disabled?: boolean;
}

interface WorkflowSettings {
  modelTier: ModelTier;
  inflectionPoints: boolean;
  verification: boolean;
}

// =============================================================================
// Constants
// =============================================================================

const MODEL_TIERS: Array<{
  id: ModelTier;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    id: 'fast',
    label: 'Fast',
    description: 'Quick processing, good for simple shapes',
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Good quality and speed balance',
    icon: <Gauge className="h-4 w-4" />,
  },
  {
    id: 'best',
    label: 'Best',
    description: 'Highest quality, most detailed',
    icon: <Star className="h-4 w-4" />,
  },
  {
    id: 'experimental',
    label: 'Experimental',
    description: 'Cutting-edge models, results may vary',
    icon: <FlaskConical className="h-4 w-4" />,
  },
];

// =============================================================================
// Main Component
// =============================================================================

export function WorkflowTriggerButton({
  conversationId,
  messageId,
  hasImages,
  onWorkflowComplete,
  disabled = false,
}: WorkflowTriggerButtonProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [settings, setSettings] = useState<WorkflowSettings>({
    modelTier: 'balanced',
    inflectionPoints: true,
    verification: false,
  });
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);

  const { startWorkflow, isStreaming, events, error, cancel } =
    useStartWorkflow();

  const tierDisplay = useModelTierDisplay(settings.modelTier);

  const handleStartWorkflow = async (tier?: ModelTier) => {
    const effectiveTier = tier || settings.modelTier;

    const config: Partial<WorkflowConfig> = {
      models: {
        tier: effectiveTier,
      },
      inflection_points: {
        enabled: settings.inflectionPoints,
      },
      verification: {
        enabled: settings.verification,
        auto_verify: false,
        max_iterations: 3,
      },
    };

    setIsWorkflowOpen(true);

    try {
      await startWorkflow(
        {
          conversationId,
          triggerMessageId: messageId,
          workflowType: 'vision-to-scad',
          config,
        },
        (event) => {
          if (event.type === 'workflow.started') {
            setActiveWorkflowId(event.workflow_id);
          }
        },
      );
    } catch (err) {
      console.error('Failed to start workflow:', err);
    }
  };

  const handleWorkflowComplete = (workflow: Workflow, code?: string) => {
    onWorkflowComplete?.(workflow, code);
    // Keep dialog open to show completion message
  };

  const handleCloseWorkflow = () => {
    if (isStreaming) {
      cancel();
    }
    setIsWorkflowOpen(false);
    setActiveWorkflowId(null);
  };

  if (!hasImages) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-1">
        {/* Main Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStartWorkflow()}
          disabled={disabled || isStreaming}
          className="flex items-center gap-2"
        >
          {isStreaming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          <span>Generate CAD</span>
          <Badge variant="secondary" className="ml-1">
            {tierDisplay.label}
          </Badge>
        </Button>

        {/* Tier Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              disabled={disabled || isStreaming}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Model Quality</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {MODEL_TIERS.map((tier) => (
              <DropdownMenuItem
                key={tier.id}
                onClick={() => handleStartWorkflow(tier.id)}
                className="flex items-start gap-2"
              >
                <div className="mt-0.5">{tier.icon}</div>
                <div className="flex-1">
                  <div className="font-medium">{tier.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {tier.description}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
              <Settings2 className="mr-2 h-4 w-4" />
              Advanced Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workflow Settings</DialogTitle>
            <DialogDescription>
              Configure how images are processed and converted to CAD code.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Model Tier Selection */}
            <div className="space-y-3">
              <Label>Model Quality</Label>
              <div className="grid grid-cols-2 gap-2">
                {MODEL_TIERS.map((tier) => (
                  <Button
                    key={tier.id}
                    variant={
                      settings.modelTier === tier.id ? 'default' : 'outline'
                    }
                    className="flex h-auto flex-col items-start py-3"
                    onClick={() =>
                      setSettings((s) => ({ ...s, modelTier: tier.id }))
                    }
                  >
                    <div className="flex items-center gap-2">
                      {tier.icon}
                      <span className="font-medium">{tier.label}</span>
                    </div>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {tier.description}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Inflection Points Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="inflection-points">Review Steps</Label>
                <p className="text-sm text-muted-foreground">
                  Pause at key points to review and adjust
                </p>
              </div>
              <Switch
                id="inflection-points"
                checked={settings.inflectionPoints}
                onCheckedChange={(checked) =>
                  setSettings((s) => ({ ...s, inflectionPoints: checked }))
                }
              />
            </div>

            {/* Verification Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="verification">Verification Loop</Label>
                <p className="text-sm text-muted-foreground">
                  Compare rendered model with original image
                </p>
              </div>
              <Switch
                id="verification"
                checked={settings.verification}
                onCheckedChange={(checked) =>
                  setSettings((s) => ({ ...s, verification: checked }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsSettingsOpen(false);
                handleStartWorkflow();
              }}
            >
              Start Workflow
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Workflow Progress Dialog */}
      <Dialog open={isWorkflowOpen} onOpenChange={handleCloseWorkflow}>
        <DialogContent
          className="max-h-[90vh] w-[90vw] max-w-5xl overflow-y-auto"
          aria-describedby={undefined}
        >
          <VisuallyHidden>
            <DialogTitle>Workflow Progress</DialogTitle>
          </VisuallyHidden>
          {activeWorkflowId && (
            <WorkflowPanel
              workflowId={activeWorkflowId}
              events={events}
              onComplete={handleWorkflowComplete}
              onCancel={handleCloseWorkflow}
            />
          )}
          {error && !activeWorkflowId && (
            <div className="py-8 text-center">
              <p className="text-red-600 dark:text-red-400">
                Failed to start workflow
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleCloseWorkflow}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default WorkflowTriggerButton;
