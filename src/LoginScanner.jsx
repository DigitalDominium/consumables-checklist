// src/LoginScanner.jsx
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function LoginScanner({ onLogin }) {
  const scannerRef = useRef(null);
  const [message, setMessage] = useState("Point camera at the Login QR code");

  useEffect(() => {
    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode("login-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            const value = decodedText.trim();

            if (value === "LOGIN") {
              setMessage("Login successful");

              try {
                await scanner.stop();
                await scanner.clear();
              } catch {}

              onLogin();
            } else {
              setMessage(`Wrong QR scanned: ${value}`);
            }
          },
          () => {}
        );
      } catch (err) {
        setMessage("Camera failed to start. Please refresh and allow camera.");
        console.error(err);
      }
    };

    startScanner();

    return () => {
      const scanner = scannerRef.current;
      if (scanner) {
        scanner.stop().then(() => scanner.clear()).catch(() => {});
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
