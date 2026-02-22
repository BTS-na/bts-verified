import { useQuery } from "@tanstack/react-query";
import { fetchInventory } from "@/lib/api";

export const useInventory = () => {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
    refetchInterval: 30000,
  });
};
