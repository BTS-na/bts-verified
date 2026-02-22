import { format } from "date-fns";

interface StickyHeaderProps {
  lastSync: Date | null;
}

const StickyHeader = ({ lastSync }: StickyHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-[480px] items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span className="text-sm font-semibold text-foreground">Live Access</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          Last Sync: {lastSync ? format(lastSync, "h:mm:ss a") : "--:--"}
        </span>
      </div>
    </header>
  );
};

export default StickyHeader;
