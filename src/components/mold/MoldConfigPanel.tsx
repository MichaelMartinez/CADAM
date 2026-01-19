/**
 * Mold Config Panel
 *
 * Form component for configuring mold generation parameters.
 */

import { useEffect } from 'react';
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
  BoundingBox,
} from '@/types/mold';

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
  }, [boundingBox, config.wallThickness, config.splitAxis]);

  const updateConfig = <K extends keyof MoldConfig>(
    key: K,
    value: MoldConfig[K],
  ) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Mold Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-adam-text-secondary">
          Mold Type
        </Label>
        <RadioGroup
          value={config.type}
          onValueChange={(value: MoldType) => updateConfig('type', value)}
          disabled={disabled}
          className="grid grid-cols-2 gap-2"
        >
          <Label
            htmlFor="standard"
            className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm transition-colors ${config.type === 'standard' ? 'border-adam-blue bg-adam-blue/10 text-adam-text-primary' : 'border-adam-neutral-600 text-adam-text-secondary hover:border-adam-neutral-400'} ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
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
            className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm transition-colors ${config.type === 'forged-carbon' ? 'border-adam-blue bg-adam-blue/10 text-adam-text-primary' : 'border-adam-neutral-600 text-adam-text-secondary hover:border-adam-neutral-400'} ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
          >
            <RadioGroupItem
              value="forged-carbon"
              id="forged-carbon"
              className="sr-only"
            />
            Forged Carbon
          </Label>
        </RadioGroup>
        <p className="text-xs text-adam-neutral-500">
          {config.type === 'standard'
            ? 'Two halves with pour hole for casting liquid materials'
            : 'Piston + bucket design for compression molding'}
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
          <ToggleGroupItem value="x" className="px-4">
            X
          </ToggleGroupItem>
          <ToggleGroupItem value="y" className="px-4">
            Y
          </ToggleGroupItem>
          <ToggleGroupItem value="z" className="px-4">
            Z
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-adam-neutral-500">
          {config.splitAxis === 'z'
            ? 'Horizontal split (top/bottom halves)'
            : config.splitAxis === 'x'
              ? 'Vertical split (left/right halves)'
              : 'Vertical split (front/back halves)'}
        </p>
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
              min={1}
              max={8}
              step={0.5}
              disabled={disabled}
            />
          </div>
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

      {/* Type-specific options */}
      {config.type === 'standard' && (
        <Card className="border-adam-neutral-700 bg-adam-background-1 p-3">
          <Label className="mb-3 block text-sm font-medium text-adam-text-secondary">
            Pour Hole
          </Label>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-adam-neutral-400">
                  Top Diameter
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.pourHoleDiameter}mm
                </span>
              </div>
              <Slider
                value={[config.pourHoleDiameter ?? 10]}
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
                  Bottom Diameter (taper)
                </span>
                <span className="text-xs text-adam-text-primary">
                  {config.pourHoleTaper}mm
                </span>
              </div>
              <Slider
                value={[config.pourHoleTaper ?? 5]}
                onValueChange={([value]) =>
                  updateConfig('pourHoleTaper', value)
                }
                min={3}
                max={20}
                step={1}
                disabled={disabled}
              />
            </div>
          </div>
        </Card>
      )}

      {config.type === 'forged-carbon' && (
        <Card className="border-adam-neutral-700 bg-adam-background-1 p-3">
          <Label className="mb-3 block text-sm font-medium text-adam-text-secondary">
            Piston Clearance
          </Label>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-adam-neutral-400">
                Gap between piston and bucket
              </span>
              <span className="text-xs text-adam-text-primary">
                {config.pistonClearance}mm
              </span>
            </div>
            <Slider
              value={[config.pistonClearance ?? 0.4]}
              onValueChange={([value]) =>
                updateConfig('pistonClearance', value)
              }
              min={0.1}
              max={1.5}
              step={0.1}
              disabled={disabled}
            />
          </div>
        </Card>
      )}

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
