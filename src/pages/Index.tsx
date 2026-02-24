import TestimonialsSection from "@/components/TestimonialsSection";
import { useState } from "react";
import { useInventory } from "@/hooks/use-inventory";
import type { InventoryItem } from "@/lib/api";
import StickyHeader from "@/components/StickyHeader";
import HeroSection from "@/components/HeroSection";
import InventoryCards from "@/components/InventoryCards";
import ReservationDrawer from "@/components/ReservationDrawer";
import SiteFooter from "@/components/SiteFooter";
import { InteracTransferCard } from "@/components/InteracTransferCard";

const Index = () => {
  const { data: inventory, isLoading, dataUpdatedAt } = useInventory();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleReserve = (item: InventoryItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StickyHeader lastSync={dataUpdatedAt ? new Date(dataUpdatedAt) : null} />
      <main className="mx-auto max-w-md px-4 pb-8">
        <HeroSection />
        <div className="py-6">
          <InteracTransferCard orderId="ORD-2024-001" />
        </div>
        <InventoryCards
          items={inventory ?? []}
          isLoading={isLoading}
          onReserve={handleReserve}
        />
        <TestimonialsSection />
        <SiteFooter />
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
