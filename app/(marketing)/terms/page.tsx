import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for McCarthy AI Automations.",
};

const EFFECTIVE_DATE = "April 9, 2026";

export default function TermsPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-zinc-500">Effective date: {EFFECTIVE_DATE}</p>

        <section className="mt-10 space-y-8 text-zinc-300">

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing or using the website, client portal, or any services offered by McCarthy AI
              Automations (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), you agree to be bound by these Terms of
              Service. If you do not agree, do not use our services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Services</h2>
            <p>
              McCarthy AI Automations provides AI automation consulting and implementation services,
              including but not limited to: website development, AI chatbot and voice agent deployment,
              CRM and workflow integrations, lead capture systems, and ongoing support and reporting.
            </p>
            <p>
              Specific deliverables, timelines, pricing, and support terms for each engagement are
              defined in a separate project proposal or statement of work (&ldquo;SOW&rdquo;) agreed upon by both
              parties. These Terms govern the general relationship between you and the Company; the SOW
              governs the specifics of each project.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Client Portal</h2>
            <p>
              Clients with active engagements may receive access to our client portal. Portal accounts
              are personal and non-transferable. You are responsible for maintaining the confidentiality
              of your credentials and for all activity that occurs under your account. Notify us
              immediately at{" "}
              <a
                href="mailto:mccarthyaiautomations@gmail.com"
                className="text-indigo-400 hover:text-indigo-300"
              >
                mccarthyaiautomations@gmail.com
              </a>{" "}
              if you suspect unauthorized access.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Payment</h2>
            <p>
              All fees are outlined in your SOW. Invoices are due within the timeframe specified.
              Overdue invoices may result in suspension of services. We reserve the right to charge
              interest on overdue amounts at the maximum rate permitted by applicable law.
            </p>
            <p>
              All sales are final unless otherwise stated in your SOW. Refunds, if applicable, are at
              our sole discretion and governed by the terms of your individual agreement.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Intellectual Property</h2>
            <p>
              Unless explicitly stated otherwise in your SOW, upon full payment of all invoices, you
              own the custom deliverables we build for you. We retain ownership of any pre-existing
              tools, templates, frameworks, or proprietary methods used in delivering those
              deliverables.
            </p>
            <p>
              All content on this website — including copy, design, and code — is the property of
              McCarthy AI Automations and may not be reproduced without written permission.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">6. Confidentiality</h2>
            <p>
              Both parties agree to keep confidential any non-public information shared in the course
              of the engagement, including business processes, technical systems, and client data.
              This obligation survives termination of the agreement.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">7. Disclaimer of Warranties</h2>
            <p>
              Our services are provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We make no warranties, express
              or implied, regarding uptime, fitness for a particular purpose, or specific business
              outcomes (e.g., lead volume, revenue). AI systems involve inherent variability; results
              may differ from estimates provided during scoping.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, McCarthy AI Automations shall not be liable for
              any indirect, incidental, consequential, or punitive damages arising from your use of our
              services. Our total liability for any claim shall not exceed the total fees paid by you
              in the three months preceding the claim.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">9. Termination</h2>
            <p>
              Either party may terminate an engagement as specified in the applicable SOW. We reserve
              the right to suspend or terminate your access to the client portal immediately if you
              violate these Terms, fail to pay outstanding invoices, or engage in conduct harmful to
              our systems or other clients.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the United States and the state in which the
              Company is registered, without regard to conflict of law provisions. Any disputes shall
              be resolved through good-faith negotiation; if unresolved, through binding arbitration.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">11. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Material changes will be communicated via
              email or a notice on this page. Continued use of our services after changes take effect
              constitutes acceptance of the revised Terms.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">12. Contact</h2>
            <p>
              Questions about these Terms? Reach us at{" "}
              <a
                href="mailto:mccarthyaiautomations@gmail.com"
                className="text-indigo-400 hover:text-indigo-300"
              >
                mccarthyaiautomations@gmail.com
              </a>
              .
            </p>
          </div>

        </section>
      </div>
    </div>
  );
}
