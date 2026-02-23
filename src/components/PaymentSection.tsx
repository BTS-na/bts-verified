import { useState } from 'react';
import { Copy, Check, Clock, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

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
    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-5 w-5 text-yellow-700" />
        <p className="font-semibold text-yellow-800">Complete Payment Within 30 Minutes</p>
      </div>

      {/* Cash App - QR + Tag Together */}
      <div className="bg-white p-4 rounded-lg border-2 border-green-500 mb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-gray-900 text-lg">Cash App (Preferred)</p>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Fastest</span>
        </div>
        
        {/* QR Code */}
        <div className="flex justify-center mb-3">
          <div className="bg-white p-2 rounded-lg border border-gray-200">
            <img 
              src="/cashapp-qr.png" 
              alt="Cash App QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>

        {/* Cash App Tag - Big and Clear */}
        <div className="text-center mb-3">
          <p className="text-sm text-gray-500 mb-1">Or type manually:</p>
          <p className="text-3xl font-bold text-green-600 tracking-wide">$BradFlower</p>
        </div>

        {/* Copy Button */}
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Cashtag</p>
            <p className="text-xl font-bold text-green-600">$BradFlower</p>
          </div>
          <button 
            onClick={() => copyToClipboard('$BradFlower', 'cashapp')}
            className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            {copied === 'cashapp' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'cashapp' ? 'Copied!' : 'Copy Tag'}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          Scan QR code OR type <strong>$BradFlower</strong> • Send exact amount: <strong>${price}</strong>
        </p>
      </div>

      {/* Chime */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
        <p className="font-bold text-gray-900 mb-2">Chime</p>
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">$ChimeSign</p>
            <p className="text-lg font-bold text-green-700">$Bradley-Flower</p>
            <p className="text-xs text-gray-500">Bradley Flower</p>
          </div>
          <button 
            onClick={() => copyToClipboard('$Bradley-Flower', 'chime')}
            className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            {copied === 'chime' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'chime' ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Zelle/Venmo - Text Only */}
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <button 
          onClick={() => setShowBackup(!showBackup)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-orange-600" />
            <div>
              <p className="font-medium text-orange-900">Need Zelle or Venmo?</p>
              <p className="text-sm text-orange-700">Available by text request</p>
            </div>
          </div>
          {showBackup ? <ChevronUp className="h-5 w-5 text-orange-600" /> : <ChevronDown className="h-5 w-5 text-orange-600" />}
        </button>

        {showBackup && (
          <div className="mt-3 pt-3 border-t border-orange-200">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                Don't have Cash App or Chime? We accept <strong>Zelle</strong> and <strong>Venmo</strong> by request.
              </p>
              <div className="bg-orange-100 p-3 rounded-lg text-center">
                <p className="text-sm font-medium text-orange-800 mb-1">Text for payment tag:</p>
                <p className="text-2xl font-bold text-orange-900">+1 (209) 421-9365</p>
                <p className="text-xs text-orange-700 mt-1">Include Order ID: <strong className="font-mono">{orderId}</strong></p>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                We'll text back the Zelle or Venmo tag within 5 minutes
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-purple-50 p-
