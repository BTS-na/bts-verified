import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => (
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
      <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
      <p className="text-xs text-muted-foreground">Last updated: February 2026</p>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Information We Collect</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Brigit.work collects your <strong className="text-foreground">Name</strong>, <strong className="text-foreground">Email</strong>, and <strong className="text-foreground">Phone Number</strong> solely for the purpose of processing your ticket reservation and facilitating the Ticketmaster transfer. We do not collect any additional personal information beyond what is required to complete your transaction.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">No Third-Party Data Sales</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We do <strong className="text-foreground">not</strong> sell, rent, or share your personal data with any third parties for marketing or any other purpose. Your information is used exclusively for order fulfillment and communication related to your reservation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Data Security</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All data collected through Brigit.work is encrypted in transit and at rest via Lovable Cloud infrastructure. We employ industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Contact</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If you have questions about this Privacy Policy, please reach out to us through the communication channels provided on our website.
        </p>
      </section>
    </main>
  </div>
);

export default Privacy;
