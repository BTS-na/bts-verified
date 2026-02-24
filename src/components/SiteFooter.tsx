import { Link } from "react-router-dom";

const SiteFooter = () => (
  <footer className="border-t border-border py-6 mt-8">
    <div className="mx-auto max-w-md px-4 text-center space-y-2">
      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        <span>·</span>
        <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
      </div>
      <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
        © 2026 Brigit.work Access Desk. All Rights Reserved.<br />
        All trademarks belong to their respective owners.
      </p>
    </div>
  </footer>
);

export default SiteFooter;
