import React, { useRef, useState } from 'react';
import { safePlayVideo, stopVideoTracks, ensureNodeExists, safeStopScanner, isAbortError } from '@/utils/scannerUtils';

// Example safe scanner component. Replace scannerInstance usage with whatever scanner lib you use.
export default function SafeScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<any>(null);

  const start = async () => {
    setError(null);
    try {
      if (!videoRef.current) throw new Error('Video element not present.');
      // request camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      // try to play — handle AbortError specially
      await safePlayVideo(videoRef.current);

      // example: initialize scanner lib and set scannerRef.current
      // scannerRef.current = new SomeScannerLibrary({ video: videoRef.current });
      // await scannerRef.current.start();
      setScanning(true);
    } catch (err: any) {
      console.error('Scanner start exception:', err);
      if (isAbortError(err)) {
        setError('Scanner start failed: play was aborted because the media was removed.');
      } else if (err && (err as any).code === 'NODE_NOT_FOUND') {
        setError('Node cannot be found in the current page.');
      } else if (err && (err as any).code === 'SCAN_CLEAR_WHILE_RUNNING') {
        setError('Scanner start exception: Cannot clear while scan is ongoing, close it first.');
      } else {
        setError(String(err?.message || err));
      }
    }
  };

  const stop = async () => {
    try {
      // if you have a scanner library, stop it first
      if (scannerRef.current) {
        try { safeStopScanner(scannerRef.current); } catch (e) { console.warn('stop scanner error', e); }
      }
      stopVideoTracks(videoRef.current);
      if (videoRef.current) {
        try { videoRef.current.pause(); } catch (e) { /* ignore */ }
        videoRef.current.srcObject = null;
      }
      setScanning(false);
    } catch (err) {
      console.error('Scanner stop exception', err);
      setError(String(err?.message || err));
    }
  };

  const clearScannerSafely = () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        throw new Error('Cannot clear while scan is ongoing, close it first.');
      }
      if (scannerRef.current && typeof scannerRef.current.clear === 'function') scannerRef.current.clear();
    } catch (err: any) {
      console.warn('Scanner clear exception:', err);
      setError(err.message || String(err));
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative w-full bg-black/80 rounded">
        <video ref={videoRef} className="w-full h-64 object-cover rounded" playsInline muted />
      </div>

      <div className="flex gap-2">
        <button onClick={start} className="px-3 py-2 rounded bg-green-600 text-white">Start</button>
        <button onClick={stop} className="px-3 py-2 rounded bg-red-600 text-white">Stop</button>
        <button onClick={clearScannerSafely} className="px-3 py-2 rounded bg-yellow-600 text-white">Clear</button>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-black/60 p-2 rounded">
          <strong>Error:</strong>
          <div>{error}</div>
        </div>
      )}
    </div>
  );
}
