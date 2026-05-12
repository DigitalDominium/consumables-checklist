import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera } from "lucide-react";

type QRCodeScannerProps = {
  onScan: (data: string) => void;
};

export default function QRCodeScanner({ onScan }: QRCodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasStartedRef = useRef(false);
  const [status, setStatus] = useState("Starting camera...");

  useEffect(() => {
    const startScanner = async () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      try {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },
          async (decodedText: string) => {
            setStatus("QR scanned successfully");

            try {
              await scanner.stop();
              await scanner.clear();
            } catch {
              // Ignore cleanup errors
            }

            onScan(decodedText);
          },
          () => {
            // Ignore normal scan misses
          }
        );

        setStatus("Point camera at the QR code");
      } catch (error) {
        console.error(error);
        setStatus("Camera failed. Refresh page and allow camera permission.");
      }
    };

    startScanner();

    return () => {
      const scanner = scannerRef.current;

      if (scanner) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div className="w-full">
      <div className="aspect-square bg-black rounded-lg overflow-hidden border border-border-bright flex items-center justify-center relative">
        <div id="qr-reader" className="w-full h-full"></div>

        <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded flex items-center gap-2">
          <Camera size={12} />
          Live Camera
        </div>
      </div>

      <p className="text-[10px] text-text-dim uppercase tracking-widest text-center mt-3">
        {status}
      </p>
    </div>
  );
}
