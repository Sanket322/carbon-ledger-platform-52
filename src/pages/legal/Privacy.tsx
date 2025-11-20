import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-4xl font-bold text-foreground">Privacy Policy</h1>

          <Card className="p-8">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <p className="text-muted-foreground">Last Updated: November 2025</p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">1. Information We Collect</h2>
              <p className="text-muted-foreground">We collect the following types of information:</p>

              <h3 className="mt-6 text-xl font-semibold text-foreground">Account Information</h3>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Name, email address, phone number</li>
                <li>Company name and registration details</li>
                <li>KYC documents (identity proof, business registration)</li>
                <li>Payment information (processed by Razorpay/Stripe)</li>
              </ul>

              <h3 className="mt-6 text-xl font-semibold text-foreground">Project Information</h3>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Project documentation and certificates</li>
                <li>Energy generation and monitoring data</li>
                <li>Registry verification documents</li>
                <li>Transaction history and carbon credit details</li>
              </ul>

              <h3 className="mt-6 text-xl font-semibold text-foreground">Usage Data</h3>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>IP addresses, browser type, device information</li>
                <li>Pages visited and features used</li>
                <li>API calls and IoT device connections</li>
                <li>Login times and session data</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
              <p className="text-muted-foreground">We use collected information to:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Provide and maintain platform services</li>
                <li>Process carbon credit transactions</li>
                <li>Verify user identity and prevent fraud</li>
                <li>Communicate updates, notifications, and support</li>
                <li>Generate reports and analytics</li>
                <li>Improve platform functionality and user experience</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">3. Information Sharing</h2>
              <p className="text-muted-foreground">We share information with:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>
                  <strong>Registry Partners:</strong> UCR, Verra, Gold Standard for project verification
                </li>
                <li>
                  <strong>Payment Processors:</strong> Razorpay and Stripe for secure transactions
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to protect our rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In case of merger, acquisition, or sale
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                We do not sell or rent your personal information to third parties for marketing purposes.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">4. Data Security</h2>
              <p className="text-muted-foreground">We implement security measures including:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>HTTPS/SSL encryption for all data transmission</li>
                <li>Encrypted storage of sensitive information</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure backup and disaster recovery procedures</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">5. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your information for as long as your account is active or as needed to provide services.
                Transaction records and certificates are retained permanently for registry compliance and verification
                purposes.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">6. Your Rights</h2>
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request data deletion (subject to legal obligations)</li>
                <li>Export your data in portable format</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to certain data processing activities</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">7. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                We use cookies and similar technologies to enhance user experience, analyze usage patterns, and maintain
                session security. You can control cookie preferences through your browser settings.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">8. International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your data may be transferred and processed in countries outside your residence. We ensure adequate
                safeguards are in place for international transfers in compliance with applicable data protection laws.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">9. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Offst.AI is not intended for users under 18 years of age. We do not knowingly collect information from
                children.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">10. Changes to Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update this privacy policy periodically. We will notify you of significant changes via email or
                platform notification.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy concerns or data requests, contact us at:{" "}
                <a href="mailto:privacy@offst.ai" className="text-primary hover:underline">
                  privacy@offst.ai
                </a>
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
