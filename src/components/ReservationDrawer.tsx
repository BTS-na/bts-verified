import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import type { InventoryItem } from '@/lib/api';

interface ReservationDrawerProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReservationDrawer: React.FC<ReservationDrawerProps> = ({ item, open, onOpenChange }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isToronto = item?.city === 'Toronto';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          item: {
            id: item?.id,
            section: item?.section,
            row: item?.row,
            price: item?.price,
            city: item?.city,
            venue: item?.venue,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit reservation');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');

      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-screen">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>Reserve Tickets</DrawerTitle>
          <DrawerClose />
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-6">
          {item && (
            <>  
              <div className="mb-6 bg-muted p-4 rounded-lg">
                <p className="text-sm font-semibold text-foreground">{item.section}</p>
                <p className="text-xs text-muted-foreground">Row {item.row}</p>
                <p className="text-lg font-bold text-foreground mt-1">${item.price.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-2">{item.city} • {item.venue}</p>
              </div>

              {success ? (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center mb-4">
                  <p className="text-green-900 font-semibold">Reservation submitted!</p>
                  <p className="text-green-800 text-sm mt-1">Check your email for details.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Phone</label>
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  {/* Payment Methods Logic */}
                  <div className="space-y-4 mt-6 pt-4 border-t">
                    <p className="font-semibold text-sm text-foreground">Payment Method</p>
                    
                    {/* 1. Show Interac ONLY for Toronto */}
                    {isToronto && (
                      <div className="bg-[#ffcc00] p-4 rounded-2xl border-2 border-black/10">
                        <p className="font-black text-[10px] tracking-widest mb-2">
                          INTERAC e-TRANSFER (CANADA)
                        </p>
                        <p className="text-lg font-bold">rizzie052@gmail.com</p>
                      </div>
                    )}

                    {/* 2. Show Cash App & Chime ONLY for Non-Toronto */}
                    {!isToronto && (
                      <>
                        <div className="bg-white p-4 rounded-2xl border-2 border-green-500">
                          <img 
                            src="/cashapp.png" 
                            className="w-48 mx-auto" 
                            alt="Cash App QR Code" 
                          />
                          <p className="text-center font-bold text-2xl mt-2">$BradFlower</p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-gray-200">
                          <p className="font-bold text-gray-900">Chime: $Bradley-Flower</p>
                        </div>
                      </>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                      <p className="text-red-900 text-sm">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Complete Reservation'}
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};