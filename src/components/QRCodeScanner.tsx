import React from 'react';
import { QrReader } from 'react-qr-reader';
import { Scan } from 'lucide-react';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan }) => {
  return (
    <div id="qr-scanner-container" className="relative w-full aspect-square bg-black rounded-lg overflow-hidden border border-border-bright group">
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3E4248_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <QrReader
        constraints={{ facingMode: 'environment' }}
        onResult={(result, error) => {
          if (result) {
            const text = (result as any).getText?.() || (result as any).text;
            if (text) onScan(text);
          }
        }}
        containerStyle={{ width: '100%', height: '100%' }}
        videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      
      {/* Technical Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corners */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-brand-orange"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-brand-orange"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-brand-orange"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-brand-orange"></div>
        
        {/* Viewport Frame */}
        <div className="absolute inset-8 border border-white/5 flex flex-col items-center justify-center gap-4">
           {onScan && (
             <>
               <div className="w-16 h-16 text-white/10 flex items-center justify-center">
                 <Scan size={48} className="opacity-20" />
               </div>
               <p className="text-[10px] text-white/40 font-mono tracking-tighter">ALIGNING_VIEWPORT...</p>
             </>
           )}
        </div>
        
        {/* Scanning Line */}
        <div className="absolute w-full h-[1px] bg-brand-orange/50 shadow-[0_0_15px_rgba(249,115,22,0.5)] top-1/2 -translate-y-1/2 animate-[scan_2s_ease-in-out_infinite]"></div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
};

export default QRCodeScanner;
