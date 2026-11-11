import * as xb from 'xrblocks';
import { StudioVirtualStageScript } from './virtualStage';
import { StudioManagementApp } from './app';

document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element #root not found.');
    return;
  }

  // Create Virtual 3D Stage Script
  const virtualStageScript = new StudioVirtualStageScript();
  xb.add(virtualStageScript);

  // Configure XR Blocks options
  const options = new xb.Options();
  options.setAppTitle('AuraGold Studio ERP');
  options.setAppDescription(
    'Professional all-in-one studio management ERP for photography, videography, and audio mixing with 3D virtual stage.'
  );
  
  // Ensure DOM overlay or spatial interaction
  options.reticles.enabled = true;
  options.simulator.defaultMode = xb.SimulatorMode.CONTROLLER;

  try {
    await xb.init(options);
  } catch (err) {
    console.warn('XR Blocks initialization note:', err);
  }

  // Initialize the 2D/3D Studio Management Application
  const app = new StudioManagementApp(root, virtualStageScript);
  app.render();

  // If the user navigates to the 3D Stage tab, we can re-parent or adjust canvas
  const canvas = xb.core.renderer?.domElement;
  if (canvas) {
    // Keep canvas behind the root DOM or bring into view for 3D stage tab
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
  }
  
  root.style.position = 'relative';
  root.style.zIndex = '10';
  root.style.minHeight = '100vh';
});
