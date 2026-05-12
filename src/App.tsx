/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scan,
  Send,
  CheckCircle2,
  Package2,
} from 'lucide-react';

import QRCodeScanner from './components/QRCodeScanner';
import DiscrepancyChecklist from './components/DiscrepancyChecklist';

type AppStep = 'scan' | 'checklist' | 'success';

interface SubmissionData {
  qrCode: string;
  items: string[];
  timestamp: string;
}

export default function App() {
  const [step, setStep] = useState<AppStep>('scan');
  const [qrCode, setQrCode] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [history, setHistory] = useState<SubmissionData[]>([]);

  // Prevents repeated QR scans from firing multiple times
  const scanLocked = useRef(false);

  const handleScanSuccess = (data: unknown) => {
    if (scanLocked.current) return;

    let scannedValue = '';

    if (typeof data === 'string') {
      scannedValue = data;
    } else if (data && typeof data === 'object') {
      const result = data as {
        text?: string;
        rawValue?: string;
        getText?: () => string;
      };

      if (typeof result.text === 'string') {
        scannedValue = result.text;
      } else if (typeof result.rawValue === 'string') {
        scannedValue = result.rawValue;
      } else if (typeof result.getText === 'function') {
        scannedValue = result.getText();
      } else {
        scannedValue = JSON.stringify(result);
      }
    }

    if (!scannedValue.trim()) return;

    scanLocked.current = true;
    setQrCode(scannedValue.trim());
    setStep('checklist');
  };

  const handleSubmit = () => {
    if (!qrCode.trim()) return;

    const submission: SubmissionData = {
      qrCode,
      items: selectedItems,
      timestamp: new Date().toLocaleTimeString(),
    };

    setHistory((prevHistory) => [submission, ...prevHistory]);
    setStep('success');
  };

  const resetApp = () => {
    scanLocked.current = false;
    setQrCode('');
    setSelectedItems([]);
    setStep('scan');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-bg-main text-text-main font-sans overflow-hidden">
      {/* Header */}
      <header
        id="main-header"
        className="h-16 flex items-center justify-between px-8 bg-bg-header border-b border-border-dim flex-shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-orange rounded-sm flex items-center justify-center">
            <Package2 size={18} className="text-black" />
          </div>

          <h1 className="text-lg font-bold tracking-tight uppercase">
            Consumables Audit{' '}
            <span className="text-brand-orange">v2.4</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-text-dim uppercase tracking-widest leading-none mb-1">
              Operator
            </span>
            <span className="text-sm font-medium">
              David Raja — WH-04
            </span>
          </div>

          <div className="w-10 h-10 rounded-full bg-bg-card border border-border-bright flex items-center justify-center font-mono text-xs shadow-inner">
            DR
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* Left Column: Tracking & Status */}
        <div className="md:col-span-4 flex flex-col gap-6 overflow-hidden">
          <section className="bg-bg-app border border-border-dim rounded-xl p-5 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-text-dim">
                Active Scanner
              </h2>
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>

            <AnimatePresence mode="wait">
              {step === 'scan' ? (
                <motion.div
                  key="scanner-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <QRCodeScanner onScan={handleScanSuccess} />
                </motion.div>
              ) : (
                <motion.div
                  key="scanner-verified"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="aspect-square bg-brand-orange/5 border border-brand-orange/20 rounded-lg flex flex-col items-center justify-center gap-4 text-brand-orange p-6 text-center"
                >
                  <div className="p-4 bg-brand-orange/10 rounded-full">
                    <CheckCircle2 size={48} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1">
                      ID Verified
                    </p>
                    <p className="font-mono text-sm break-all">
                      {qrCode}
                    </p>
                  </div>

                  <button
                    onClick={resetApp}
                    className="mt-2 text-[10px] uppercase tracking-widest font-bold hover:underline"
                  >
                    Re-scan
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => {
                if (step === 'scan') {
                  handleScanSuccess('MANUAL-NODE-01');
                }
              }}
              className="w-full py-3 bg-bg-card hover:bg-border-bright text-xs font-bold uppercase tracking-[0.2em] transition-colors rounded-md border border-border-bright"
            >
              Manual Code Entry
            </button>
          </section>

          <section className="flex-1 bg-bg-app border border-border-dim rounded-xl p-5 overflow-hidden flex flex-col shadow-xl">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-text-dim mb-4">
              Last Scanned
            </h2>

            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
              {history.length > 0 ? (
                history.map((item, i) => (
                  <div
                    key={`${item.qrCode}-${item.timestamp}-${i}`}
                    className="p-3 bg-bg-main border-l-2 border-brand-orange rounded flex justify-between items-center group transition-all hover:bg-bg-card"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-brand-orange tracking-tighter truncate max-w-[120px]">
                        {item.qrCode}
                      </span>
                      <span className="text-[10px] text-text-dim">
                        {item.timestamp}
                      </span>
                    </div>

                    <span className="text-[10px] bg-brand-orange/10 text-brand-orange px-2 py-1 rounded font-bold uppercase">
                      Logged
                    </span>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center border border-dashed border-border-bright rounded p-8">
                  <p className="text-[10px] text-text-dim uppercase tracking-widest text-center">
                    No active session history
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Audit Form */}
        <div className="md:col-span-8 bg-bg-app border border-border-dim rounded-xl flex flex-col shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-border-dim flex items-center justify-between bg-bg-header/50">
            <div>
              <h2 className="text-xl font-light text-white tracking-tight">
                Discrepancy Checklist
              </h2>
              <p className="text-xs text-text-dim mt-1">
                Select items with quantity mismatch or damage.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetApp}
                className="px-4 py-2 text-xs font-bold text-text-dim hover:text-white transition-colors"
              >
                Reset
              </button>

              <button
                onClick={handleSubmit}
                disabled={selectedItems.length === 0 || step === 'scan'}
                className="px-6 py-2 text-xs font-bold bg-brand-orange text-black rounded-md hover:bg-brand-orange/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-orange/20 active:scale-95"
              >
                Submit Audit
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {step === 'success' ? (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8 bg-bg-main/50 border border-brand-orange/20 rounded-xl"
                >
                  <div className="p-4 bg-brand-orange/10 rounded-full mb-6 text-brand-orange">
                    <Send size={48} />
                  </div>

                  <h2 className="text-2xl font-bold mb-2">
                    Protocol Recorded
                  </h2>

                  <p className="text-text-dim text-sm max-w-xs mb-8">
                    Audit log{' '}
                    <span className="text-white font-mono">
                      {Date.now().toString(36).toUpperCase()}
                    </span>{' '}
                    has been synchronized with the central repository.
                  </p>

                  <button
                    onClick={resetApp}
                    className="px-10 py-3 bg-brand-orange text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-brand-orange/90 shadow-xl"
                  >
                    Acknowledge & New Session
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="checklist-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full"
                >
                  <DiscrepancyChecklist
                    selectedItems={selectedItems}
                    onChange={setSelectedItems}
                  />

                  {step === 'scan' && (
                    <div className="absolute inset-0 bg-bg-app/80 backdrop-blur-sm z-10 flex items-center justify-center text-center p-12">
                      <div className="max-w-xs">
                        <Scan
                          size={32}
                          className="mx-auto mb-4 text-brand-orange animate-pulse"
                        />

                        <h3 className="text-lg font-bold mb-2">
                          Scanner Required
                        </h3>

                        <p className="text-xs text-text-dim uppercase tracking-widest leading-loose">
                          Please verify your workstation or pallet ID using the
                          scanner in the left panel to unlock the checklist.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-10 px-8 bg-bg-header border-t border-border-dim flex items-center justify-between text-[10px] uppercase tracking-widest text-text-dim font-mono flex-shrink-0">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
            Relay Status: Linked
          </span>

          <span>
            DB Sync: <span className="text-white">Active</span>
          </span>
        </div>

        <div className="flex gap-6">
          <span className="hidden sm:inline">
            WH_NODE: <span className="text-white">SE-42-DIST</span>
          </span>

          <span>
            Battery: <span className="text-white">88%</span>
          </span>

          <span className="text-[8px] opacity-40">
            UTC: {new Date().toISOString().replace('T', ' ').slice(0, 19)}
          </span>
        </div>
      </footer>
    </div>
  );
}
