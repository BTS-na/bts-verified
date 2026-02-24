import { useState } from 'react';
import { Copy, Check, Clock, MessageCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface PaymentSectionProps {
  price: number;
  orderId: string;
}

export const PaymentSection = ({ price, orderId }: PaymentSectionProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [showBackup, setShowBackup] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4 mt-6">
      {/* 30-Minute Expiry Warning */}
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center gap-3">
        <Clock className="h-5 w-5 text-amber-600 animate-pulse" />
        <div>
          <p className="font-bold text-amber-900 text-sm">Action Required: Complete within 30 Minutes</p>
          <p className="text-xs text-amber-700">Inventory for Order #{orderId} is currently locked.</p>
        </div>
      </div>

      {/* Main Payment Method: Cash App */}
      <div className="bg-white rounded-2xl border-2 border-green-500 overflow-hidden shadow-lg">
        <div className="bg-green-500 p-3 flex justify-between items-center">
          <span className="text-white font-bold tracking-wide">CASH APP (PREFERRED)</span>
          <span className="bg-white text-green-600 text-[10px] font-black px-2 py-0.5 rounded-full">INSTANT VERIFICATION</span>
        </div>

        <div className="p-6 text-center">
          {/* QR Code Container */}
          <div className="relative inline-block bg-white p-3 rounded-2xl border border-gray-100 shadow-sm mb-4">
            <img 
              src="/cashapp.png" 
              alt="Scan to Pay" 
              className="w-52 h-52 object-contain rounded-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 rounded-full border-4 border-white">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-1">Scan above or pay manually to:</p>
          <h3 className="text-3xl font-black text-gray-900 mb-4">$BradFlower</h3>

          {/* Amount Box */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Exact Amount Required</p>
            <p className="text-4xl font-black text-green-600">${price.toLocaleString()}</p>
          </div>

          {/* Copy Button */}
          <button 
            onClick={() => copyToClipboard('$BradFlower', 'cashapp')}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all active:scale-95"
          >
            {copied === 'cashapp' ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
            {copied === 'cashapp' ? 'TAG COPIED TO CLIPBOARD' : 'COPY $CASHTAG'}
          </button>
        </div>
      </div>

      {/* Secondary Method: Chime */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="font-bold text-gray-900">Chime Transfer</p>
          <img src="https://upload.wikimedia.org" alt="Chime" className="h-4" />
        </div>
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div>
            <p className="text-xl font-bold text-gray-900">$Bradley-Flower</p>
            <p className="text-xs text-gray-500 uppercase tracking-tighter">Legal Name: Bradley Flower</p>
          </div>
          <button 
            onClick={() => copyToClipboard('$Bradley-Flower', 'chime')}
            className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
          >
            {copied === 'chime' ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Support / Backup Methods */}
      <div className="bg-indigo-50 rounded-2xl border border-indigo-100 overflow-hidden">
        <button 
          onClick={() => setShowBackup(!showBackup)}
          className="w-full p-5 flex items-center justify-between hover:bg-indigo-100/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-indigo-900">Need Zelle or Venmo?</p>
              <p className="text-xs text-indigo-700 font-medium">Text our desk for manual verification</p>
            </div>
          </div>
          {showBackup ? <ChevronUp className="h-5 w-5 text-indigo-400" /> : <ChevronDown className="h-5 w-5 text-indigo-400" />}
        </button>

        {showBackup && (
          <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-200">
            <div className="bg-white p-4 rounded-xl border border-indigo-200 text-center">
              <p className="text-sm text-gray-600 mb-3 font-medium">Include Order ID: <span className="font-mono text-indigo-600">#{orderId}</span></p>
              <div className="py-3 border-y border-dashed border-gray-200 mb-3">
                <p className="text-2xl font-black text-indigo-900 tracking-tighter">+1 (209) 421-9365</p>
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">
                Zelle and Venmo verification takes 5-10 minutes. <br />
                Tickets are transferred upon receipt.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Verified Footer */}
      <div className="pt-4 flex items-center justify-center gap-2 opacity-50">
        <ShieldCheck className="h-4 w-4" />
        <span className="text-[10px] font-bold tracking-widest uppercase">Brigit Verified Secure Transfer</span>
      </div>
    </div>
  );
};
