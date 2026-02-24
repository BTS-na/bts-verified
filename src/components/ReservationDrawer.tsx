import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Shield, Clock, CheckCircle, Copy, Check } from "lucide-react";
import { submitReservation, type InventoryItem, type ReserveResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reservationSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,15}$/, "Valid phone required"),
  quantity: z.coerce.number().min(1).max(4),
});

type FormData = z.infer<typeof reservationSchema>;

interface ReservationDrawerProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated?: (orderId: string, expiresAt: string) => void;
}

const CountdownTimer = ({ expiresAt }: { expiresAt: string }) => {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const tick = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("Expired");
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setRemaining(`${mins}:${secs.toString().padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return (
    <div className="flex items-center gap-2 text-foreground">
      <Clock className="h-4 w-4" />
      <span className="text-lg font-bold tabular-nums">{remaining}</span>
    </div>
  );
};

// Inline Payment Instructions Component
const PaymentInstructions = ({ price, orderId }: { price: number; orderId: string }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-400 space-y-4">
      <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">
        ⚠️ Complete Payment in 30 Minutes
      </p>
      
      {/* Cash App */}
      <div className="bg-white p-4 rounded-2xl border-2 border-green-500 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="font-bold text-gray-900 text-lg sm:text-xl">Cash App (Preferred)</span>
          <span className="inline-flex w-fit bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Fastest</span>
        </div>
        
        {/* QR Code - Mobile First Responsive */}
        <div className="flex justify-center">
          <div className="w-full max-w-[260px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <img 
              src="/cashapp-qr.png" 
              alt="Cash App QR Code - $BradFlower"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Cash App Tag - Responsive Typography */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Or type manually:</p>
          <p className="text-3xl sm:text-4xl font-black text-green-600 tracking-tight">$BradFlower</p>
        </div>

        {/* Copy Button - Full Width on Mobile, 56px Touch Target */}
        <button 
          onClick={() => copyToClipboard('$BradFlower', 'cashapp')}
          className="w-full flex items-center justify-center gap-3 bg-green-600 text-white px-6 py-3 rounded-2xl text-base font-semibold hover:bg-green-700 active:bg-green-800 transition-colors h-14 sm:h-12"
        >
          {copied === 'cashapp' ? <Check className="h-6 w-6 sm:h-5 sm:w-5" /> : <Copy className="h-6 w-6 sm:h-5 sm:w-5" />}
          <span>{copied === 'cashapp' ? 'Copied to Clipboard!' : 'Copy Cashtag'}</span>
        </button>
        
        <p className="text-xs text-gray-600 text-center leading-relaxed">
          Scan QR code OR tap to copy <strong>$BradFlower</strong> · Send exactly <strong>${price}</strong>
        </p>
      </div>

      {/* Chime */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-bold text-gray-900 text-lg sm:text-base">Chime</p>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Also Fast</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl space-y-2">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Cashtag</p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">$Bradley-Flower</p>
            <p className="text-xs text-gray-500 mt-1">Bradley Flower</p>
          </div>
        </div>
        <button 
          onClick={() => copyToClipboard('$Bradley-Flower', 'chime')}
          className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-2xl text-base font-semibold hover:bg-gray-800 active:bg-gray-700 transition-colors h-14 sm:h-12"
        >
          {copied === 'chime' ? <Check className="h-6 w-6 sm:h-5 sm:w-5" /> : <Copy className="h-6 w-6 sm:h-5 sm:w-5" />}
          <span>{copied === 'chime' ? 'Copied!' : 'Copy Cashtag'}</span>
        </button>
      </div>

      {/* Interac e-Transfer Info */}
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 space-y-3">
        <div>
          <p className="font-bold text-blue-900 text-lg">Interac e-Transfer (Canada)</p>
          <p className="text-sm text-blue-700 mt-1">No security question needed for <strong>rizzie052@gmail.com</strong></p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-blue-100">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
          <p className="text-lg font-mono font-bold text-gray-900 break-all">rizzie052@gmail.com</p>
        </div>
        <p className="text-xs text-blue-700">
          Include Order ID <strong className="font-mono">{orderId}</strong> as the memo
        </p>
      </div>

      {/* Zelle/Venmo */}
      <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
        <p className="font-semibold text-orange-900 mb-2">Need Zelle or Venmo?</p>
        <p className="text-2xl sm:text-3xl font-black text-orange-900 tracking-tight">+1 (209) 421-9365</p>
        <p className="text-sm text-orange-700 mt-2 leading-relaxed">
          Text <strong className="font-mono font-bold">{orderId}</strong> to get your payment tag
        </p>
        <p className="text-xs text-gray-600 mt-2">Response within 5 minutes</p>
      </div>

      {/* Steps */}
      <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
        <p className="font-semibold text-purple-900 mb-3 text-base">Next Steps:</p>
        <ol className="text-sm text-purple-800 space-y-2 list-decimal pl-5">
          <li className="leading-relaxed">Send <strong className="text-lg font-bold">${price}</strong> via Cash App, Chime, or Interac</li>
          <li className="leading-relaxed">Screenshot the payment confirmation</li>
          <li className="leading-relaxed">Text screenshot + Order ID to <strong>+1 (209) 421-9365</strong></li>
        </ol>
        <div className="mt-4 p-3 bg-purple-100 rounded-xl text-center border border-purple-200">
          <p className="text-xs text-purple-600 uppercase tracking-wider mb-1">Order ID</p>
          <p className="text-lg sm:text-xl font-mono font-bold text-purple-900 break-all">{orderId}</p>
          <p className="text-xs text-purple-600 mt-1">Include this in your text</p>
        </div>
      </div>
    </div>
  );
};

const ReservationDrawer = ({ item, open, onOpenChange, onOrderCreated }: ReservationDrawerProps) => {
  const [success, setSuccess] = useState<ReserveResponse | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { quantity: 1 },
  });

  const mutation = useMutation({
    mutationFn: submitReservation,
    onSuccess: (data) => {
      setSuccess(data);
      onOrderCreated?.(data.orderId, data.expiresAt);
    },
  });

  const onSubmit = (data: FormData) => {
    if (!item) return;
    mutation.mutate({
      inventoryId: String(item.id),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      quantity: data.quantity,
      city: item.city,
      total: item.price * data.quantity,
      section: item.section,
      row: item.row,
    });
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setSuccess(null);
      reset();
      mutation.reset();
    }
    onOpenChange(o);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="w-full max-w-md mx-auto px-4 sm:px-0">
        {success ? (
          <div className="p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Success Header */}
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <div className="flex items-center justify-center gap-2 mb-1">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-lg font-bold text-green-800">Secure Hold Confirmed</span>
              </div>
              <p className="text-sm text-gray-600">Complete payment within 30 minutes</p>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Order ID</span>
                <span className="text-sm font-bold font-mono text-gray-900">{success.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Hold Expires</span>
                <CountdownTimer expiresAt={success.expiresAt} />
              </div>
              {item && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Seats</span>
                    <span className="text-sm font-medium text-gray-900">{item.section} Row {item.row}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount Due</span>
                    <span className="text-xl font-bold text-green-600">${item.price}</span>
                  </div>
                </>
              )}
            </div>

            {/* Payment Instructions - INLINE */}
            {item && (
              <PaymentInstructions 
                price={item.price} 
                orderId={success.orderId} 
              />
            )}

            {/* Screenshot Reminder */}
            <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
              <p className="text-xs text-blue-700 text-center">
                <strong>📸 Screenshot this page.</strong> Email may be delayed.
              </p>
            </div>
          </div>
        ) : (
          <>
            <DrawerHeader>
              <DrawerTitle className="text-lg font-bold">Reserve Seats</DrawerTitle>
              {item && (
                <DrawerDescription className="text-sm text-muted-foreground">
                  {item.section} &middot; Row {item.row} &middot; ${item.price.toLocaleString()}
                </DrawerDescription>
              )}
            </DrawerHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                <Input id="fullName" className="text-base" placeholder="Jane Doe" {...register("fullName")} />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input id="email" type="email" className="text-base" placeholder="jane@email.com" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                <Input id="phone" type="tel" className="text-base" placeholder="+1 555 123 4567" {...register("phone")} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Quantity</Label>
                <Select defaultValue="1" onValueChange={(v) => setValue("quantity", Number(v))}>
                  <SelectTrigger className="text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {mutation.isError && (
                <p className="text-xs text-destructive">Something went wrong. Please try again.</p>
              )}

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="btn-haptic w-full bg-primary text-primary-foreground font-semibold rounded-2xl h-12 text-base"
              >
                {mutation.isPending ? "Securing..." : "Confirm Reservation"}
              </Button>
            </form>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ReservationDrawer;
