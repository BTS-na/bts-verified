import React from 'react';
import type { InventoryItem } from "@/lib/api";

interface ReservationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

export const ReservationDrawer = ({ open, onOpenChange, item }: ReservationDrawerProps) => {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [orderId, setOrderId] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const city = item?.city || '';
  const isToronto = city.toLowerCase() === 'toronto';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    // 1. Generate Order ID
    const generatedId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const totalAmount = (item?.price || 0) * quantity;

    const payload = { 
      orderId: generatedId,
      itemId: item?.id,
      itemName: item?.name,
      fullName, 
      email, 
      phone, 
      quantity,
      city,
      total: totalAmount 
    };

    try {
      // 2. Trigger Telegram & Email via Vercel API
      const response = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setOrderId(generatedId);
      } else {
        alert("Verification server busy. Please try again.");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("System connection error. Check your internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#f5f5f0] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black tracking-tighter">RESERVE TICKETS</h2>
          <button onClick={() => onOpenChange(false)} className="text-3xl font-light hover:rotate-90 transition-transform">×</button>
        </div>
        
        {item && (
          <div className="bg-white p-4 rounded-xl border-2 border-black mb-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">{item.city}</p>
              </div>
              <p className="text-2xl font-black text-green-600">${item.price}</p>
            </div>
          </div>
        )}

        {!orderId ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Contact Information</label>
              <input 
                type='text' 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                placeholder='Full Name' 
                className="w-full p-4 bg-white border-2 border-gray-100 rounded-xl focus:border-black outline-none transition-colors"
                required
              />
            </div>
            
            <input 
              type='email' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email Address' 
              className="w-full p-4 bg-white border-2 border-gray-100 rounded-xl focus:border-black outline-none transition-colors"
              required
            />
            
            <div className="flex gap-2">
              <input 
                type='tel' 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder='Phone' 
                className="w-2/3 p-4 bg-white border-2 border-gray-100 rounded-xl focus:border-black outline-none transition-colors"
                required
              />
              <input 
                type='number' 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                placeholder='Qty' 
                min="1"
                className="w-1/3 p-4 bg-white border-2 border-gray-100 rounded-xl focus:border-black outline-none transition-colors"
              />
            </div>

            <button 
              type='submit' 
              disabled={isSubmitting}
              className="w-full bg-black text-white font-black py-5 rounded-xl hover:bg-zinc-800 transition-all active:scale-95 disabled:bg-gray-400"
            >
              {isSubmitting ? 'INITIALIZING...' : 'CONFIRM RESERVATION'}
            </button>
            <p className="text-[10px] text-center text-gray-400">By clicking, you agree to our 30-minute reservation lock policy.</p>
          </form>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="p-4 bg-green-50 rounded-xl border-2 border-green-500 text-center">
              <p className="font-black text-green-900">RESERVATION SECURED</p>
              <p className="text-xs font-mono mt-1">Order ID: {orderId}</p>
            </div>

            <div className="space-y-4">
              <p className="font-black text-xs tracking-widest text-center text-gray-400 uppercase">
                Required Payment Method
              </p>

              {isToronto ? (
                <div className="bg-[#ffcc00] p-5 rounded-2xl border-b-4 border-black/10 text-center">
                  <p className="font-black text-[10px] tracking-widest mb-3 opacity-70 italic">INTERAC e-TRANSFER (CANADA)</p>
                  <p className="text-xl font-bold text-black break-all">rizzie052@gmail.com</p>
                  <p className="text-[10px] font-bold mt-3 text-black/60 uppercase tracking-tighter">✓ Auto-Deposit Enabled • Instant Verification</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-white p-5 rounded-2xl border-2 border-green-500 shadow-sm text-center">
                    <img src="/cashapp.png" className="w-40 mx-auto mb-3" alt="Cash App QR" />
                    <p className="text-3xl font-black text-gray-900">$BradFlower</p>
                    <p className="text-[10px] font-bold text-green-600 mt-2">CASH APP (PREFERRED)</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-400">CHIME</span>
                    <span className="font-bold text-gray-900">$Bradley-Flower</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-zinc-900 rounded-xl text-white">
              <p className="text-[11px] leading-relaxed opacity-80">
                <strong>Next Step:</strong> Complete payment within 30 minutes. Once verified, tickets will be transferred immediately via Ticketmaster to <strong>{email}</strong>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
