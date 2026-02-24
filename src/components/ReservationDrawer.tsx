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
  
  // Get city from item
  const city = item?.city || '';
  const isToronto = city.toLowerCase() === 'toronto';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      itemId: item?.id,
      itemName: item?.name,
      fullName, 
      email, 
      phone, 
      quantity,
      city,
      total: (item?.price || 0) * quantity 
    };
    // Make API call here
    setOrderId('ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase());
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#f5f5f0] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black">RESERVE ITEM</h2>
          <button onClick={() => onOpenChange(false)} className="text-2xl">×</button>
        </div>
        
        {item && (
          <div className="bg-white p-4 rounded-xl border-2 border-black mb-4">
            <p className="font-bold">{item.name}</p>
            <p className="text-xl font-black text-green-600">${item.price}</p>
            <p className="text-sm text-gray-600">{item.city}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type='text' 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)}
            placeholder='Full Name' 
            className="w-full p-3 border-2 border-gray-200 rounded-xl"
            required
          />
          <input 
            type='email' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email' 
            className="w-full p-3 border-2 border-gray-200 rounded-xl"
            required
          />
          <input 
            type='tel' 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            placeholder='Phone' 
            className="w-full p-3 border-2 border-gray-200 rounded-xl"
            required
          />
          <input 
            type='number' 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            placeholder='Quantity' 
            min="1"
            className="w-full p-3 border-2 border-gray-200 rounded-xl"
          />
          
          {/* Payment Methods Logic */}
          <div className="space-y-4">
            <p className="font-black text-sm tracking-widest text-center text-gray-500 uppercase">
              Payment Method
            </p>

            {isToronto && (
              <div className="bg-[#ffcc00] p-4 rounded-2xl border-2 border-black/10">
                <p className="font-black text-[10px] tracking-widest mb-2">
                  INTERAC e-TRANSFER (CANADA)
                </p>
                <p className="text-lg font-bold">rizzie052@gmail.com</p>
              </div>
            )}

            {!isToronto && (
              <>
                <div className="bg-white p-4 rounded-2xl border-2 border-green-500">
                  <img
                    src="/cashapp.png"
                    className="w-48 mx-auto"
                    alt="Cash App QR Code"
                  />
                  <p className="text-center font-bold text-2xl">$BradFlower</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200">
                  <p className="font-bold text-gray-900">Chime: $Bradley-Flower</p>
                </div>
              </>
            )}
          </div>

          <button 
            type='submit' 
            className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-black/80"
          >
            CONFIRM RESERVATION
          </button>
        </form>

        {orderId && (
          <div className="mt-4 p-4 bg-green-100 rounded-xl border-2 border-green-500">
            <p className="font-bold text-green-800">Order Confirmed!</p>
            <p className="text-sm">Your Order ID: {orderId}</p>
            <p className="text-sm mt-2">
              Payment via {isToronto ? 'Interac e-Transfer to rizzie052@gmail.com' : 'Cash App ($BradFlower) or Chime ($Bradley-Flower)'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
