// Utility helpers for robust QR/video scanner handling
// Provides safe play/stop helpers and common error messages mapping

export function ensureNodeExists(node: Element | null, message?: string) {
  if (!node) {
    const msg = message || 'Node cannot be found in the current page.';
    const err = new Error(msg);
    // Keep a recognizable name for easier detection
    (err as any).code = 'NODE_NOT_FOUND';
    throw err;
  }
  return node;
}

export async function safePlayVideo(video: HTMLVideoElement | null) {
  if (!video) throw new Error('Video element not available');
  try {
    // play() returns a promise that may reject with AbortError if media removed
    await video.play();
  } catch (err: any) {
    // Normalize AbortError message so callers can respond gracefully
    if (err && err.name === 'AbortError') {
      const e = new Error('The play() request was interrupted because the media was removed from the document.');
      (e as any).code = 'ABORTED_PLAY';
      throw e;
    }
    throw err;
  }
}

export function safeStopScanner(scanner: any) {
  // scanner is an abstraction (could be a library object). We try common methods.
  if (!scanner) return;
  try {
    if (typeof scanner.stop === 'function') {
      scanner.stop();
      return;
    }
    if (typeof scanner.clear === 'function') {
      // Clear should only be called when not scanning — caller must check
      scanner.clear();
      return;
    }
    // If no stop/clear available, attempt to set a flag
    scanner._stopped = true;
  } catch (err: any) {
    // Re-throw with clearer message if it's due to calling clear while scanning
    if (err && /clear while scan is ongoing/i.test(err.message)) {
      const e = new Error('Cannot clear while scan is ongoing, close it first.');
      (e as any).code = 'SCAN_CLEAR_WHILE_RUNNING';
      throw e;
    }
    throw err;
  }
}

// Helper to attempt a graceful shutdown of media tracks attached to a video element
export function stopVideoTracks(video: HTMLVideoElement | null) {
  if (!video) return;
  try {
    const stream = video.srcObject as MediaStream | null;
    if (stream) {
      stream.getTracks().forEach((t) => {
        try { t.stop(); } catch (e) { /* swallow */ }
      });
      video.srcObject = null;
    }
  } catch (err) {
    // swallow — stopping tracks is best-effort
  }
}

export function isAbortError(err: any) {
  return err && (err.name === 'AbortError' || (err.code && err.code === 'ABORTED_PLAY'));
}
