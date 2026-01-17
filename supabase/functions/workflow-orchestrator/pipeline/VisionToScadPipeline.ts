/**
 * Vision-to-SCAD Pipeline
 *
 * Orchestrates the conversion of images to OpenSCAD code using:
 * 1. Image preprocessing (resize, format conversion)
 * 2. VLM analysis (structured description)
 * 3. Code generation (OpenSCAD with BOSL2)
 * 4. Optional verification loop (compare render to original)
 */

import {
  WorkflowPipeline,
  InflectionPointRequest,
} from './WorkflowPipeline.ts';
import type {
  VisionToScadState,
  VLMStructuredOutput,
  VerificationResult,
  InflectionPointOption,
} from '../../_shared/workflowTypes.ts';
import { getModelForTier, getModelMetadata } from '../config/modelRegistry.ts';
import { getPromptTemplate } from '../config/promptLibrary.ts';
import {
  createOpenRouterProvider,
  OpenRouterProvider,
} from '../providers/OpenRouterProvider.ts';
import {
  createImagePreprocessor,
  ImagePreprocessor,
} from '../providers/ImagePreprocessor.ts';

// =============================================================================
// Pipeline Implementation
// =============================================================================

export class VisionToScadPipeline extends WorkflowPipeline<VisionToScadState> {
  private openRouter: OpenRouterProvider;
  private imagePreprocessor: ImagePreprocessor;

  constructor(ctx: import('./WorkflowPipeline.ts').PipelineContext) {
    super(ctx);
    this.openRouter = createOpenRouterProvider();
    this.imagePreprocessor = createImagePreprocessor(ctx.supabase, 'images');
  }

  /**
   * Get typed state
   */
  protected getTypedState(): VisionToScadState {
    return this.state as VisionToScadState;
  }

  /**
   * Main execution flow
   */
  async execute(): Promise<void> {
    console.log('[VisionToScad] ========== EXECUTE() CALLED ==========');
    console.log(
      '[VisionToScad] Starting execute() for workflow:',
      this.ctx.workflow.id,
    );
    console.log('[VisionToScad] STACK TRACE:', new Error().stack);
    const state = this.getTypedState();
    console.log('[VisionToScad] Initial state:', {
      type: state.type,
      original_image_ids: state.original_image_ids,
      image_count: state.original_image_ids.length,
      has_vlm_output: !!state.vlm_structured_output,
      has_scad_code: !!state.scad_code,
    });

    try {
      // Emit workflow started
      console.log('[VisionToScad] Emitting workflow.started event');
      this.emit({
        type: 'workflow.started',
        workflow_id: this.ctx.workflow.id,
        workflow_type: 'vision-to-scad',
      });

      // Step 1: Preprocess images
      console.log('[VisionToScad] Step 1: Preprocessing images...');
      await this.preprocessImages();
      console.log('[VisionToScad] Step 1 complete');

      // Step 2: VLM Analysis
      console.log('[VisionToScad] Step 2: VLM Analysis...');
      const vlmOutput = await this.analyzeWithVLM();
      console.log('[VisionToScad] Step 2 complete:', {
        image_type: vlmOutput.image_type,
        confidence: vlmOutput.confidence,
        has_description: !!vlmOutput.description,
      });

      // Step 3: Inflection point - Review VLM analysis
      console.log(
        '[VisionToScad] Step 3: VLM Review inflection point, enabled:',
        this.inflectionPointsEnabled,
      );
      if (this.inflectionPointsEnabled) {
        const shouldProceed = await this.presentVLMReview(vlmOutput);
        console.log(
          '[VisionToScad] VLM Review result, shouldProceed:',
          shouldProceed,
        );
        if (!shouldProceed) {
          console.log(
            '[VisionToScad] Workflow paused at VLM review inflection point',
          );
          return; // Workflow paused at inflection point
        }
      }

      // Step 4: Generate OpenSCAD code
      console.log('[VisionToScad] Step 4: Generating OpenSCAD code...');
      const scadCode = await this.generateScadCode(vlmOutput);
      console.log(
        '[VisionToScad] Step 4 complete, code length:',
        scadCode.length,
      );

      // Step 5: Inflection point - Review generated code
      console.log(
        '[VisionToScad] Step 5: Code Review inflection point, enabled:',
        this.inflectionPointsEnabled,
      );
      if (this.inflectionPointsEnabled) {
        const shouldProceed = await this.presentCodeReview(scadCode);
        console.log(
          '[VisionToScad] Code Review result, shouldProceed:',
          shouldProceed,
        );
        if (!shouldProceed) {
          console.log(
            '[VisionToScad] Workflow paused at code review inflection point',
          );
          return; // Workflow paused at inflection point
        }
      }

      // Step 6: Optional verification loop
      console.log(
        '[VisionToScad] Step 6: Verification loop, enabled:',
        this.verificationEnabled,
      );
      if (this.verificationEnabled) {
        await this.runVerificationLoop(scadCode);
        console.log('[VisionToScad] Step 6 complete');
      }

      // Complete workflow
      console.log('[VisionToScad] Completing workflow...');
      await this.completeWorkflow();
      console.log('[VisionToScad] Workflow completed successfully');
    } catch (error) {
      console.error('[VisionToScad] Execute error:', error);
      console.error(
        '[VisionToScad] Error stack:',
        error instanceof Error ? error.stack : 'No stack',
      );
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await this.failWorkflow(errorMessage, true, [
        'retry',
        'use_different_model',
      ]);
    }
  }

  /**
   * Resume from a specific step after inflection point resolution
   */
  async resumeFrom(
    stepName: string,
    userChoice: string,
    userFeedback?: string,
  ): Promise<void> {
    console.log('[VisionToScad] ========== RESUME_FROM() CALLED ==========');
    console.log('[VisionToScad] resumeFrom called with:', {
      stepName,
      userChoice,
      userFeedback,
      workflowId: this.ctx.workflow.id,
    });
    try {
      switch (stepName) {
        case 'vlm_review': {
          await this.handleVLMReviewChoice(userChoice, userFeedback);
          break;
        }
        case 'code_review': {
          await this.handleCodeReviewChoice(userChoice, userFeedback);
          break;
        }
        case 'verification_review': {
          await this.handleVerificationReviewChoice(userChoice, userFeedback);
          break;
        }
        case 'verification': {
          // Resume verification after receiving screenshot from frontend
          console.log(
            '[VisionToScad:resumeFrom:verification] Resuming verification step',
            {
              userChoice,
              userFeedback,
            },
          );
          if (userChoice === 'screenshot_provided') {
            const state = this.getTypedState();
            console.log(
              '[VisionToScad:resumeFrom:verification] Screenshot provided, state:',
              {
                render_image_ids: state.render_image_ids,
                scad_code_length: state.scad_code?.length,
              },
            );
            await this.runVerificationLoop(state.scad_code!);
          } else {
            console.log(
              '[VisionToScad:resumeFrom:verification] Unknown userChoice:',
              userChoice,
            );
          }
          break;
        }
        default:
          throw new Error(`Unknown step to resume from: ${stepName}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await this.failWorkflow(errorMessage, true, ['retry']);
    }
  }

  // ---------------------------------------------------------------------------
  // Step 1: Image Preprocessing
  // ---------------------------------------------------------------------------

  private async preprocessImages(): Promise<void> {
    const state = this.getTypedState();
    const preprocessConfig = this.getConfig('preprocessing');

    if (!preprocessConfig.enabled) {
      await this.skipStep('preprocess_images', 'Preprocessing disabled');
      return;
    }

    const step = await this.startStep('preprocess_images', 'preprocessing', {
      image_ids: state.original_image_ids,
      config: preprocessConfig,
    });

    try {
      this.emitProgress(10, 'Analyzing images...');

      // Get model-specific preprocessing requirements
      const modelTier = this.getConfig('models').tier;
      const visionModel = getModelForTier(modelTier, 'vision');
      const modelMeta = getModelMetadata(visionModel);

      const maxDimension =
        preprocessConfig.max_dimension ||
        modelMeta.optimal_image_size?.width ||
        1568;
      const format = preprocessConfig.format || 'jpeg';
      const quality = preprocessConfig.quality || 85;

      this.emitProgress(30, 'Preprocessing images for optimal model input...');

      // Process each image
      const enhancedImageIds: string[] = [];
      const totalImages = state.original_image_ids.length;

      for (let i = 0; i < state.original_image_ids.length; i++) {
        const imageId = state.original_image_ids[i];
        const progress = 30 + ((i + 1) / totalImages) * 60;
        this.emitProgress(
          progress,
          `Processing image ${i + 1} of ${totalImages}...`,
        );

        // TODO: Implement actual image preprocessing
        // For now, pass through the original image IDs
        // In production, this would:
        // 1. Download image from storage
        // 2. Resize if larger than maxDimension
        // 3. Convert to target format
        // 4. Optionally enhance (contrast, sharpness)
        // 5. Upload processed image and get new ID
        enhancedImageIds.push(imageId);
      }

      // Update state with enhanced images
      await this.updateState({
        enhanced_image_ids: enhancedImageIds,
      });

      this.emitProgress(100, 'Image preprocessing complete');

      await this.completeStep(step, {
        enhanced_image_ids: enhancedImageIds,
        preprocessing_applied: {
          max_dimension: maxDimension,
          format,
          quality,
          enhance: preprocessConfig.enhance || false,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await this.failStep(step, errorMessage);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  // Step 2: VLM Analysis
  // ---------------------------------------------------------------------------

  private async analyzeWithVLM(): Promise<VLMStructuredOutput> {
    console.log('[VisionToScad:analyzeWithVLM] Starting VLM analysis');
    const state = this.getTypedState();
    const modelConfig = this.getConfig('models');
    const promptConfig = this.getConfig('prompts');

    const imageIds = state.enhanced_image_ids || state.original_image_ids;
    const visionModel =
      modelConfig.vision || getModelForTier(modelConfig.tier, 'vision');

    console.log('[VisionToScad:analyzeWithVLM] Config:', {
      imageIds,
      imageCount: imageIds.length,
      visionModel,
      modelTier: modelConfig.tier,
      promptVersion: promptConfig.version,
    });

    const step = await this.startStep('vlm_analysis', 'ai_call', {
      image_ids: imageIds,
      model: visionModel,
    });
    console.log('[VisionToScad:analyzeWithVLM] Step created:', step.id);

    try {
      this.emitProgress(10, 'Preparing VLM prompt...');

      // Get the grounding prompt - use v2.0 by default for better spatial reasoning
      const promptVersion = promptConfig.version || 'v2.0';
      const prompt = getPromptTemplate('vlm_openscad_grounding', {
        version: promptVersion,
      });

      // Prepend spatial reasoning primer for enhanced VLM analysis
      const spatialPrimer = getPromptTemplate('spatial_reasoning_primer', {
        version: 'v1.0',
      });
      const enhancedPrompt = spatialPrimer + '\n\n---\n\n' + prompt;
      console.log(
        '[VisionToScad:analyzeWithVLM] Prompt loaded with spatial primer, length:',
        enhancedPrompt.length,
      );

      this.emitProgress(20, 'Fetching images...');

      // Convert image IDs to data URLs for the API call
      const imageDataUrls: string[] = [];
      for (let i = 0; i < imageIds.length; i++) {
        const imageId = imageIds[i];
        console.log('[VisionToScad:analyzeWithVLM] Fetching image:', imageId);
        this.emitProgress(
          20 + (i / imageIds.length) * 20,
          `Processing image ${i + 1} of ${imageIds.length}...`,
        );

        try {
          const dataUrl = await this.imagePreprocessor.toDataUrl(imageId);
          console.log(
            '[VisionToScad:analyzeWithVLM] Image fetched, dataUrl length:',
            dataUrl.length,
          );
          imageDataUrls.push(dataUrl);
        } catch (err) {
          console.error(
            '[VisionToScad:analyzeWithVLM] Failed to fetch image:',
            {
              imageId,
              error: err instanceof Error ? err.message : String(err),
              stack: err instanceof Error ? err.stack : 'No stack',
            },
          );
          throw new Error(
            `Failed to fetch image: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      }

      this.emitProgress(50, 'Analyzing images with vision model...');

      // Call OpenRouter API with vision model
      console.log('[VisionToScad:analyzeWithVLM] Calling OpenRouter API:', {
        model: visionModel,
        imageCount: imageDataUrls.length,
        promptLength: prompt.length,
      });

      const result = await this.openRouter.analyzeImages(
        visionModel,
        imageDataUrls,
        enhancedPrompt,
        {
          systemPrompt: `You are an expert CAD engineer with advanced spatial reasoning capabilities. Your task is to analyze images for 3D CAD modeling using OpenSCAD with the BOSL2 library.

CRITICAL INSTRUCTIONS:
1. Use your spatial reasoning skills to correctly interpret perspective, depth cues, and symmetry
2. IGNORE all branding, logos, text, decals - focus ONLY on geometric shape
3. Extract or estimate ALL dimensions in millimeters (mm)
4. Validate any rounding values: rounding MUST be < min(x,y,z)/2
5. Map visual shapes to BOSL2 primitives (cuboid, cyl, prismoid, etc.)

Return ONLY valid JSON matching the schema described in the prompt. Do not include any markdown formatting or code blocks.`,
          maxTokens: 4096,
          jsonMode: true,
        },
      );

      console.log('[VisionToScad:analyzeWithVLM] OpenRouter response:', {
        model: result.model,
        tokensUsed: result.tokensUsed,
        finishReason: result.finishReason,
        contentLength: result.content.length,
        contentPreview: result.content.slice(0, 200),
      });

      this.emitProgress(80, 'Processing VLM response...');

      // Parse the JSON response
      let vlmOutput: VLMStructuredOutput;
      try {
        // Try to extract JSON from the response (handle potential markdown code blocks)
        let jsonContent = result.content.trim();
        if (jsonContent.startsWith('```json')) {
          jsonContent = jsonContent.slice(7);
        }
        if (jsonContent.startsWith('```')) {
          jsonContent = jsonContent.slice(3);
        }
        if (jsonContent.endsWith('```')) {
          jsonContent = jsonContent.slice(0, -3);
        }
        jsonContent = jsonContent.trim();

        vlmOutput = JSON.parse(jsonContent) as VLMStructuredOutput;
      } catch (_parseError) {
        console.error('Failed to parse VLM response:', result.content);
        // Fallback to a structured response based on raw text
        vlmOutput = {
          image_type: 'unknown',
          description: result.content.slice(0, 500),
          geometry: {
            primary_shapes: [],
            operations: [],
            features: [],
          },
          dimensions: {},
          confidence: 'low',
          ambiguities: ['Failed to parse structured output from VLM'],
          openscad_vocabulary: ['cuboid', 'cyl'],
        };
      }

      this.emitProgress(90, 'Finalizing analysis...');

      // Update state
      await this.updateState({
        vlm_description: vlmOutput.description,
        vlm_structured_output: vlmOutput,
      });

      this.emitProgress(100, 'VLM analysis complete');

      await this.completeStep(step, vlmOutput, {
        modelUsed: result.model,
        promptVersion: promptConfig.version,
        tokensUsed: result.tokensUsed,
      });

      return vlmOutput;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await this.failStep(step, errorMessage);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  // Step 3: VLM Review Inflection Point
  // ---------------------------------------------------------------------------

  private async presentVLMReview(
    vlmOutput: VLMStructuredOutput,
  ): Promise<boolean> {
    const state = this.getTypedState();

    // Step is created to track this inflection point in the workflow database
    await this.startStep('vlm_review', 'inflection_point', {
      vlm_output: vlmOutput,
    });

    const options: InflectionPointOption[] = [
      {
        id: 'proceed',
        label: 'Looks Good',
        description: 'Proceed to code generation with this analysis',
        icon: 'proceed',
        action: { type: 'proceed' },
        variant: 'primary',
      },
      {
        id: 'modify',
        label: 'Make Changes',
        description: 'Provide feedback to adjust the analysis',
        icon: 'edit',
        action: { type: 'modify', requires_feedback: true },
        variant: 'outline',
      },
      {
        id: 'retry_best',
        label: 'Try Better Model',
        description: 'Re-analyze with a more powerful model',
        icon: 'retry',
        action: { type: 'use_different_model', model_tier: 'best' },
        variant: 'outline',
      },
      {
        id: 'cancel',
        label: 'Cancel',
        description: 'Stop the workflow',
        icon: 'cancel',
        action: { type: 'cancel' },
        variant: 'destructive',
      },
    ];

    const request: InflectionPointRequest = {
      title: 'Review Image Analysis',
      description: `The vision model analyzed your image${state.original_image_ids.length > 1 ? 's' : ''} and extracted the following information. Please review before we generate code.`,
      context: {
        images: state.original_image_ids.map((id, idx) => ({
          id,
          label: `Image ${idx + 1}`,
        })),
        analysis: vlmOutput,
        metadata: {
          confidence: vlmOutput.confidence,
          image_type: vlmOutput.image_type,
        },
      },
      options,
    };

    await this.createInflectionPoint(request);

    // Return false to indicate workflow is paused
    return false;
  }

  private async handleVLMReviewChoice(
    userChoice: string,
    _userFeedback?: string,
  ): Promise<void> {
    console.log('[VisionToScad:handleVLMReviewChoice] Called with:', {
      userChoice,
      workflowId: this.ctx.workflow.id,
    });
    const state = this.getTypedState();

    switch (userChoice) {
      case 'proceed': {
        console.log(
          '[VisionToScad:handleVLMReviewChoice] proceed: Starting code generation',
        );
        // Continue with code generation
        const scadCode = await this.generateScadCode(
          state.vlm_structured_output!,
        );
        console.log(
          '[VisionToScad:handleVLMReviewChoice] proceed: Code generated, checking inflection points',
        );
        if (this.inflectionPointsEnabled) {
          console.log(
            '[VisionToScad:handleVLMReviewChoice] proceed: Presenting code review',
          );
          const shouldProceed = await this.presentCodeReview(scadCode);
          console.log(
            '[VisionToScad:handleVLMReviewChoice] proceed: presentCodeReview returned:',
            shouldProceed,
          );
          if (!shouldProceed) {
            console.log(
              '[VisionToScad:handleVLMReviewChoice] proceed: Returning early (paused at code review)',
            );
            return;
          }
        }
        console.log(
          '[VisionToScad:handleVLMReviewChoice] proceed: Checking verification',
        );
        if (this.verificationEnabled) {
          console.log(
            '[VisionToScad:handleVLMReviewChoice] proceed: Running verification loop',
          );
          await this.runVerificationLoop(scadCode);
        }
        console.log(
          '[VisionToScad:handleVLMReviewChoice] proceed: Completing workflow',
        );
        await this.completeWorkflow();
        break;
      }

      case 'modify': {
        // Re-run VLM with user feedback
        // TODO: Incorporate user feedback into prompt
        const newVlmOutput = await this.analyzeWithVLM();
        const shouldProceed = await this.presentVLMReview(newVlmOutput);
        if (!shouldProceed) return;
        break;
      }

      case 'retry_best': {
        // Re-run with best tier model
        await this.updateState({
          verification_attempts: 0,
        } as Partial<VisionToScadState>);
        this.ctx.config.models.tier = 'best';
        const bestVlmOutput = await this.analyzeWithVLM();
        await this.presentVLMReview(bestVlmOutput);
        break;
      }

      case 'cancel': {
        await this.cancelWorkflow('User cancelled after VLM review');
        break;
      }

      default:
        throw new Error(`Unknown choice: ${userChoice}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Step 4: Code Generation
  // ---------------------------------------------------------------------------

  private async generateScadCode(
    vlmOutput: VLMStructuredOutput,
  ): Promise<string> {
    console.log('[VisionToScad:generateScadCode] Starting code generation');
    const state = this.getTypedState();
    const modelConfig = this.getConfig('models');
    const promptConfig = this.getConfig('prompts');

    // Use vision-capable model for code generation so it can see the original image
    // This is critical - the one-shot chat works better because the model sees the image
    const codeModel =
      modelConfig.code_generation ||
      getModelForTier(modelConfig.tier, 'vision'); // Use vision model to see images

    console.log('[VisionToScad:generateScadCode] Config:', {
      codeModel,
      modelTier: modelConfig.tier,
      promptVersion: promptConfig.version,
      vlmImageType: vlmOutput.image_type,
      vlmConfidence: vlmOutput.confidence,
      imageIds: state.original_image_ids,
    });

    const step = await this.startStep('code_generation', 'ai_call', {
      vlm_output: vlmOutput,
      model: codeModel,
      image_ids: state.original_image_ids, // Log that we're using images
    });
    console.log('[VisionToScad:generateScadCode] Step created:', step.id);

    try {
      this.emitProgress(10, 'Preparing code generation with image...');

      // Get the code generation prompt with VLM description - use v2.0 by default
      const promptVersion = promptConfig.version || 'v2.0';
      const prompt = getPromptTemplate('scad_from_description', {
        version: promptVersion,
        substitutions: {
          VLM_DESCRIPTION: JSON.stringify(vlmOutput, null, 2),
        },
      });
      console.log(
        '[VisionToScad:generateScadCode] Prompt loaded (v' +
          promptVersion +
          '), length:',
        prompt.length,
      );

      this.emitProgress(20, 'Fetching original image for code generation...');

      // CRITICAL: Include the original image in code generation
      // This is why one-shot chat works better - the model can SEE the image
      const imageIds = state.enhanced_image_ids || state.original_image_ids;
      const imageDataUrls: string[] = [];
      for (const imageId of imageIds) {
        try {
          const dataUrl = await this.imagePreprocessor.toDataUrl(imageId);
          imageDataUrls.push(dataUrl);
          console.log(
            '[VisionToScad:generateScadCode] Fetched image:',
            imageId,
            'length:',
            dataUrl.length,
          );
        } catch (err) {
          console.error(
            '[VisionToScad:generateScadCode] Failed to fetch image:',
            imageId,
            err,
          );
          // Continue without the image if it fails
        }
      }

      this.emitProgress(40, 'Generating OpenSCAD code with vision...');

      // Call OpenRouter API with vision model so it can see the original image
      console.log(
        '[VisionToScad:generateScadCode] Calling OpenRouter API with images:',
        {
          model: codeModel,
          promptLength: prompt.length,
          imageCount: imageDataUrls.length,
        },
      );

      // Use analyzeImages if we have images, otherwise fall back to text generation
      let result;
      if (imageDataUrls.length > 0) {
        result = await this.openRouter.analyzeImages(
          codeModel,
          imageDataUrls,
          prompt,
          {
            systemPrompt: `You are an expert OpenSCAD programmer. Your PRIMARY GOAL is to generate code that VISUALLY MATCHES the object in the image.

CRITICAL PRIORITIES (in order):
1. Get the OVERALL SILHOUETTE correct - the basic shape outline
2. Match STRUCTURAL FEATURES - holes, posts, protrusions, cutouts
3. Maintain PROPORTIONS - relative sizes between parts
4. Add EDGE TREATMENT - fillets, chamfers as visible

MUST IGNORE:
- Brand names, logos, text labels, product markings
- Decorative decals, stickers, printed patterns
- Colors and textures (just model the shape)
- Items placed ON the object (accessories, contents)

BOSL2 RULES:
1. Start with 'include <BOSL2/std.scad>'
2. VALIDATE ROUNDING: rounding MUST be < min(x,y,z)/2
3. For thin parts (<5mm), omit rounding entirely
4. Use parametric design with variables at the top
5. One module per major component with descriptive names
6. Use BOSL2 primitives: cuboid(), cyl(), prismoid(), tube()
7. Use BOSL2 positioning: anchor=BOTTOM, up(), right(), etc.
8. Use BOSL2 patterns: xcopies(), grid_copies(), zrot_copies()

OUTPUT: Pure OpenSCAD code only. No markdown, no code blocks, no explanations.`,
            maxTokens: 8192,
            temperature: 0.3,
          },
        );
      } else {
        // Fallback to text-only generation if no images available
        console.log(
          '[VisionToScad:generateScadCode] No images available, falling back to text-only',
        );
        result = await this.openRouter.generateText(codeModel, prompt, {
          systemPrompt: `You are an expert OpenSCAD programmer. Generate only valid OpenSCAD code using the BOSL2 library.
Do not include any markdown formatting, explanations, or code block markers.
Start directly with 'include <BOSL2/std.scad>' and write clean, well-commented OpenSCAD code.
Use parametric design with variables at the top for all dimensions.`,
          maxTokens: 8192,
          temperature: 0.3,
        });
      }

      console.log('[VisionToScad:generateScadCode] OpenRouter response:', {
        model: result.model,
        tokensUsed: result.tokensUsed,
        finishReason: result.finishReason,
        contentLength: result.content.length,
      });

      this.emitProgress(80, 'Processing generated code...');

      // Clean up the response - remove any markdown formatting
      let scadCode = result.content.trim();

      // Remove markdown code blocks if present
      if (scadCode.startsWith('```openscad')) {
        scadCode = scadCode.slice(11);
      } else if (scadCode.startsWith('```scad')) {
        scadCode = scadCode.slice(7);
      } else if (scadCode.startsWith('```')) {
        scadCode = scadCode.slice(3);
      }
      if (scadCode.endsWith('```')) {
        scadCode = scadCode.slice(0, -3);
      }
      scadCode = scadCode.trim();

      // Ensure the code starts with BOSL2 include
      if (!scadCode.includes('include <BOSL2/std.scad>')) {
        scadCode = 'include <BOSL2/std.scad>\n\n' + scadCode;
      }

      // Add a generation header comment if not present
      if (!scadCode.includes('Generated by CADAM')) {
        scadCode = `// Generated by CADAM Vision-to-SCAD Pipeline
// Based on: ${vlmOutput.description?.slice(0, 100) || 'Image analysis'}
// Model: ${result.model}

${scadCode}`;
      }

      this.emitProgress(90, 'Code generation complete');

      // Update state
      await this.updateState({
        scad_code: scadCode,
      });

      await this.completeStep(
        step,
        { scad_code: scadCode },
        {
          modelUsed: result.model,
          promptVersion: promptConfig.version,
          tokensUsed: result.tokensUsed,
        },
      );

      return scadCode;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await this.failStep(step, errorMessage);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  // Step 5: Code Review Inflection Point
  // ---------------------------------------------------------------------------

  private async presentCodeReview(scadCode: string): Promise<boolean> {
    const state = this.getTypedState();

    // Step is created to track this inflection point in the workflow database
    await this.startStep('code_review', 'inflection_point', {
      scad_code: scadCode,
    });

    const options: InflectionPointOption[] = [
      {
        id: 'proceed',
        label: 'Use This Code',
        description: 'Accept the generated code and proceed',
        icon: 'proceed',
        action: { type: 'proceed_with_code', code: scadCode },
        variant: 'primary',
      },
      {
        id: 'verify',
        label: 'Verify First',
        description: 'Render and compare with original image',
        icon: 'verify',
        action: { type: 'verify' },
        variant: 'outline',
      },
      {
        id: 'modify',
        label: 'Make Changes',
        description: 'Provide feedback to adjust the code',
        icon: 'edit',
        action: { type: 'modify', requires_feedback: true },
        variant: 'outline',
      },
      {
        id: 'restart',
        label: 'Start Over',
        description: 'Re-analyze the image from scratch',
        icon: 'retry',
        action: { type: 'restart', from_step: 'vlm_analysis' },
        variant: 'outline',
      },
    ];

    const request: InflectionPointRequest = {
      title: 'Review Generated Code',
      description:
        'OpenSCAD code has been generated based on the image analysis. Review the code before proceeding.',
      context: {
        preview_code: scadCode,
        images: state.original_image_ids.map((id, idx) => ({
          id,
          label: `Original ${idx + 1}`,
        })),
        metadata: {
          model_used: this.getConfig('models').code_generation,
        },
      },
      options,
    };

    await this.createInflectionPoint(request);

    return false;
  }

  private async handleCodeReviewChoice(
    userChoice: string,
    _userFeedback?: string,
  ): Promise<void> {
    const state = this.getTypedState();

    console.log('[VisionToScad:handleCodeReviewChoice] Processing choice:', {
      userChoice,
      verificationEnabled: this.verificationEnabled,
    });

    switch (userChoice) {
      case 'proceed': {
        // When verification is enabled, always run verification before completing
        // This ensures the model is compared with the original image
        if (this.verificationEnabled) {
          console.log(
            '[VisionToScad:handleCodeReviewChoice] Verification enabled, running verification loop before completing',
          );
          await this.runVerificationLoop(state.scad_code!);
          // Note: runVerificationLoop will either complete the workflow or present verification review
        } else {
          console.log(
            '[VisionToScad:handleCodeReviewChoice] Verification disabled, completing workflow',
          );
          await this.completeWorkflow();
        }
        break;
      }

      case 'verify': {
        console.log(
          '[VisionToScad:handleCodeReviewChoice] Explicit verify request, running verification loop',
        );
        await this.runVerificationLoop(state.scad_code!);
        break;
      }

      case 'modify': {
        // Re-generate with user feedback
        // TODO: Use refinement prompt with feedback
        const newCode = await this.generateScadCode(
          state.vlm_structured_output!,
        );
        await this.presentCodeReview(newCode);
        break;
      }

      case 'restart': {
        // Start over from VLM analysis
        await this.updateState({
          vlm_description: undefined,
          vlm_structured_output: undefined,
          scad_code: undefined,
          verification_attempts: 0,
        });
        await this.execute();
        break;
      }

      default:
        throw new Error(`Unknown choice: ${userChoice}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Step 6: Verification Loop
  // ---------------------------------------------------------------------------

  private async runVerificationLoop(scadCode: string): Promise<void> {
    console.log(
      '[VisionToScad:runVerificationLoop] Starting verification loop',
    );
    const state = this.getTypedState();
    const verificationConfig = this.getConfig('verification');
    const modelConfig = this.getConfig('models');
    const maxIterations = verificationConfig?.max_iterations || 3;

    console.log('[VisionToScad:runVerificationLoop] State:', {
      render_image_ids: state.render_image_ids,
      verification_attempts: state.verification_attempts,
      maxIterations,
      verificationConfig,
    });

    const step = await this.startStep('verification', 'verification', {
      scad_code: scadCode,
      iteration: state.verification_attempts + 1,
      max_iterations: maxIterations,
    });

    console.log('[VisionToScad:runVerificationLoop] Step created:', step.id);

    try {
      this.emitProgress(10, 'Preparing for verification...');

      // Check if we have a render image to compare
      // Note: The render image should be provided by the frontend after rendering the SCAD code
      // This is typically set via an inflection point response that includes a screenshot
      const renderImageId =
        state.render_image_ids?.[state.render_image_ids.length - 1];

      console.log('[VisionToScad:runVerificationLoop] Render image check:', {
        renderImageId,
        render_image_ids: state.render_image_ids,
        hasRenderImage: !!renderImageId,
      });

      if (!renderImageId) {
        // No render image available - request screenshot from frontend
        console.log(
          '[VisionToScad:runVerificationLoop] No render image, requesting screenshot...',
        );
        this.emitProgress(20, 'Requesting screenshot from 3D viewer...');

        // Emit screenshot request event for the frontend to capture
        const screenshotRequestEvent = {
          type: 'workflow.screenshot_requested' as const,
          workflow_id: this.ctx.workflow.id,
          step_id: step.id,
          purpose: 'verification' as const,
          scad_code: scadCode,
        };
        console.log(
          '[VisionToScad:runVerificationLoop] Emitting screenshot request:',
          screenshotRequestEvent,
        );
        this.emit(screenshotRequestEvent);

        // Pause workflow - will be resumed when screenshot is provided via provide_screenshot action
        await this.updateWorkflowStatus('awaiting_decision');
        console.log(
          '[VisionToScad:runVerificationLoop] Workflow paused, waiting for screenshot',
        );
        this.emitProgress(25, 'Waiting for screenshot capture...');

        // Don't complete the step yet - it will be completed when we resume with the screenshot
        return;
      }

      console.log(
        '[VisionToScad:runVerificationLoop] Have render image, proceeding with comparison:',
        renderImageId,
      );

      this.emitProgress(30, 'Fetching images for comparison...');

      // Fetch both original and rendered images
      const originalImageId = state.original_image_ids[0];
      let originalDataUrl: string;
      let renderDataUrl: string;

      try {
        originalDataUrl =
          await this.imagePreprocessor.toDataUrl(originalImageId);
        renderDataUrl = await this.imagePreprocessor.toDataUrl(renderImageId);
      } catch (err) {
        throw new Error(
          `Failed to fetch images for comparison: ${err instanceof Error ? err.message : String(err)}`,
        );
      }

      this.emitProgress(50, 'Comparing original with rendered model...');

      // Get the comparison prompt - use v2.0 by default for better geometry-focused comparison
      const promptConfig = this.getConfig('prompts');
      const promptVersion = promptConfig.version || 'v2.0';
      const prompt = getPromptTemplate('verification_comparison', {
        version: promptVersion,
      });

      // Get vision model for comparison
      const visionModel =
        modelConfig.vision || getModelForTier(modelConfig.tier, 'vision');

      // Call OpenRouter to compare images
      const result = await this.openRouter.compareImages(
        visionModel,
        originalDataUrl,
        renderDataUrl,
        prompt,
        {
          systemPrompt: `You are comparing an original reference image (first) with a 3D rendered OpenSCAD model (second).

CRITICAL: Compare GEOMETRY ONLY.

COMPLETELY IGNORE:
- Colors (OpenSCAD uses one color)
- Materials, textures, finishes
- Brand logos, text, labels, stickers
- Lighting, shadows, reflections
- Items placed ON the object
- Background differences

COMPARE ONLY:
- Overall silhouette shape (40% weight)
- Structural features count/placement (30% weight)
- Proportions and ratios (20% weight)
- Edge treatment (10% weight)

Return ONLY valid JSON matching the schema in the prompt. Do NOT mention color, material, branding, or lighting in discrepancies.`,
          maxTokens: 2048,
          jsonMode: true,
        },
      );

      this.emitProgress(80, 'Processing comparison results...');

      // Parse the verification result
      let verificationResult: VerificationResult;
      try {
        let jsonContent = result.content.trim();
        // Clean up markdown if present
        if (jsonContent.startsWith('```json')) {
          jsonContent = jsonContent.slice(7);
        }
        if (jsonContent.startsWith('```')) {
          jsonContent = jsonContent.slice(3);
        }
        if (jsonContent.endsWith('```')) {
          jsonContent = jsonContent.slice(0, -3);
        }
        jsonContent = jsonContent.trim();

        const parsed = JSON.parse(jsonContent);
        verificationResult = {
          match_quality: parsed.match_quality || 'fair',
          discrepancies: parsed.discrepancies || [],
          recommendation: parsed.recommendation || 'proceed',
          similarity_score: parsed.similarity_score || 50,
          details: parsed.details || {
            proportions_match: false,
            features_match: false,
            dimensions_match: false,
          },
        };
      } catch (_parseError) {
        console.error('Failed to parse verification response:', result.content);
        verificationResult = {
          match_quality: 'poor',
          discrepancies: ['Failed to parse comparison results'],
          recommendation: 'proceed',
          similarity_score: 50,
          details: {
            proportions_match: false,
            features_match: false,
            dimensions_match: false,
          },
        };
      }

      // Update state
      await this.updateState({
        verification_result: verificationResult,
        verification_attempts: state.verification_attempts + 1,
      });

      this.emitProgress(100, 'Verification complete');

      await this.completeStep(step, verificationResult, {
        modelUsed: result.model,
        tokensUsed: result.tokensUsed,
      });

      // Present verification results if inflection points enabled
      if (this.inflectionPointsEnabled) {
        await this.presentVerificationReview(verificationResult, scadCode);
      } else if (verificationResult.recommendation === 'major_revision') {
        // Auto-retry if below threshold and under max iterations
        if (state.verification_attempts < maxIterations) {
          await this.runVerificationLoop(scadCode);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await this.failStep(step, errorMessage);
      throw error;
    }
  }

  private async presentVerificationReview(
    verificationResult: VerificationResult,
    scadCode: string,
  ): Promise<void> {
    const state = this.getTypedState();

    // Step is created to track this inflection point in the workflow database
    await this.startStep('verification_review', 'inflection_point', {
      verification_result: verificationResult,
    });

    // Determine if the match is too poor to accept
    const similarityScore = verificationResult.similarity_score ?? 50;
    const isPoorMatch =
      verificationResult.match_quality === 'poor' ||
      similarityScore < 30 ||
      verificationResult.recommendation === 'major_revision';

    const isFairMatch =
      verificationResult.match_quality === 'fair' ||
      (similarityScore >= 30 && similarityScore < 60);

    // Build options based on match quality
    const options: InflectionPointOption[] = [];

    // Only show Accept as primary if match is good
    if (!isPoorMatch) {
      options.push({
        id: 'accept',
        label: 'Accept',
        description: `Match quality: ${verificationResult.match_quality} (${similarityScore}%)`,
        icon: 'proceed',
        action: { type: 'proceed_with_code', code: scadCode },
        variant:
          verificationResult.recommendation === 'proceed'
            ? 'primary'
            : 'outline',
      });
    }

    // Improve is primary when match is poor/fair
    options.push({
      id: 'improve',
      label: 'Improve',
      description: 'Regenerate code with better guidance',
      icon: 'retry',
      action: { type: 'modify', requires_feedback: false },
      variant: isPoorMatch || isFairMatch ? 'primary' : 'outline',
    });

    options.push({
      id: 'feedback',
      label: 'Give Feedback',
      description: 'Provide specific instructions',
      icon: 'edit',
      action: { type: 'modify', requires_feedback: true },
      variant: 'outline',
    });

    // For poor matches, add Accept as a secondary option with a warning
    if (isPoorMatch) {
      options.push({
        id: 'accept',
        label: 'Accept Anyway',
        description: `⚠️ Match is poor (${similarityScore}%) - not recommended`,
        icon: 'proceed',
        action: { type: 'proceed_with_code', code: scadCode },
        variant: 'destructive',
      });
    }

    // Build description based on match quality
    let description: string;
    if (isPoorMatch) {
      description = `⚠️ **Poor Match Detected** - The generated model does NOT match your original image well (${similarityScore}% similarity).

**Discrepancies found:**
${verificationResult.discrepancies
  .slice(0, 3)
  .map((d) => `• ${d}`)
  .join('\n')}

**Recommendation:** Click "Improve" to regenerate with better guidance.`;
    } else if (isFairMatch) {
      description = `The generated model partially matches your original image (${similarityScore}% similarity). Some adjustments may be needed.`;
    } else {
      description = `The generated model matches your original image well (${similarityScore}% similarity).`;
    }

    const request: InflectionPointRequest = {
      title: isPoorMatch
        ? '⚠️ Poor Match - Review Required'
        : 'Verification Results',
      description,
      context: {
        comparison: {
          before: {
            image_id: state.original_image_ids[0],
            label: 'Original',
          },
          after: {
            image_id: state.render_image_ids?.[0] || '',
            label: 'Generated',
          },
        },
        verification: verificationResult,
        preview_code: scadCode,
      },
      options,
    };

    await this.createInflectionPoint(request);
  }

  private async handleVerificationReviewChoice(
    userChoice: string,
    userFeedback?: string,
  ): Promise<void> {
    const state = this.getTypedState();

    switch (userChoice) {
      case 'accept': {
        await this.completeWorkflow();
        break;
      }

      case 'improve': {
        // Auto-improve based on verification discrepancies
        // Augment the VLM output with the discrepancies so the model knows what to fix
        const augmentedVlmOutput = {
          ...state.vlm_structured_output!,
          // Add verification feedback to guide the regeneration
          _improvement_context: {
            previous_attempt_issues:
              state.verification_result?.discrepancies || [],
            suggested_fixes:
              (state.verification_result as { suggested_fixes?: string[] })
                ?.suggested_fixes || [],
            match_quality: state.verification_result?.match_quality,
            similarity_score: state.verification_result?.similarity_score,
          },
        };
        console.log(
          '[VisionToScad:handleVerificationReviewChoice] Improving with context:',
          {
            discrepancies:
              state.verification_result?.discrepancies?.length || 0,
            match_quality: state.verification_result?.match_quality,
          },
        );
        const improvedCode = await this.generateScadCodeWithFeedback(
          augmentedVlmOutput,
          state.verification_result?.discrepancies || [],
        );
        await this.runVerificationLoop(improvedCode);
        break;
      }

      case 'feedback': {
        // Use user feedback to guide improvement
        if (userFeedback) {
          const augmentedVlmOutput = {
            ...state.vlm_structured_output!,
            _improvement_context: {
              user_feedback: userFeedback,
              previous_attempt_issues:
                state.verification_result?.discrepancies || [],
            },
          };
          const feedbackCode = await this.generateScadCodeWithFeedback(
            augmentedVlmOutput,
            state.verification_result?.discrepancies || [],
            userFeedback,
          );
          await this.runVerificationLoop(feedbackCode);
        } else {
          // No feedback provided, just regenerate
          const feedbackCode = await this.generateScadCode(
            state.vlm_structured_output!,
          );
          await this.runVerificationLoop(feedbackCode);
        }
        break;
      }

      default:
        throw new Error(`Unknown choice: ${userChoice}`);
    }
  }

  /**
   * Generate improved SCAD code incorporating verification feedback
   */
  private async generateScadCodeWithFeedback(
    vlmOutput: VLMStructuredOutput,
    discrepancies: string[],
    userFeedback?: string,
  ): Promise<string> {
    console.log(
      '[VisionToScad:generateScadCodeWithFeedback] Starting with feedback',
    );
    const state = this.getTypedState();
    const modelConfig = this.getConfig('models');
    const promptConfig = this.getConfig('prompts');

    const codeModel =
      modelConfig.code_generation ||
      getModelForTier(modelConfig.tier, 'vision');

    const step = await this.startStep('code_generation', 'ai_call', {
      vlm_output: vlmOutput,
      model: codeModel,
      has_feedback: true,
      discrepancy_count: discrepancies.length,
    });

    try {
      this.emitProgress(10, 'Preparing improved code generation...');

      // Build a feedback-augmented prompt
      let feedbackSection = '';
      if (discrepancies.length > 0) {
        feedbackSection += `\n\n# PREVIOUS ATTEMPT ISSUES (FIX THESE)\nThe previous attempt had these problems:\n${discrepancies.map((d) => `- ${d}`).join('\n')}\n`;
      }
      if (userFeedback) {
        feedbackSection += `\n\n# USER FEEDBACK\n${userFeedback}\n`;
      }

      // Use v2.0 by default for better BOSL2 guidance
      const promptVersion = promptConfig.version || 'v2.0';
      const prompt = getPromptTemplate('scad_from_description', {
        version: promptVersion,
        substitutions: {
          VLM_DESCRIPTION: JSON.stringify(vlmOutput, null, 2) + feedbackSection,
        },
      });

      this.emitProgress(20, 'Fetching images...');

      // Fetch images for vision-based generation
      const imageIds = state.enhanced_image_ids || state.original_image_ids;
      const imageDataUrls: string[] = [];
      for (const imageId of imageIds) {
        try {
          const dataUrl = await this.imagePreprocessor.toDataUrl(imageId);
          imageDataUrls.push(dataUrl);
        } catch (err) {
          console.error(
            '[VisionToScad:generateScadCodeWithFeedback] Failed to fetch image:',
            imageId,
            err,
          );
        }
      }

      this.emitProgress(40, 'Regenerating code with improvements...');

      const systemPrompt = `You are an expert OpenSCAD programmer. Your task is to generate OpenSCAD code that ACCURATELY RECREATES the object shown in the image.

CRITICAL: Your previous attempt had issues that need to be fixed. Pay close attention to the feedback below and make sure the new code addresses those problems.

${discrepancies.length > 0 ? `\n## ISSUES TO FIX:\n${discrepancies.map((d) => `- ${d}`).join('\n')}\n` : ''}
${userFeedback ? `\n## USER'S SPECIFIC REQUEST:\n${userFeedback}\n` : ''}

Rules:
1. Use ONLY the BOSL2 library - start with 'include <BOSL2/std.scad>'
2. Focus on getting the OVERALL SHAPE correct first
3. Break down complex objects into separate modules
4. Do NOT include any markdown formatting or code blocks - output pure OpenSCAD code only`;

      let result;
      if (imageDataUrls.length > 0) {
        result = await this.openRouter.analyzeImages(
          codeModel,
          imageDataUrls,
          prompt,
          {
            systemPrompt,
            maxTokens: 8192,
            temperature: 0.4, // Slightly higher for more variation
          },
        );
      } else {
        result = await this.openRouter.generateText(codeModel, prompt, {
          systemPrompt,
          maxTokens: 8192,
          temperature: 0.4,
        });
      }

      this.emitProgress(80, 'Processing improved code...');

      // Clean up the response
      let scadCode = result.content.trim();
      if (scadCode.startsWith('```openscad')) {
        scadCode = scadCode.slice(11);
      } else if (scadCode.startsWith('```scad')) {
        scadCode = scadCode.slice(7);
      } else if (scadCode.startsWith('```')) {
        scadCode = scadCode.slice(3);
      }
      if (scadCode.endsWith('```')) {
        scadCode = scadCode.slice(0, -3);
      }
      scadCode = scadCode.trim();

      if (!scadCode.includes('include <BOSL2/std.scad>')) {
        scadCode = 'include <BOSL2/std.scad>\n\n' + scadCode;
      }

      if (!scadCode.includes('Generated by CADAM')) {
        scadCode = `// Generated by CADAM Vision-to-SCAD Pipeline (Improved)
// Based on: ${vlmOutput.description?.slice(0, 100) || 'Image analysis'}
// Model: ${result.model}
// Iteration: ${(state.verification_attempts || 0) + 1}

${scadCode}`;
      }

      await this.updateState({
        scad_code: scadCode,
      });

      await this.completeStep(
        step,
        { scad_code: scadCode },
        {
          modelUsed: result.model,
          promptVersion: promptConfig.version,
          tokensUsed: result.tokensUsed,
        },
      );

      return scadCode;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await this.failStep(step, errorMessage);
      throw error;
    }
  }
}
