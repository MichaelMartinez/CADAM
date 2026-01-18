/**
 * Workflow Mode Selector
 *
 * Allows users to switch between Chat mode and workflow modes.
 * Displays in the chat input bar for easy access.
 */

import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { WorkflowMode, getAvailableWorkflows } from '@/lib/workflowRegistry';
import { workflowLogger } from '@/lib/logger';

// =============================================================================
// Types
// =============================================================================

interface WorkflowModeSelectorProps {
  value: WorkflowMode;
  onChange: (mode: WorkflowMode) => void;
  disabled?: boolean;
  hasImages?: boolean;
  hasMesh?: boolean;
  focused?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function WorkflowModeSelector({
  value,
  onChange,
  disabled = false,
  hasImages = false,
  hasMesh = false,
  focused = false,
}: WorkflowModeSelectorProps) {
  const availableWorkflows = getAvailableWorkflows();

  // Handle value change
  const handleValueChange = (newValue: string) => {
    if (newValue) {
      workflowLogger.info('Workflow mode changed', {
        from: value,
        to: newValue,
        hasImages,
        hasMesh,
      });
      onChange(newValue as WorkflowMode);
    }
  };

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={handleValueChange}
      className="h-8"
      disabled={disabled}
    >
      {/* Chat Mode */}
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="chat"
            aria-label="Chat mode"
            className={cn(
              'h-8 gap-1 px-2 text-xs data-[state=on]:bg-adam-blue/20 data-[state=on]:text-adam-blue',
              focused && 'data-[state=on]:bg-adam-blue/30',
            )}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Chat
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>
          Standard conversational AI for CAD generation
        </TooltipContent>
      </Tooltip>

      {/* Workflow Modes */}
      {availableWorkflows.map((workflow) => {
        const Icon = workflow.icon;
        const isDisabled =
          disabled ||
          (workflow.requiresImages && !hasImages) ||
          (workflow.requiresMesh && !hasMesh);

        // Reason for being disabled
        const disabledReason =
          workflow.requiresImages && !hasImages
            ? 'Requires images to use this mode'
            : workflow.requiresMesh && !hasMesh
              ? 'Requires a 3D model to use this mode'
              : undefined;

        return (
          <Tooltip key={workflow.id}>
            <TooltipTrigger asChild>
              <span>
                <ToggleGroupItem
                  value={workflow.id}
                  aria-label={`${workflow.label} mode`}
                  disabled={isDisabled}
                  className={cn(
                    'h-8 gap-1 px-2 text-xs data-[state=on]:bg-adam-blue/20 data-[state=on]:text-adam-blue',
                    focused && 'data-[state=on]:bg-adam-blue/30',
                    isDisabled && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {workflow.label}
                  {workflow.status === 'beta' && (
                    <Badge
                      variant="outline"
                      className="ml-1 h-4 px-1 text-[10px] font-normal"
                    >
                      Beta
                    </Badge>
                  )}
                </ToggleGroupItem>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {isDisabled && disabledReason ? (
                <span className="text-yellow-500">{disabledReason}</span>
              ) : (
                workflow.description
              )}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </ToggleGroup>
  );
}

export default WorkflowModeSelector;
