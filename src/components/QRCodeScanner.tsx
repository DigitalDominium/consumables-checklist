import React, { useEffect, useRef, useState } from 'react';
import {
  Html5Qrcode,
  Html5QrcodeScannerState,
  Html5QrcodeSupportedFormats,
} from 'html5-qrcode';
import { Camera, AlertTriangle } from 'lucide-react';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
}

export default function QRCodeScanner({ onScan }: QRCodeScannerProps) {
  const scannerIdRef = useRef(
    `qr-reader-${Math.random().toString(36).substring(2, 10)}`
  );

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedRef = useRef(false);

  const [error, setError] = useState<string>('');
  const [isStarting, setIsStarting] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        setError('');
        setIsStarting(true);

        const scanner = new Html5Qrcode(scannerIdRef.current, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });

        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            // Guard: only fire once
            if (scannedRef.current || !isMounted) return;
            scannedRef.current = true;

            // FIX: fully stop + clear BEFORE calling onScan so the video
            // element is destroyed before React unmounts the component.
            // This prevents the camera feed from bleeding through during
            // the AnimatePresence exit animation.
            try {
              const state = scanner.getState();
              if (
                state === Html5QrcodeScannerState.SCANNING ||
                state === Html5QrcodeScannerState.PAUSED
              ) {
                await scanner.stop();
              }
              scanner.clear();
            } catch {
              // Ignore stop/clear errors — proceed regardless
            }

            if (decodedText.trim()) {
              onScan(decodedText.trim());
            }
          },
          () => {
            // Ignore per-frame scan failures (normal while scanning)
          }
        );

        if (isMounted) {
          setIsStarting(false);
        }
      } catch (err) {
        console.error('QR scanner error:', err);
        if (isMounted) {
          setError(
            'Unable to start camera. Please allow camera permission or use manual entry.'
          );
          setIsStarting(false);
        }
      }
    };

    startScanner();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      const scanner = scannerRef.current;
      if (scanner) {
        try {
          const state = scanner.getState();
          if (
            state === Html5QrcodeScannerState.SCANNING ||
            state === Html5QrcodeScannerState.PAUSED
          ) {
            scanner.stop().catch(() => {});
          }
        } catch { /* ignore */ }
        try { scanner.clear(); } catch { /* ignore */ }
      }
      scannerRef.current = null;
    };
  }, [onScan]);

  return (
    <div className="aspect-square bg-bg-main border border-border-bright rounded-lg overflow-hidden relative flex items-center justify-center">
      <div
        id={scannerIdRef.current}
        className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
      />

      {isStarting && !error && (
        <div className="absolute inset-0 bg-bg-main/80 flex flex-col items-center justify-center text-center p-4">
          <Camera size={32} className="text-brand-orange mb-3 animate-pulse" />
          <p className="text-xs text-text-dim uppercase tracking-widest">
            Starting camera...
          </p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-bg-main/90 flex flex-col items-center justify-center text-center p-4">
          <AlertTriangle size={32} className="text-brand-orange mb-3" />
          <p className="text-xs text-text-dim leading-relaxed">{error}</p>
        </div>
      )}

      {!error && (
        <div className="absolute inset-0 pointer-events-none border-2 border-brand-orange/40 rounded-lg">
          <div className="absolute top-1/2 left-1/2 w-[220px] h-[220px] -translate-x-1/2 -translate-y-1/2 border-2 border-brand-orange rounded-md shadow-[0_0_20px_rgba(255,132,0,0.25)]" />
        </div>
      )}
    </div>
  );
}
