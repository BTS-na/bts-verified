import { useState } from 'react';
import { Copy, Check, CheckCircle2 } from 'lucide-react';

interface InteracTransferCardProps {
  orderId: string;
  recipientEmail?: string;
}

export const InteracTransferCard = ({ 
  orderId, 
  recipientEmail = 'rizzie052@gmail.com' 
}: InteracTransferCardProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100">
      {/* Header with Yellow Background */}
      <div className="bg-[#ffcc00] px-6 py-4">
        <h3 className="text-black font-bold text-lg tracking-tight">
          Interac e-Transfer (Canada) - Secure Auto-Deposit
        </h3>
      </div>

      {/* Card Content */}
      <div className="p-6 bg-white space-y-6">
        {/* Recipient Section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Recipient Email
          </label>
          <button
            onClick={() => copyToClipboard(recipientEmail, 'email')}
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:bg-gray-100 hover:border-gray-300 transition-all text-left group"
          >
            <p className="text-2xl font-black text-gray-900 break-all group-hover:text-blue-600 transition-colors">
              {recipientEmail}
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">Click to copy email address</p>
              {copied === 'email' ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              )}
            </div>
          </button>
        </div>

        {/* Required Memo Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Required Memo
          </label>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-600 font-semibold mb-2 uppercase tracking-wide">Order ID</p>
            <button
              onClick={() => copyToClipboard(orderId, 'orderId')}
              className="w-full text-left group"
            >
              <p className="text-xl font-bold text-blue-900 font-mono mb-2">
                {orderId}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-700">Click to copy</span>
                {copied === 'orderId' ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-blue-400 group-hover:text-blue-600" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Trust Signal Badge */}
        <div className="flex items-center gap-3 bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex-shrink-0">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-green-900 text-sm">
              Auto-Deposit Enabled
            </p>
            <p className="text-xs text-green-700">
              Funds will be automatically deposited upon verification
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">How it works:</span> Send the amount via Interac e-Transfer to the email above, include the Order ID as the memo, and funds will be automatically deposited to your account.
          </p>
        </div>
      </div>
    </div>
  );
};
