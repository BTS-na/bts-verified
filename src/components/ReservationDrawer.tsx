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
    <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-400 space-y-4">
      <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">
        ⚠️ Complete Payment in 30 Minutes
      </p>
      
      {/* Cash App */}
      <div className="bg-white p-4 rounded-lg border-2 border-green-500">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-gray-900 text-lg">Cash App (Preferred)</span>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Fastest</span>
        </div>
        
        {/* QR Code */}
        <div className="flex justify-center mb-3">
          <div className="bg-white p-2 rounded-lg border border-gray-200">
            <img 
              src="/cashapp-qr.png" 
              alt="Cash App QR Code - $BradFlower"
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>

        {/* Cash App Tag */}
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
      <div className="bg-white p-4 rounded-lg border border-gray-200">
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

      {/* Zelle/Venmo */}
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <p className="font-medium text-orange-900 mb-1">Need Zelle or Venmo?</p>
        <p className="text-2xl font-bold text-orange-900">+1 (209) 421-9365</p>
        <p className="text-sm text-orange-700 mt-1">
          Text <strong className="font-mono">"{orderId}"</strong> for payment tag
        </p>
        <p className="text-xs text-gray-500 mt-2">
          We'll text back the Zelle or Venmo tag within 5 minutes
        </p>
      </div>

      {/* Steps */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <p className="font-semibold text-purple-800 mb-2">Next Steps:</p>
        <ol className="text-sm text-purple-700 space-y-2 list-decimal pl-4">
          <li>Send <strong className="text-lg">${price}</strong> via Cash App or Chime</li>
          <li>Screenshot the payment confirmation</li>
          <li>Text screenshot + Order ID to <strong>+1 (209) 421-9365</strong></li>
        </ol>
        <div className="mt-3 p-2 bg-purple-100 rounded text-center">
          <p className="text-sm font-mono font-bold text-purple-900 text-lg">{orderId}</p>
          <p className="text-xs text-purple-600">Include this Order ID in your text</p>
        </div>
      </div>
    </div>
  );
};

const ReservationDrawer = ({ item, open, onOpenChange }: ReservationDrawerProps) => {
  const [success, setSuccess] = useState<ReserveResponse | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { quantity: 1 },
  });

  const mutation = useMutation({
    mutationFn: submitReservation,
    onSuccess: (data) => setSuccess(data),
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
      <DrawerContent className="max-w-[480px] mx-auto">
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
                className="btn-haptic w-full bg-primary text-primary-foreground font-semibold"
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
