/**
 * Mold Config Panel
 *
 * Form component for configuring mold generation parameters.
 * Includes all options for professional mold design.
 */

import { useEffect, useMemo } from 'react';
import { AlertTriangle, Lightbulb } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card } from '@/components/ui/card';
import { calculateMoldDimensions } from '@/utils/moldTemplates';
import type {
  MoldConfig,
  MoldType,
  MoldShape,
  SplitAxis,
  KeyType,
  PourHolePosition,
  BoundingBox,
} from '@/types/mold';

/**
 * Analyze part dimensions and recommend the best split axis
 */
function analyzeSplitAxis(bbox: BoundingBox): {
  recommended: SplitAxis;
  reason: string;
  warnings: string[];
} {
  const { x, y, z } = bbox;
  const warnings: string[] = [];

  // Find the smallest dimension - splitting along this axis gives
  // the shallowest mold halves, which is easier to demold
  const dims = [
    { axis: 'x' as SplitAxis, value: x, label: 'X (width)' },
    { axis: 'y' as SplitAxis, value: y, label: 'Y (depth)' },
    { axis: 'z' as SplitAxis, value: z, label: 'Z (height)' },
  ];

  // Sort by dimension value
  dims.sort((a, b) => a.value - b.value);
  const smallest = dims[0];
  const largest = dims[2];

  // Check for very thin parts (aspect ratio > 10:1)
  if (largest.value / smallest.value > 10) {
    warnings.push(
      `Very thin part detected (${(largest.value / smallest.value).toFixed(1)}:1 aspect ratio). Consider if a mold is the best approach.`,
    );
  }

  // Check for very small parts
  if (Math.max(x, y, z) < 10) {
    warnings.push(
      'Part is quite small. Registration keys and vents may be difficult to work with at this scale.',
    );
  }

  // Z is often preferred because:
  // 1. Pour hole is at top (gravity helps)
  // 2. Air vents work better (air rises)
  // 3. Most 3D printers print on XY plane, so Z-split aligns with print orientation
  if (z <= Math.min(x, y) * 1.5) {
    return {
      recommended: 'z',
      reason:
        'Z-axis (horizontal split) is recommended for this part shape. This works best for pouring and air venting.',
      warnings,
    };
  }

  // If Z is much larger than X and Y, recommend splitting along X or Y
  if (x <= y) {
    return {
      recommended: 'x',
      reason: `X-axis split recommended because the part is tall (${z.toFixed(0)}mm) relative to width (${x.toFixed(0)}mm).`,
      warnings,
    };
  }

  return {
    recommended: 'y',
    reason: `Y-axis split recommended because the part is tall (${z.toFixed(0)}mm) relative to depth (${y.toFixed(0)}mm).`,
    warnings,
  };
}

interface MoldConfigPanelProps {
  config: MoldConfig;
  onChange: (config: MoldConfig) => void;
  boundingBox: BoundingBox | null;
  disabled?: boolean;
}

export function MoldConfigPanel({
  config,
  onChange,
  boundingBox,
  disabled = false,
}: MoldConfigPanelProps) {
  // Analyze the part and get recommendations
  const splitAnalysis = useMemo(() => {
    if (!boundingBox) return null;
    return analyzeSplitAxis(boundingBox);
  }, [boundingBox]);

  // Auto-calculate dimensions when bounding box or relevant config changes
  useEffect(() => {
    if (boundingBox && config.dimensions.autoCalculated) {
      const newDimensions = calculateMoldDimensions(boundingBox, config);
      if (
        newDimensions.width !== config.dimensions.width ||
        newDimensions.depth !== config.dimensions.depth ||
        newDimensions.height !== config.dimensions.height
      ) {
        onChange({
          ...config,
          dimensions: { ...newDimensions, autoCalculated: true },
        });
      }
    }
  }, [
    boundingBox,
    config.wallThickness,
    config.splitAxis,
    config.enableClampingTabs,
    config.clampTabSize,
  ]);

  const updateConfig = <K extends keyof MoldConfig>(
    key: K,
    value: MoldConfig[K],
  ) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Part Analysis and Warnings */}
      {splitAnalysis && splitAnalysis.warnings.length > 0 && (
        <Card className="border-adam-orange/30 bg-adam-orange/10 p-3">
          <div className="flex gap-2">
            <AlertTriangle className="text-adam-orange h-4 w-4 flex-shrink-0" />
            <div className="space-y-1">
              {splitAnalysis.warnings.map((warning, i) => (
                <p key={i} className="text-adam-orange text-xs">
                  {warning}
                </p>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Mold Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-adam-text-secondary">
          Mold Type
        </Label>
        <RadioGroup
          value={config.type}
          onValueChange={(value: MoldType) => updateConfig('type', value)}
          disabled={disabled}
          className="grid grid-cols-3 gap-2"
        >
          <Label
            htmlFor="standard"
            className={`flex cursor-pointer items-center justify-center rounded-lg border p-2 text-xs transition-colors ${config.type === 'standard' ? 'border-adam-blue bg-adam-blue/10 text-adam-text-primary' : 'border-adam-neutral-600 text-adam-text-secondary hover:border-adam-neutral-400'} ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
          >
            <RadioGroupItem
              value="standard"
              id="standard"
              className="sr-only"
            />
            Standard
          </Label>
          <Label
            htmlFor="forged-carbon"
            className={`flex cursor-pointer items-center justify-center rounded-lg border p-2 text-xs transition-colors ${config.type === 'forged-carbon' ? 'border-adam-blue bg-adam-blue/10 text-adam-text-primary' : 'border-adam-neutral-600 text-adam-text-secondary hover:border-adam-neutral-400'} ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
          >
            <RadioGroupItem
              value="forged-carbon"
              id="forged-carbon"
              className="sr-only"
            />
            Forged Carbon
          </Label>
          <Label
            htmlFor="modular-box"
            className={`flex cursor-pointer items-center justify-center rounded-lg border p-2 text-xs transition-colors ${config.type === 'modular-box' ? 'border-adam-blue bg-adam-blue/10 text-adam-text-primary' : 'border-adam-neutral-600 text-adam-text-secondary hover:border-adam-neutral-400'} ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
          >
            <RadioGroupItem
              value="modular-box"
              id="modular-box"
              className="sr-only"
            />
            Modular Box
          </Label>
        </RadioGroup>
        <p className="text-xs text-adam-neutral-500">
          {config.type === 'standard'
            ? 'Two halves with pour hole for casting liquid materials'
            : config.type === 'forged-carbon'
              ? 'Piston + bucket design for compression molding'
              : '3-piece split mold: left/right halves + top piston'}
        </p>
      </div>

      {/* Shape */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-adam-text-secondary">
          Shape
        </Label>
        <RadioGroup
          value={config.shape}
          onValueChange={(value: MoldShape) => updateConfig('shape', value)}
          disabled={disabled}
          className="grid grid-cols-2 gap-2"
        >
          <Label
            htmlFor="rectangular"
            className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm transition-colors ${config.shape === 'rectangular' ? 'border-adam-blue bg-adam-blue/10 text-adam-text-primary' : 'border-adam-neutral-600 text-adam-text-secondary hover:border-adam-neutral-400'} ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
          >
            <RadioGroupItem
              value="rectangular"
              id="rectangular"
              className="sr-only"
            />
            Rectangular
          </Label>
          <Label
            htmlFor="circular"
            className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm transition-colors ${config.shape === 'circular' ? 'border-adam-blue bg-adam-blue/10 text-adam-text-primary' : 'border-adam-neutral-600 text-adam-text-secondary hover:border-adam-neutral-400'} ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
          >
            <RadioGroupItem
              value="circular"
              id="circular"
              className="sr-only"
            />
            Circular
          </Label>
        </RadioGroup>
      </div>

      {/* Split Axis */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-adam-text-secondary">
          Split Axis
        </Label>
        <ToggleGroup
          type="single"
          value={config.splitAxis}
          onValueChange={(value: SplitAxis) => {
            if (value) updateConfig('splitAxis', value);
          }}
          disabled={disabled}
          className="justify-start"
        >
          <ToggleGroupItem
            value="x"
            className={`px-4 ${splitAnalysis?.recommended === 'x' ? 'ring-adam-green ring-1' : ''}`}
          >
            X {splitAnalysis?.recommended === 'x' && '✓'}
          </ToggleGroupItem>
          <ToggleGroupItem
            value="y"
            className={`px-4 ${splitAnalysis?.recommended === 'y' ? 'ring-adam-green ring-1' : ''}`}
          >
            Y {splitAnalysis?.recommended === 'y' && '✓'}
          </ToggleGroupItem>
          <ToggleGroupItem
            value="z"
            className={`px-4 ${splitAnalysis?.recommended === 'z' ? 'ring-adam-green ring-1' : ''}`}
          >
            Z {splitAnalysis?.recommended === 'z' && '✓'}
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-adam-neutral-500">
          {config.splitAxis === 'z'
            ? 'Horizontal split (top/bottom halves)'
            : config.splitAxis === 'x'
              ? 'Vertical split (left/right halves)'
              : 'Vertical split (front/back halves)'}
        </p>
        {/* Recommendation */}
        {splitAnalysis && (
          <div className="flex gap-2 rounded-md bg-adam-blue/10 p-2">
            <Lightbulb className="h-4 w-4 flex-shrink-0 text-adam-blue" />
            <p className="text-xs text-adam-blue">{splitAnalysis.reason}</p>
          </div>
        )}
      </div>

      {/* Wall Thickness */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-adam-text-secondary">
            Wall Thickness
          </Label>
          <span className="text-sm text-adam-text-primary">
            {config.wallThickness}mm
          </span>
        </div>
        <Slider
          value={[config.wallThickness]}
          onValueChange={([value]) => updateConfig('wallThickness', value)}
          min={2}
          max={15}
          step={0.5}
          disabled={disabled}
        />
      </div>

      {/* Registration Keys */}
      <Card className="border-adam-neutral-700 bg-adam-background-1 p-3">
        <Label className="mb-3 block text-sm font-medium text-adam-text-secondary">
          Registration Keys
        </Label>
        <div className="space-y-3">
          {/* Key Type */}
          <div className="space-y-1">
            <span className="text-xs text-adam-neutral-400">Key Type</span>
            <ToggleGroup
              type="single"
              value={config.keyType}
              onValueChange={(value: KeyType) => {
                if (value) updateConfig('keyType', value);
              }}
              disabled={disabled}
              className="justify-start"
            >
              <ToggleGroupItem value="cone" className="px-3 text-xs">
                Conical
              </ToggleGroupItem>
              <ToggleGroupItem value="sphere" className="px-3 text-xs">
                Spherical
              </ToggleGroupItem>
            </ToggleGroup>
            <p className="text-xs text-adam-neutral-500">
              {config.keyType === 'cone'
                ? 'Conical keys are self-centering and easier to align'
                : 'Spherical keys (original design)'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-adam-neutral-400">Key Size</span>
              <span className="text-xs text-adam-text-primary">
                {config.keySize}mm
              </span>
            </div>
            <Slider
              value={[config.keySize]}
              onValueChange={([value]) => updateConfig('keySize', value)}
              min={2}
              max={10}
              step={0.5}
              disabled={disabled}
            />
          </div>

          {/* Draft Angle (only for conical keys) */}
          {config.keyType === 'cone' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Draft Angle
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.keyDraft}°
                </span>
              </div>
              <Slider
                value={[config.keyDraft]}
                onValueChange={([value]) => updateConfig('keyDraft', value)}
                min={1}
                max={15}
                step={1}
                disabled={disabled}
              />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-adam-neutral-400">Tolerance</span>
              <span className="text-xs text-adam-text-primary">
                {config.keyFettle}mm
              </span>
            </div>
            <Slider
              value={[config.keyFettle]}
              onValueChange={([value]) => updateConfig('keyFettle', value)}
              min={0.1}
              max={1}
              step={0.1}
              disabled={disabled}
            />
          </div>
        </div>
      </Card>

      {/* Air Vents (Standard mold only) */}
      {config.type === 'standard' && (
        <Card className="border-adam-neutral-700 bg-adam-background-1 p-3">
          <div className="mb-3 flex items-center justify-between">
            <Label className="text-sm font-medium text-adam-text-secondary">
              Air Vents
            </Label>
            <Switch
              checked={config.enableVents}
              onCheckedChange={(checked) =>
                updateConfig('enableVents', checked)
              }
              disabled={disabled}
            />
          </div>
          {!config.enableVents && (
            <p className="text-adam-orange text-xs">
              Warning: Air vents are strongly recommended for proper casting
            </p>
          )}
          {config.enableVents && (
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-adam-neutral-400">
                    Vent Diameter
                  </span>
                  <span className="text-xs text-adam-text-primary">
                    {config.ventDiameter}mm
                  </span>
                </div>
                <Slider
                  value={[config.ventDiameter]}
                  onValueChange={([value]) =>
                    updateConfig('ventDiameter', value)
                  }
                  min={0.5}
                  max={2}
                  step={0.1}
                  disabled={disabled}
                />
                <p className="text-xs text-adam-neutral-500">
                  Smaller for viscous materials, larger for thin casting resins
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-adam-neutral-400">
                    Number of Vents
                  </span>
                  <span className="text-xs text-adam-text-primary">
                    {config.ventCount}
                  </span>
                </div>
                <Slider
                  value={[config.ventCount]}
                  onValueChange={([value]) => updateConfig('ventCount', value)}
                  min={2}
                  max={8}
                  step={1}
                  disabled={disabled}
                />
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Pour System (Standard mold only) */}
      {config.type === 'standard' && (
        <Card className="border-adam-neutral-700 bg-adam-background-1 p-3">
          <Label className="mb-3 block text-sm font-medium text-adam-text-secondary">
            Pour System
          </Label>
          <div className="space-y-3">
            {/* Pour Hole Position */}
            <div className="space-y-1">
              <span className="text-xs text-adam-neutral-400">
                Pour Hole Position
              </span>
              <ToggleGroup
                type="single"
                value={config.pourHolePosition ?? 'edge'}
                onValueChange={(value: PourHolePosition) => {
                  if (value) updateConfig('pourHolePosition', value);
                }}
                disabled={disabled}
                className="justify-start"
              >
                <ToggleGroupItem value="edge" className="px-3 text-xs">
                  Edge
                </ToggleGroupItem>
                <ToggleGroupItem value="center" className="px-3 text-xs">
                  Center
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-xs text-adam-neutral-500">
                {config.pourHolePosition === 'edge'
                  ? 'Edge positioning allows better air escape during pour'
                  : 'Center positioning for symmetric parts'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Top Diameter (funnel)
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.pourHoleDiameter}mm
                </span>
              </div>
              <Slider
                value={[config.pourHoleDiameter ?? 12]}
                onValueChange={([value]) =>
                  updateConfig('pourHoleDiameter', value)
                }
                min={5}
                max={25}
                step={1}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Bottom Diameter (sprue)
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.pourHoleTaper}mm
                </span>
              </div>
              <Slider
                value={[config.pourHoleTaper ?? 6]}
                onValueChange={([value]) =>
                  updateConfig('pourHoleTaper', value)
                }
                min={3}
                max={20}
                step={1}
                disabled={disabled}
              />
            </div>

            {/* Overflow Riser */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-adam-neutral-400">
                Overflow Riser
              </span>
              <Switch
                checked={config.enableOverflow ?? false}
                onCheckedChange={(checked) =>
                  updateConfig('enableOverflow', checked)
                }
                disabled={disabled || config.pourHolePosition === 'center'}
              />
            </div>
            {config.enableOverflow && config.pourHolePosition === 'edge' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-adam-neutral-400">
                    Overflow Diameter
                  </span>
                  <span className="text-xs text-adam-text-primary">
                    {config.overflowDiameter}mm
                  </span>
                </div>
                <Slider
                  value={[config.overflowDiameter ?? 6]}
                  onValueChange={([value]) =>
                    updateConfig('overflowDiameter', value)
                  }
                  min={3}
                  max={15}
                  step={1}
                  disabled={disabled}
                />
                <p className="text-xs text-adam-neutral-500">
                  Overflow riser on opposite side helps maintain head pressure
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Shear Edge Configuration (Forged carbon only) */}
      {config.type === 'forged-carbon' && (
        <Card className="border-adam-neutral-700 bg-adam-background-1 p-3">
          <Label className="mb-3 block text-sm font-medium text-adam-text-secondary">
            Shear Edge (Telescopic Seal)
          </Label>
          <p className="mb-3 text-xs text-adam-neutral-500">
            Proper shear edge design prevents flash while allowing easy
            demolding
          </p>

          <div className="space-y-4">
            {/* Shear Edge Gap */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Seal Gap (tight tolerance)
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.shearEdgeGap ?? 0.075}mm
                </span>
              </div>
              <Slider
                value={[config.shearEdgeGap ?? 0.075]}
                onValueChange={([value]) => updateConfig('shearEdgeGap', value)}
                min={0.05}
                max={0.15}
                step={0.005}
                disabled={disabled}
              />
              <p className="text-xs text-adam-neutral-500">
                0.05-0.1mm recommended for forged carbon
              </p>
            </div>

            {/* Shear Edge Depth */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Seal Depth (vertical interface)
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.shearEdgeDepth ?? 2.5}mm
                </span>
              </div>
              <Slider
                value={[config.shearEdgeDepth ?? 2.5]}
                onValueChange={([value]) =>
                  updateConfig('shearEdgeDepth', value)
                }
                min={1}
                max={5}
                step={0.5}
                disabled={disabled}
              />
            </div>

            {/* Clearance Runout */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Clearance Runout (after seal)
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.clearanceRunout ?? 0.4}mm
                </span>
              </div>
              <Slider
                value={[config.clearanceRunout ?? 0.4]}
                onValueChange={([value]) =>
                  updateConfig('clearanceRunout', value)
                }
                min={0.2}
                max={0.6}
                step={0.05}
                disabled={disabled}
              />
            </div>

            {/* Draft Angle */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Draft Angle
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.draftAngle ?? 0}°
                </span>
              </div>
              <Slider
                value={[config.draftAngle ?? 0]}
                onValueChange={([value]) => updateConfig('draftAngle', value)}
                min={0}
                max={5}
                step={0.5}
                disabled={disabled}
              />
              <p className="text-xs text-adam-neutral-500">
                {config.draftAngle === 0
                  ? 'No draft (use analysis recommendation)'
                  : `${config.draftAngle}° taper for easier demolding`}
              </p>
            </div>

            {/* Profile Method */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-adam-neutral-400">
                  Use Alpha Shape Profile
                </span>
                <p className="text-xs text-adam-neutral-500">
                  Concave hull follows part contours tightly
                </p>
              </div>
              <Switch
                checked={config.useProjectedProfile ?? true}
                onCheckedChange={(checked) =>
                  updateConfig('useProjectedProfile', checked)
                }
                disabled={disabled}
              />
            </div>
          </div>

          {/* Shear Edge Diagram */}
          <div className="mt-4 rounded-md bg-adam-background-2 p-2">
            <p className="mb-1 text-xs font-medium text-adam-text-secondary">
              Cross-section view:
            </p>
            <pre className="text-[10px] leading-tight text-adam-neutral-400">
              {`   Piston          Bucket
     │               ┃
     │←─gap─→┃       ┃
     │       ┃       ┃
     │       ┃←seal─→┃
     │       ┃ depth ┃
     │       ┃       ┃
     ├───────┘       ┃
     │←──clearance──→┃
     │               ┃`}
            </pre>
          </div>
        </Card>
      )}

      {/* Modular Box Configuration */}
      {config.type === 'modular-box' && (
        <Card className="border-adam-neutral-700 bg-adam-background-1 p-3">
          <Label className="mb-3 block text-sm font-medium text-adam-text-secondary">
            Modular Box Settings
          </Label>
          <p className="mb-3 text-xs text-adam-neutral-500">
            3-piece compression mold: Part is split at{' '}
            {config.splitAxis.toUpperCase()}-axis midpoint. Lower half → cavity
            in left/right sides. Upper half → male protrusion on piston.
          </p>

          {/* Split Axis Info for Modular Box */}
          <div className="mb-4 rounded-md bg-adam-blue/10 p-2">
            <p className="text-xs text-adam-blue">
              <strong>Split Axis ({config.splitAxis.toUpperCase()}):</strong>{' '}
              {config.splitAxis === 'z'
                ? 'Part split horizontally. Piston compresses from top.'
                : config.splitAxis === 'x'
                  ? 'Part split along X. Good for vertical through-holes.'
                  : 'Part split along Y. Good for front-back symmetry.'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Bolt Hole Diameter */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Bolt Hole Diameter
                </span>
                <span className="text-xs text-adam-text-primary">
                  M{Math.round(config.modularBox?.boltHoleDiameter ?? 6)} (
                  {config.modularBox?.boltHoleDiameter ?? 6.2}mm)
                </span>
              </div>
              <Slider
                value={[config.modularBox?.boltHoleDiameter ?? 6.2]}
                onValueChange={([value]) =>
                  updateConfig('modularBox', {
                    ...config.modularBox,
                    boltHoleDiameter: value,
                    boltSpacing: config.modularBox?.boltSpacing ?? 60,
                    pistonLeadIn: config.modularBox?.pistonLeadIn ?? 2,
                    fitTolerance: config.modularBox?.fitTolerance ?? 0.1,
                    compressionTravel:
                      config.modularBox?.compressionTravel ?? 10,
                    handleHeight: config.modularBox?.handleHeight ?? 15,
                  })
                }
                min={3.2}
                max={10.2}
                step={1}
                disabled={disabled}
              />
              <p className="text-xs text-adam-neutral-500">
                M3=3.2mm, M4=4.2mm, M5=5.2mm, M6=6.2mm, M8=8.2mm
              </p>
            </div>

            {/* Fit Tolerance */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Piston Fit Tolerance
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.modularBox?.fitTolerance ?? 0.1}mm
                </span>
              </div>
              <Slider
                value={[config.modularBox?.fitTolerance ?? 0.1]}
                onValueChange={([value]) =>
                  updateConfig('modularBox', {
                    ...config.modularBox,
                    fitTolerance: value,
                    boltHoleDiameter:
                      config.modularBox?.boltHoleDiameter ?? 6.2,
                    boltSpacing: config.modularBox?.boltSpacing ?? 60,
                    pistonLeadIn: config.modularBox?.pistonLeadIn ?? 2,
                    compressionTravel:
                      config.modularBox?.compressionTravel ?? 10,
                    handleHeight: config.modularBox?.handleHeight ?? 15,
                  })
                }
                min={0.05}
                max={0.5}
                step={0.05}
                disabled={disabled}
              />
              <p className="text-xs text-adam-neutral-500">
                Gap between piston and walls (tighter = less flash)
              </p>
            </div>

            {/* Compression Travel */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Compression Travel
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.modularBox?.compressionTravel ?? 10}mm
                </span>
              </div>
              <Slider
                value={[config.modularBox?.compressionTravel ?? 10]}
                onValueChange={([value]) =>
                  updateConfig('modularBox', {
                    ...config.modularBox,
                    compressionTravel: value,
                    boltHoleDiameter:
                      config.modularBox?.boltHoleDiameter ?? 6.2,
                    boltSpacing: config.modularBox?.boltSpacing ?? 60,
                    pistonLeadIn: config.modularBox?.pistonLeadIn ?? 2,
                    fitTolerance: config.modularBox?.fitTolerance ?? 0.1,
                    handleHeight: config.modularBox?.handleHeight ?? 15,
                  })
                }
                min={5}
                max={30}
                step={5}
                disabled={disabled}
              />
              <p className="text-xs text-adam-neutral-500">
                Extra height above part for piston travel
              </p>
            </div>

            {/* Piston Lead-In */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Piston Lead-In Chamfer
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.modularBox?.pistonLeadIn ?? 2}mm
                </span>
              </div>
              <Slider
                value={[config.modularBox?.pistonLeadIn ?? 2]}
                onValueChange={([value]) =>
                  updateConfig('modularBox', {
                    ...config.modularBox,
                    pistonLeadIn: value,
                    boltHoleDiameter:
                      config.modularBox?.boltHoleDiameter ?? 6.2,
                    boltSpacing: config.modularBox?.boltSpacing ?? 60,
                    fitTolerance: config.modularBox?.fitTolerance ?? 0.1,
                    compressionTravel:
                      config.modularBox?.compressionTravel ?? 10,
                    handleHeight: config.modularBox?.handleHeight ?? 15,
                  })
                }
                min={0}
                max={5}
                step={0.5}
                disabled={disabled}
              />
              <p className="text-xs text-adam-neutral-500">
                Edge chamfer for easier piston insertion
              </p>
            </div>

            {/* Handle Height */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Handle Height
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.modularBox?.handleHeight ?? 15}mm
                </span>
              </div>
              <Slider
                value={[config.modularBox?.handleHeight ?? 15]}
                onValueChange={([value]) =>
                  updateConfig('modularBox', {
                    ...config.modularBox,
                    handleHeight: value,
                    boltHoleDiameter:
                      config.modularBox?.boltHoleDiameter ?? 6.2,
                    boltSpacing: config.modularBox?.boltSpacing ?? 60,
                    pistonLeadIn: config.modularBox?.pistonLeadIn ?? 2,
                    fitTolerance: config.modularBox?.fitTolerance ?? 0.1,
                    compressionTravel:
                      config.modularBox?.compressionTravel ?? 10,
                  })
                }
                min={10}
                max={30}
                step={5}
                disabled={disabled}
              />
            </div>
          </div>

          {/* Modular Box Diagram */}
          <div className="mt-4 rounded-md bg-adam-background-2 p-2">
            <p className="mb-1 text-xs font-medium text-adam-text-secondary">
              3-piece compression mold (split at{' '}
              {config.splitAxis.toUpperCase()}):
            </p>
            <pre className="text-[10px] leading-tight text-adam-neutral-400">
              {`      ┌─────────────────┐
      │     FLANGE      │ ← sits on mold
      ├─────────────────┤
      │ ╔═════════════╗ │ ← UPPER HALF
      │ ║  (solid)    ║ │   of part as
      │ ╚═════════════╝ │   male protrusion
   ───┴─────────────────┴───
   │ LEFT    │    RIGHT │
   │ ┌───────┴───────┐  │ ← LOWER HALF
   │ │   (cavity)    │  │   of part as
   │ └───────────────┘  │   female cavity
   └────────────────────┘
        Y=0 parting line`}
            </pre>
          </div>
        </Card>
      )}

      {/* Clamping System */}
      <Card className="border-adam-neutral-700 bg-adam-background-1 p-3">
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-adam-text-secondary">
            Clamping Tabs
          </Label>
          <Switch
            checked={config.enableClampingTabs}
            onCheckedChange={(checked) =>
              updateConfig('enableClampingTabs', checked)
            }
            disabled={disabled}
          />
        </div>
        {config.enableClampingTabs && (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">Tab Size</span>
                <span className="text-xs text-adam-text-primary">
                  {config.clampTabSize}mm
                </span>
              </div>
              <Slider
                value={[config.clampTabSize]}
                onValueChange={([value]) => updateConfig('clampTabSize', value)}
                min={10}
                max={25}
                step={1}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Bolt Hole Diameter
                </span>
                <span className="text-xs text-adam-text-primary">
                  M{config.clampHoleDiameter}
                </span>
              </div>
              <Slider
                value={[config.clampHoleDiameter]}
                onValueChange={([value]) =>
                  updateConfig('clampHoleDiameter', value)
                }
                min={3}
                max={8}
                step={1}
                disabled={disabled}
              />
            </div>
            <p className="text-xs text-adam-neutral-500">
              Corner tabs with bolt holes to secure mold halves during curing
            </p>
          </div>
        )}
      </Card>

      {/* Gasket Channel (Optional) */}
      <Card className="border-adam-neutral-700 bg-adam-background-1 p-3">
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-adam-text-secondary">
            Gasket Channel
          </Label>
          <Switch
            checked={config.enableGasketChannel}
            onCheckedChange={(checked) =>
              updateConfig('enableGasketChannel', checked)
            }
            disabled={disabled}
          />
        </div>
        {config.enableGasketChannel && (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Channel Width
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.gasketChannelWidth}mm
                </span>
              </div>
              <Slider
                value={[config.gasketChannelWidth]}
                onValueChange={([value]) =>
                  updateConfig('gasketChannelWidth', value)
                }
                min={1}
                max={5}
                step={0.5}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Channel Depth
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.gasketChannelDepth}mm
                </span>
              </div>
              <Slider
                value={[config.gasketChannelDepth]}
                onValueChange={([value]) =>
                  updateConfig('gasketChannelDepth', value)
                }
                min={0.5}
                max={3}
                step={0.5}
                disabled={disabled}
              />
            </div>
            <p className="text-xs text-adam-neutral-500">
              Perimeter channel catches flash and can hold O-ring or silicone
              gasket
            </p>
          </div>
        )}
      </Card>

      {/* Dimensions */}
      <Card className="border-adam-neutral-700 bg-adam-background-1 p-3">
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium text-adam-text-secondary">
            Mold Dimensions
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-adam-neutral-400">Auto</span>
            <Switch
              checked={config.dimensions.autoCalculated}
              onCheckedChange={(checked) =>
                updateConfig('dimensions', {
                  ...config.dimensions,
                  autoCalculated: checked,
                })
              }
              disabled={disabled || !boundingBox}
            />
          </div>
        </div>

        {!boundingBox ? (
          <p className="py-2 text-center text-xs text-adam-neutral-500">
            Select an STL to see dimensions
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-adam-neutral-400">Width (X)</Label>
              <Input
                type="number"
                value={config.dimensions.width || ''}
                onChange={(e) =>
                  updateConfig('dimensions', {
                    ...config.dimensions,
                    width: parseFloat(e.target.value) || 0,
                    autoCalculated: false,
                  })
                }
                disabled={disabled || config.dimensions.autoCalculated}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-adam-neutral-400">Depth (Y)</Label>
              <Input
                type="number"
                value={config.dimensions.depth || ''}
                onChange={(e) =>
                  updateConfig('dimensions', {
                    ...config.dimensions,
                    depth: parseFloat(e.target.value) || 0,
                    autoCalculated: false,
                  })
                }
                disabled={disabled || config.dimensions.autoCalculated}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-adam-neutral-400">
                Height (Z)
              </Label>
              <Input
                type="number"
                value={config.dimensions.height || ''}
                onChange={(e) =>
                  updateConfig('dimensions', {
                    ...config.dimensions,
                    height: parseFloat(e.target.value) || 0,
                    autoCalculated: false,
                  })
                }
                disabled={disabled || config.dimensions.autoCalculated}
                className="h-8 text-sm"
              />
            </div>
          </div>
        )}

        {boundingBox && (
          <p className="mt-2 text-xs text-adam-neutral-500">
            Part size: {boundingBox.x.toFixed(1)} x {boundingBox.y.toFixed(1)} x{' '}
            {boundingBox.z.toFixed(1)} mm
          </p>
        )}
      </Card>
    </div>
  );
}
