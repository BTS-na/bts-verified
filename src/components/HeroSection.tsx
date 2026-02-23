import { Shield, Heart, Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const CITY_MAP: Record<string, string> = {
  toronto: "Toronto Verified Access",
  losangeles: "Los Angeles Verified Access",
  tampa: "Tampa Verified Access",
};

const HeroSection = () => {
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city")?.toLowerCase() ?? "";
  const headline = CITY_MAP[city] || "BTS Arirang Tour";

  return (
    <section className="px-4 pb-6 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 bg-purple-100 text-purple-600 px-3 py-1.5 rounded-full">
          <Shield className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase">Verified Fan Access</span>
        </div>
        <div className="flex items-center gap-1.5 bg-green-100 text-green-600 px-3 py-1.5 rounded-full">
          <Heart className="h-4 w-4 fill-current" />
          <span className="text-xs font-semibold uppercase">Fan-to-Fan</span>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold mb-2">{headline}</h1>
      <p className="text-base text-gray-600 mb-4">
        Genuine tickets at fair prices. No scalpers, no markups — just ARMY helping ARMY.
      </p>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <Sparkles className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <p className="text-xs font-semibold">Verified</p>
          <p className="text-[10px] text-gray-500">Ticketmaster Transfer</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <Heart className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <p className="text-xs font-semibold">Fair Price</p>
          <p className="text-[10px] text-gray-500">Below Resale Market</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <Shield className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <p className="text-xs font-semibold">Secure</p>
          <p className="text-[10px] text-gray-500">Instant Hold & Pay</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
