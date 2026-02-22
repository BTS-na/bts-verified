import { Shield } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const CITY_MAP: Record<string, string> = {
  toronto: "Toronto Verified Access",
  losangeles: "Los Angeles Verified Access",
  tampa: "Tampa Verified Access",
};

const HeroSection = () => {
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city")?.toLowerCase() ?? "";
  const headline = CITY_MAP[city] || "BTS Arirang Tour \u2013 Verified Access";

  return (
    <section className="px-4 pb-6 pt-8">
      <div className="flex items-center gap-2 mb-1">
        <Shield className="h-5 w-5 text-foreground" strokeWidth={2.5} />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Verified Listing</span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{headline}</h1>
    </section>
  );
};

export default HeroSection;
