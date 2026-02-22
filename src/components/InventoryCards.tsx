import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { InventoryItem } from "@/lib/api";
import { useMemo } from "react";

interface InventoryCardsProps {
  items: InventoryItem[];
  isLoading: boolean;
  onReserve: (item: InventoryItem) => void;
}

interface CityGroup {
  city: string;
  venue: string;
  items: InventoryItem[];
}

const InventoryCards = ({ items, isLoading, onReserve }: InventoryCardsProps) => {
  const grouped = useMemo<CityGroup[]>(() => {
    const map = new Map<string, CityGroup>();
    for (const item of items) {
      const key = item.city;
      if (!map.has(key)) {
        map.set(key, { city: item.city, venue: item.venue, items: [] });
      }
      map.get(key)!.items.push(item);
    }
    return Array.from(map.values());
  }, [items]);

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
    <Accordion type="multiple" defaultValue={grouped.map((g) => g.city)} className="px-4">
      {grouped.map((group) => (
        <AccordionItem key={group.city} value={group.city} className="border-b-0 mb-4">
          <AccordionTrigger className="hover:no-underline py-3 px-0">
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-base font-bold text-foreground">{group.city}</span>
              <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {group.venue}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="space-y-3">
              {group.items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-sm font-semibold text-foreground">{item.section}</span>
                      <span className="text-lg font-bold text-foreground">
                        ${item.price.toLocaleString()}
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
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default InventoryCards;
