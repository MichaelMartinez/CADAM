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
} from '@shared/workflowTypes.ts';
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
    try {
      // Emit workflow started
      this.emit({
        type: 'workflow.started',
        workflow_id: this.ctx.workflow.id,
        workflow_type: 'vision-to-scad',
      });

      // Step 1: Preprocess images
      await this.preprocessImages();

      // Step 2: VLM Analysis
      const vlmOutput = await this.analyzeWithVLM();

      // Step 3: Inflection point - Review VLM analysis
      if (this.inflectionPointsEnabled) {
        const shouldProceed = await this.presentVLMReview(vlmOutput);
        if (!shouldProceed) {
          return; // Workflow paused at inflection point
        }
      }

      // Step 4: Generate OpenSCAD code
      const scadCode = await this.generateScadCode(vlmOutput);

      // Step 5: Inflection point - Review generated code
      if (this.inflectionPointsEnabled) {
        const shouldProceed = await this.presentCodeReview(scadCode);
        if (!shouldProceed) {
          return; // Workflow paused at inflection point
        }
      }

      // Step 6: Optional verification loop
      if (this.verificationEnabled) {
        await this.runVerificationLoop(scadCode);
      }

      // Complete workflow
      await this.completeWorkflow();
    } catch (error) {
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
          if (userChoice === 'screenshot_provided') {
            const state = this.getTypedState();
            await this.runVerificationLoop(state.scad_code!);
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
    const state = this.getTypedState();
    const modelConfig = this.getConfig('models');
    const promptConfig = this.getConfig('prompts');

    const imageIds = state.enhanced_image_ids || state.original_image_ids;
    const visionModel =
      modelConfig.vision || getModelForTier(modelConfig.tier, 'vision');

    const step = await this.startStep('vlm_analysis', 'ai_call', {
      image_ids: imageIds,
      model: visionModel,
    });

    try {
      this.emitProgress(10, 'Preparing VLM prompt...');

      // Get the grounding prompt
      const prompt = getPromptTemplate('vlm_openscad_grounding', {
        version: promptConfig.version,
      });

      this.emitProgress(20, 'Fetching images...');

      // Convert image IDs to data URLs for the API call
      const imageDataUrls: string[] = [];
      for (let i = 0; i < imageIds.length; i++) {
        const imageId = imageIds[i];
        this.emitProgress(
          20 + (i / imageIds.length) * 20,
          `Processing image ${i + 1} of ${imageIds.length}...`,
        );

        try {
          const dataUrl = await this.imagePreprocessor.toDataUrl(imageId);
          imageDataUrls.push(dataUrl);
        } catch (err) {
          console.error(`Failed to fetch image ${imageId}:`, err);
          throw new Error(
            `Failed to fetch image: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      }

      this.emitProgress(50, 'Analyzing images with vision model...');

      // Call OpenRouter API with vision model
      const result = await this.openRouter.analyzeImages(
        visionModel,
        imageDataUrls,
        prompt,
        {
          systemPrompt:
            'You are an expert CAD engineer. Return ONLY valid JSON matching the schema described in the prompt. Do not include any markdown formatting or code blocks.',
          maxTokens: 4096,
          jsonMode: true,
        },
      );

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
    const state = this.getTypedState();

    switch (userChoice) {
      case 'proceed': {
        // Continue with code generation
        const scadCode = await this.generateScadCode(
          state.vlm_structured_output!,
        );
        if (this.inflectionPointsEnabled) {
          const shouldProceed = await this.presentCodeReview(scadCode);
          if (!shouldProceed) return;
        }
        if (this.verificationEnabled) {
          await this.runVerificationLoop(scadCode);
        }
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
    const modelConfig = this.getConfig('models');
    const promptConfig = this.getConfig('prompts');

    // Prefer thinking models for code generation
    const codeModel =
      modelConfig.code_generation ||
      getModelForTier(modelConfig.tier, 'thinking');

    const step = await this.startStep('code_generation', 'ai_call', {
      vlm_output: vlmOutput,
      model: codeModel,
    });

    try {
      this.emitProgress(10, 'Preparing code generation prompt...');

      // Get the code generation prompt with VLM description
      const prompt = getPromptTemplate('scad_from_description', {
        version: promptConfig.version,
        substitutions: {
          VLM_DESCRIPTION: JSON.stringify(vlmOutput, null, 2),
        },
      });

      this.emitProgress(30, 'Generating OpenSCAD code...');

      // Call OpenRouter API with code model
      const result = await this.openRouter.generateText(codeModel, prompt, {
        systemPrompt: `You are an expert OpenSCAD programmer. Generate only valid OpenSCAD code using the BOSL2 library.
Do not include any markdown formatting, explanations, or code block markers.
Start directly with 'include <BOSL2/std.scad>' and write clean, well-commented OpenSCAD code.
Use parametric design with variables at the top for all dimensions.`,
        maxTokens: 8192,
        temperature: 0.3, // Lower temperature for more deterministic code output
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

    switch (userChoice) {
      case 'proceed': {
        await this.completeWorkflow();
        break;
      }

      case 'verify': {
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
    const state = this.getTypedState();
    const verificationConfig = this.getConfig('verification');
    const modelConfig = this.getConfig('models');
    const maxIterations = verificationConfig?.max_iterations || 3;

    const step = await this.startStep('verification', 'verification', {
      scad_code: scadCode,
      iteration: state.verification_attempts + 1,
      max_iterations: maxIterations,
    });

    try {
      this.emitProgress(10, 'Preparing for verification...');

      // Check if we have a render image to compare
      // Note: The render image should be provided by the frontend after rendering the SCAD code
      // This is typically set via an inflection point response that includes a screenshot
      const renderImageId =
        state.render_image_ids?.[state.render_image_ids.length - 1];

      if (!renderImageId) {
        // No render image available - request screenshot from frontend
        this.emitProgress(20, 'Requesting screenshot from 3D viewer...');

        // Emit screenshot request event for the frontend to capture
        this.emit({
          type: 'workflow.screenshot_requested',
          workflow_id: this.ctx.workflow.id,
          step_id: step.id,
          purpose: 'verification',
          scad_code: scadCode,
        });

        // Pause workflow - will be resumed when screenshot is provided via provide_screenshot action
        await this.updateWorkflowStatus('awaiting_decision');
        this.emitProgress(25, 'Waiting for screenshot capture...');

        // Don't complete the step yet - it will be completed when we resume with the screenshot
        return;
      }

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

      // Get the comparison prompt
      const prompt = getPromptTemplate('verification_comparison', {});

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
          systemPrompt:
            'You are comparing an original reference image (first) with a 3D rendered model (second). Return ONLY valid JSON matching the schema in the prompt.',
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

    const options: InflectionPointOption[] = [
      {
        id: 'accept',
        label: 'Accept',
        description: `Match quality: ${verificationResult.match_quality} (${verificationResult.similarity_score}%)`,
        icon: 'proceed',
        action: { type: 'proceed_with_code', code: scadCode },
        variant:
          verificationResult.recommendation === 'proceed'
            ? 'primary'
            : 'outline',
      },
      {
        id: 'improve',
        label: 'Improve',
        description: 'Try to fix the discrepancies',
        icon: 'retry',
        action: { type: 'modify', requires_feedback: false },
        variant:
          verificationResult.recommendation !== 'proceed'
            ? 'primary'
            : 'outline',
      },
      {
        id: 'feedback',
        label: 'Give Feedback',
        description: 'Provide specific instructions',
        icon: 'edit',
        action: { type: 'modify', requires_feedback: true },
        variant: 'outline',
      },
    ];

    const request: InflectionPointRequest = {
      title: 'Verification Results',
      description: `The generated model has been compared with your original image. Match quality: ${verificationResult.match_quality}`,
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
    _userFeedback?: string,
  ): Promise<void> {
    const state = this.getTypedState();

    switch (userChoice) {
      case 'accept': {
        await this.completeWorkflow();
        break;
      }

      case 'improve': {
        // Auto-improve based on verification discrepancies
        // TODO: Use error_analysis prompt to fix issues
        const improvedCode = await this.generateScadCode(
          state.vlm_structured_output!,
        );
        await this.runVerificationLoop(improvedCode);
        break;
      }

      case 'feedback': {
        // Use user feedback to guide improvement
        // TODO: Use refinement_guidance prompt with feedback
        const feedbackCode = await this.generateScadCode(
          state.vlm_structured_output!,
        );
        await this.runVerificationLoop(feedbackCode);
        break;
      }

      default:
        throw new Error(`Unknown choice: ${userChoice}`);
    }
  }
}
