"use client";

import Image from "next/image";
import { X, Copy, CheckCircle2, Smartphone, ExternalLink } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface UpiModalProps {
  amount: number;
  onConfirm: () => void;
  onCancel: () => void;
  confirming: boolean;
}

export default function UpiModal({ amount, onConfirm, onCancel, confirming }: UpiModalProps) {
  const [copied, setCopied] = useState(false);

  const upiId = process.env.NEXT_PUBLIC_UPI_ID || "amvakitchen@paytm";
  const upiName = process.env.NEXT_PUBLIC_UPI_NAME || "AmVa Kitchen & Bar";

  // UPI deep link — opens GPay / PhonePe / Paytm directly on mobile
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent("AmVa Kitchen Order")}`;

  // QR code via free API (no package needed)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}&bgcolor=0d0a04&color=D4A017&margin=12`;

  function copyUpiId() {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-black/90 backdrop-blur-md" onClick={onCancel} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-brand-dark border border-brand-gold/20 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Pay via UPI</h3>
            <p className="text-white/40 text-xs mt-0.5">Scan QR or open your UPI app</p>
          </div>
          <button onClick={onCancel} className="text-white/30 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount banner */}
        <div className="bg-brand-gold/10 border-b border-brand-gold/20 px-5 py-3 flex items-center justify-between">
          <span className="text-white/60 text-sm">Amount to Pay</span>
          <span className="font-display text-2xl font-black text-brand-gold">₹{amount.toFixed(0)}</span>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-4 px-5 py-6">
          <div className="relative border border-brand-gold/30 p-1 bg-[#0d0a04]">
            <Image
              src={qrUrl}
              alt="UPI QR Code"
              width={220}
              height={220}
              unoptimized
              className="block"
            />
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-gold" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-gold" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-gold" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-gold" />
          </div>

          <p className="text-white/40 text-xs text-center leading-relaxed">
            Open <span className="text-white/70">Google Pay, PhonePe, Paytm</span> or any UPI app — scan this QR code
          </p>

          {/* UPI ID copy */}
          <div className="w-full flex items-center gap-2 bg-brand-black border border-white/10 px-3 py-2.5">
            <div className="flex-1 min-w-0">
              <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase">UPI ID</p>
              <p className="text-white font-mono text-sm mt-0.5 truncate">{upiId}</p>
            </div>
            <button
              onClick={copyUpiId}
              className={`shrink-0 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 border transition-all ${
                copied
                  ? "border-green-500 text-green-400 bg-green-500/10"
                  : "border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
              }`}
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* Open in UPI App — for mobile */}
          <a
            href={upiLink}
            className="w-full flex items-center justify-center gap-2 border border-white/10 text-white/60 hover:border-brand-gold hover:text-brand-gold transition-colors py-3 text-sm font-bold tracking-wide"
          >
            <Smartphone className="w-4 h-4" />
            Open in UPI App
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Footer — confirm after paying */}
        <div className="px-5 pb-5 flex flex-col gap-2 border-t border-white/5 pt-4">
          <p className="text-white/30 text-xs text-center mb-1">
            After completing payment, tap the button below
          </p>
          <button
            onClick={onConfirm}
            disabled={confirming}
            className="w-full bg-brand-gold text-brand-black font-black py-4 text-sm tracking-wider uppercase hover:bg-brand-gold/90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {confirming ? (
              "Confirming..."
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> I&apos;ve Paid — Place Order</>
            )}
          </button>
          <button onClick={onCancel} className="text-white/30 text-xs text-center hover:text-white/60 transition-colors py-1">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
