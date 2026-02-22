import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Shield, Clock, MapPin } from "lucide-react";
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
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">Secure Hold Confirmed</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Order ID</p>
              <p className="text-base font-bold text-foreground font-mono">{success.orderId}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Hold Expires In</p>
              <CountdownTimer expiresAt={success.expiresAt} />
            </div>

            <div className="rounded-lg bg-secondary p-4 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <p className="text-sm text-foreground leading-relaxed">
                  Your seats are held. Check your email for verification and payment instructions to finalize your Ticketmaster transfer.
                </p>
              </div>
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
