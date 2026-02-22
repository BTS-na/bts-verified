import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { InventoryItem } from "@/lib/api";

interface InventoryCardsProps {
  items: InventoryItem[];
  isLoading: boolean;
  onReserve: (item: InventoryItem) => void;
}

const InventoryCards = ({ items, isLoading, onReserve }: InventoryCardsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3 px-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 w-24 rounded bg-muted mb-3" />
              <div className="h-3 w-16 rounded bg-muted mb-4" />
              <div className="h-10 w-full rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <Clock className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-muted-foreground">
          Inventory Refreshing... Check back in 5 mins.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm font-semibold text-foreground">{item.section}</span>
              <span className="text-lg font-bold text-foreground">
                ${typeof item.price === "number" ? item.price.toLocaleString() : item.price}
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mb-4">Row {item.row}</p>
            <Button
              className="btn-haptic w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              onClick={() => onReserve(item)}
            >
              Reserve Seats
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InventoryCards;
