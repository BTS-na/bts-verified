import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[640px] items-center px-4">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>
    </header>

    <main className="mx-auto max-w-[640px] px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
      <p className="text-xs text-muted-foreground">Last updated: February 2026</p>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Independence</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Brigit.work is an <strong className="text-foreground">independent ticket inventory desk</strong> and is <strong className="text-foreground">NOT affiliated with BTS, HYBE, or Ticketmaster</strong>. We operate independently to source and facilitate the transfer of verified tickets to customers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">The Transfer Process</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All tickets are delivered exclusively via <strong className="text-foreground">Ticketmaster Transfer</strong>. No physical tickets, PDFs, barcodes, or screenshots are provided. Tickets will be transferred directly to the Ticketmaster account associated with the email you provide during reservation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">The 30-Minute Rule</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Upon submitting a reservation, your selected seats are held for <strong className="text-foreground">30 minutes</strong>. If payment is not verified within this window, the hold expires and the inventory is automatically released back to the available pool.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Refund Policy</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Due to the nature of live events, <strong className="text-foreground">all sales are final</strong> once the Ticketmaster transfer has been accepted by the buyer. By completing a reservation and submitting payment, you acknowledge and agree to this no-refund policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Acceptance</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          By using Brigit.work and submitting a reservation, you confirm that you have read, understood, and agree to these Terms of Service.
        </p>
      </section>
    </main>
  </div>
);

export default Terms;
