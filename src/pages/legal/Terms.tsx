import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-4xl font-bold text-foreground">Terms & Conditions</h1>

          <Card className="p-8">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <p className="text-muted-foreground">Last Updated: November 2025</p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Offst.AI platform, you accept and agree to be bound by these Terms and
                Conditions. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">2. Platform Services</h2>
              <p className="text-muted-foreground">
                Offst.AI provides a marketplace platform for carbon credit transactions, connecting project developers
                with buyers. We facilitate:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Project registration and verification services</li>
                <li>Carbon credit marketplace and trading engine</li>
                <li>Energy information tracking and monitoring</li>
                <li>Retirement certificate generation and verification</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">3. User Accounts</h2>
              <p className="text-muted-foreground">
                You are responsible for maintaining the confidentiality of your account credentials. You agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Provide accurate and complete registration information</li>
                <li>Update your information to keep it current</li>
                <li>Notify us immediately of any unauthorized account access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">4. Project Registration</h2>
              <p className="text-muted-foreground">
                Project owners registering on Offst.AI must:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Provide truthful and accurate project information</li>
                <li>Submit all required documentation for verification</li>
                <li>Maintain valid registry certifications (UCR, Verra, Gold Standard)</li>
                <li>Update project data and monitoring reports as required</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">5. Carbon Credit Transactions</h2>
              <p className="text-muted-foreground">All carbon credit transactions are subject to:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Successful KYC verification for buyers</li>
                <li>Availability of credits at time of purchase</li>
                <li>Registry confirmation and serial number issuance</li>
                <li>Platform fees and commissions as disclosed</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">6. Payment Terms</h2>
              <p className="text-muted-foreground">
                Payments are processed through Razorpay (INR) and Stripe (USD/EUR). By making a purchase, you agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Provide valid payment information</li>
                <li>Pay all applicable fees and charges</li>
                <li>Accept our refund policy terms</li>
                <li>Escrow arrangements until credit transfer confirmation</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">7. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content, trademarks, and intellectual property on Offst.AI platform remain our property. You may
                not:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Use our trademarks or branding without authorization</li>
                <li>Reverse engineer or attempt to extract source code</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Offst.AI is not liable for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Project performance or emission reduction claims</li>
                <li>Registry decisions on project verification</li>
                <li>Market price fluctuations of carbon credits</li>
                <li>Force majeure events or service interruptions</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">9. Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent
                activity, or pose security risks to the platform.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">10. Governing Law</h2>
              <p className="text-muted-foreground">
                These terms are governed by applicable international carbon market regulations and the laws of [Your
                Jurisdiction]. Disputes will be resolved through binding arbitration.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">11. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these terms periodically. Continued use of the platform after changes constitutes
                acceptance of the updated terms. Major changes will be communicated via email.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these terms, contact us at:{" "}
                <a href="mailto:legal@offst.ai" className="text-primary hover:underline">
                  legal@offst.ai
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

export default Terms;
