import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type LoginScannerProps = {
  onLogin: () => void;
};

export default function LoginScanner({ onLogin }: LoginScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasStartedRef = useRef(false);
  const [message, setMessage] = useState("Point camera at the Login QR code");

  useEffect(() => {
    const startScanner = async () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      try {
        const scanner = new Html5Qrcode("login-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText: string) => {
            const value = decodedText.trim();

            if (value === "LOGIN") {
              setMessage("Login successful");

              try {
                await scanner.stop();
                await scanner.clear();
              } catch {
                // Ignore cleanup error
              }

              onLogin();
            } else {
              setMessage(`Wrong QR scanned: ${value}`);
            }
          },
          () => {
            // Ignore scan failures while camera is running
          }
        );
      } catch (error) {
        console.error(error);
        setMessage("Camera failed to start. Refresh and allow camera permission.");
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
  }, [onLogin]);

  return (
    <div className="scanner-page">
      <h2>Scan Login QR Code</h2>

      <div id="login-reader" className="qr-reader"></div>

      <p>{message}</p>
    </div>
  );
}
