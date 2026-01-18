/**
 * Workflow Registry
 *
 * Centralized definitions for all available workflow types.
 * This registry makes it easy to add new workflows and provides
 * metadata for UI components.
 */

import { Wand2, Eye, Layers, Camera, LucideIcon } from 'lucide-react';
import type { WorkflowType } from '@shared/workflowTypes';

// =============================================================================
// Types
// =============================================================================

export interface WorkflowDefinition {
  /** Unique identifier matching WorkflowType */
  id: WorkflowType;
  /** Display label for the workflow */
  label: string;
  /** Short description of what the workflow does */
  description: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Whether the workflow requires images to start */
  requiresImages: boolean;
  /** Whether the workflow requires an existing mesh */
  requiresMesh: boolean;
  /** Whether the workflow is currently available */
  available: boolean;
  /** Feature flag or experimental status */
  status: 'stable' | 'beta' | 'experimental' | 'coming-soon';
}

export type WorkflowMode = 'chat' | WorkflowType;

// =============================================================================
// Registry
// =============================================================================

export const WORKFLOW_REGISTRY: WorkflowDefinition[] = [
  {
    id: 'vision-to-scad',
    label: 'Vision to CAD',
    description: 'Convert images to OpenSCAD code using AI vision analysis',
    icon: Wand2,
    requiresImages: true,
    requiresMesh: false,
    available: true,
    status: 'beta',
  },
  {
    id: 'verification-loop',
    label: 'Verify & Iterate',
    description: 'Compare generated models with reference images and refine',
    icon: Eye,
    requiresImages: true,
    requiresMesh: false,
    available: false,
    status: 'coming-soon',
  },
  {
    id: 'assembly-explode',
    label: 'Explode Assembly',
    description: 'Create exploded views of multi-part assemblies',
    icon: Layers,
    requiresImages: false,
    requiresMesh: false,
    available: false,
    status: 'coming-soon',
  },
  {
    id: 'multi-angle-optimize',
    label: 'Multi-Angle',
    description: 'Optimize model from multiple reference angles',
    icon: Camera,
    requiresImages: true,
    requiresMesh: false,
    available: false,
    status: 'coming-soon',
  },
];

// =============================================================================
// Helpers
// =============================================================================

/**
 * Get workflow definition by ID
 */
export function getWorkflowDefinition(
  id: WorkflowType,
): WorkflowDefinition | undefined {
  return WORKFLOW_REGISTRY.find((w) => w.id === id);
}

/**
 * Get all available workflows (filtering out coming-soon)
 */
export function getAvailableWorkflows(): WorkflowDefinition[] {
  return WORKFLOW_REGISTRY.filter((w) => w.available);
}

/**
 * Get workflows that match content requirements
 */
export function getWorkflowsForContent(options: {
  hasImages: boolean;
  hasMesh: boolean;
}): WorkflowDefinition[] {
  return WORKFLOW_REGISTRY.filter((w) => {
    if (!w.available) return false;
    if (w.requiresImages && !options.hasImages) return false;
    if (w.requiresMesh && !options.hasMesh) return false;
    return true;
  });
}

/**
 * Check if a workflow mode is a workflow type (not 'chat')
 */
export function isWorkflowMode(mode: WorkflowMode): mode is WorkflowType {
  return mode !== 'chat';
}

/**
 * Get the display info for a workflow mode
 */
export function getWorkflowModeInfo(mode: WorkflowMode): {
  label: string;
  description: string;
  icon: LucideIcon | null;
} {
  if (mode === 'chat') {
    return {
      label: 'Chat',
      description: 'Standard conversational AI for CAD generation',
      icon: null,
    };
  }

  const workflow = getWorkflowDefinition(mode);
  if (!workflow) {
    return {
      label: 'Unknown',
      description: 'Unknown workflow mode',
      icon: null,
    };
  }

  return {
    label: workflow.label,
    description: workflow.description,
    icon: workflow.icon,
  };
}

export default WORKFLOW_REGISTRY;
