import { useState } from "react";
import { useInventory } from "@/hooks/use-inventory";
import type { InventoryItem } from "@/lib/api";
import StickyHeader from "@/components/StickyHeader";
import HeroSection from "@/components/HeroSection";
import InventoryCards from "@/components/InventoryCards";
import ReservationDrawer from "@/components/ReservationDrawer";

const Index = () => {
  const { data: inventory, isLoading, dataUpdatedAt } = useInventory();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleReserve = (item: InventoryItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <StickyHeader lastSync={dataUpdatedAt ? new Date(dataUpdatedAt) : null} />
      <main className="mx-auto max-w-[480px] pb-8">
        <HeroSection />
        <InventoryCards
          items={inventory ?? []}
          isLoading={isLoading}
          onReserve={handleReserve}
        />
      </main>
      <ReservationDrawer
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
};

export default Index;
