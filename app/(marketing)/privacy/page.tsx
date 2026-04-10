import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for McCarthy AI Automations.",
};

const EFFECTIVE_DATE = "April 9, 2026";

export default function PrivacyPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-zinc-500">Effective date: {EFFECTIVE_DATE}</p>

        <section className="mt-10 space-y-8 text-zinc-300">

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Introduction</h2>
            <p>
              McCarthy AI Automations (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) respects your privacy.
              This Privacy Policy explains what personal information we collect, how we use it, and
              your rights regarding that information. It applies to our website, client portal, and
              any services we provide.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Information We Collect</h2>
            <p>We collect the following categories of personal information:</p>
            <ul className="ml-4 list-disc space-y-2 text-zinc-400">
              <li>
                <span className="text-zinc-300 font-medium">Contact information</span> — name,
                email address, phone number, and company name submitted through our consultation
                form or direct communications.
              </li>
              <li>
                <span className="text-zinc-300 font-medium">Account information</span> — email
                address, authentication credentials, and session data when you access our client
                portal.
              </li>
              <li>
                <span className="text-zinc-300 font-medium">Project and billing data</span> —
                project status, milestones, support requests, and payment records associated with
                your engagement.
              </li>
              <li>
                <span className="text-zinc-300 font-medium">Usage data</span> — pages visited,
                actions taken in the portal, and general analytics to help us improve our services.
              </li>
              <li>
                <span className="text-zinc-300 font-medium">Communications</span> — content of
                support requests, messages, and emails you send us.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="ml-4 list-disc space-y-2 text-zinc-400">
              <li>Respond to consultation inquiries and onboard new clients</li>
              <li>Deliver, manage, and support your automation projects</li>
              <li>Send transactional emails (confirmations, invoices, project updates)</li>
              <li>Send follow-up communications related to your inquiry (you may opt out at any time)</li>
              <li>Process payments and maintain billing records</li>
              <li>Improve our website and services through aggregate analytics</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>
              We use AI tools to help classify and prioritize inbound consultation requests. This
              classification is used internally to route and respond more effectively; it is not used
              to make automated decisions that legally or significantly affect you.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Sub-Processors and Third-Party Services</h2>
            <p>
              We share data with the following third-party service providers (&ldquo;sub-processors&rdquo;) as
              necessary to operate our business. Each is bound by their own privacy and security
              commitments.
            </p>
            <div className="overflow-x-auto">
              <table className="mt-3 w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-zinc-400">
                    <th className="pb-2 pr-6 font-medium">Provider</th>
                    <th className="pb-2 pr-6 font-medium">Purpose</th>
                    <th className="pb-2 font-medium">Data shared</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-zinc-400">
                  <tr>
                    <td className="py-2.5 pr-6 text-zinc-300">Clerk</td>
                    <td className="py-2.5 pr-6">Authentication & session management</td>
                    <td className="py-2.5">Email, user ID</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-6 text-zinc-300">Supabase</td>
                    <td className="py-2.5 pr-6">Database (projects, billing, support)</td>
                    <td className="py-2.5">All project and contact data</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-6 text-zinc-300">Resend</td>
                    <td className="py-2.5 pr-6">Transactional email delivery</td>
                    <td className="py-2.5">Name, email, message content</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-6 text-zinc-300">Stripe</td>
                    <td className="py-2.5 pr-6">Payment processing</td>
                    <td className="py-2.5">Name, email, billing details</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-6 text-zinc-300">OpenAI</td>
                    <td className="py-2.5 pr-6">AI lead classification & assistant</td>
                    <td className="py-2.5">Consultation message content</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-6 text-zinc-300">Vercel</td>
                    <td className="py-2.5 pr-6">Website hosting & infrastructure</td>
                    <td className="py-2.5">Request logs, IP addresses</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-6 text-zinc-300">Zapier</td>
                    <td className="py-2.5 pr-6">Internal workflow automation</td>
                    <td className="py-2.5">Lead contact details (internal use only)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-sm text-zinc-500">
              We do not sell your personal information to any third party.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes
              described in this policy, maintain an active client relationship, or comply with legal
              obligations. Consultation inquiries that do not result in an engagement are typically
              retained for up to 24 months. You may request deletion at any time (see Section 7).
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">6. Cookies and Tracking</h2>
            <p>
              Our website may use functional cookies required for authentication (Clerk) and basic
              analytics. We do not use advertising cookies or cross-site tracking. You can manage
              cookies through your browser settings.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">7. Your Rights</h2>
            <p>
              Depending on your location, you may have the following rights regarding your personal
              information:
            </p>
            <ul className="ml-4 list-disc space-y-2 text-zinc-400">
              <li>
                <span className="text-zinc-300 font-medium">Access</span> — request a copy of the
                personal data we hold about you.
              </li>
              <li>
                <span className="text-zinc-300 font-medium">Correction</span> — request that we
                correct inaccurate or incomplete information.
              </li>
              <li>
                <span className="text-zinc-300 font-medium">Deletion</span> — request that we
                delete your personal data, subject to legal obligations.
              </li>
              <li>
                <span className="text-zinc-300 font-medium">Opt-out of marketing</span> — unsubscribe
                from follow-up emails at any time via the unsubscribe link in any email we send.
              </li>
              <li>
                <span className="text-zinc-300 font-medium">Data portability</span> — request your
                data in a machine-readable format where applicable.
              </li>
            </ul>
            <p>
              <span className="font-medium text-zinc-300">California residents (CCPA):</span> You have
              the right to know what personal information we collect, to delete it, to opt out of its
              sale (we do not sell it), and to non-discrimination for exercising your rights.
            </p>
            <p>
              <span className="font-medium text-zinc-300">EEA/UK residents (GDPR):</span> Our lawful
              basis for processing is generally contract performance (for active clients) and legitimate
              interest (for consultation inquiry follow-up). You may object to processing based on
              legitimate interest at any time.
            </p>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:mccarthyaiautomations@gmail.com"
                className="text-indigo-400 hover:text-indigo-300"
              >
                mccarthyaiautomations@gmail.com
              </a>
              . We will respond within 30 days.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">8. Security</h2>
            <p>
              We use industry-standard measures to protect your data, including encryption in transit
              (TLS), encrypted storage, access controls, and authentication best practices. However,
              no method of transmission over the internet is 100% secure, and we cannot guarantee
              absolute security.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Material changes will be communicated
              via email or a notice on this page. The effective date at the top of this page reflects
              the most recent revision.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">10. Contact</h2>
            <p>
              Questions or requests regarding this Privacy Policy can be sent to{" "}
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
