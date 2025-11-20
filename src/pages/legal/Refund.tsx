import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Refund = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-4xl font-bold text-foreground">Refund Policy</h1>

          <Card className="p-8">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <p className="text-muted-foreground">Last Updated: November 2025</p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">1. General Refund Policy</h2>
              <p className="text-muted-foreground">
                Due to the nature of carbon credit transactions and digital certificate issuance, refunds are generally
                not available once credits have been transferred to your account and serial numbers have been issued by
                the registry.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">2. Eligible Refund Situations</h2>
              <p className="text-muted-foreground">Refunds may be issued in the following cases:</p>

              <h3 className="mt-6 text-xl font-semibold text-foreground">Technical Errors</h3>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Duplicate charges due to payment processing errors</li>
                <li>System errors resulting in incorrect credit amounts</li>
                <li>Failed registry transfers where credits were not issued</li>
              </ul>

              <h3 className="mt-6 text-xl font-semibold text-foreground">Project Verification Issues</h3>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Project de-certification by registry after purchase</li>
                <li>Discovery of fraudulent project documentation</li>
                <li>Registry rejection of credit transfer</li>
              </ul>

              <h3 className="mt-6 text-xl font-semibold text-foreground">Pre-Transfer Cancellations</h3>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Request made within 24 hours of payment (before registry transfer)</li>
                <li>Credits still in escrow and not yet assigned serial numbers</li>
                <li>Transaction not yet confirmed by the registry</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">3. Non-Refundable Situations</h2>
              <p className="text-muted-foreground">Refunds are not available for:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Change of mind after credit transfer completion</li>
                <li>Market price fluctuations after purchase</li>
                <li>Credits that have been retired or used</li>
                <li>Platform fees and transaction charges</li>
                <li>Credits transferred to external registries</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">4. Refund Request Process</h2>
              <p className="text-muted-foreground">To request a refund:</p>
              <ol className="list-decimal pl-6 text-muted-foreground">
                <li>Contact support at refunds@offst.ai within 7 days of transaction</li>
                <li>Provide transaction ID, order details, and reason for refund request</li>
                <li>Include supporting documentation or evidence if applicable</li>
                <li>Wait for our team to review (typically 5-7 business days)</li>
                <li>Receive decision and refund (if approved) within 10-14 business days</li>
              </ol>

              <h2 className="mt-8 text-2xl font-bold text-foreground">5. Refund Methods</h2>
              <p className="text-muted-foreground">
                Approved refunds will be processed to the original payment method:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Credit card refunds: 5-10 business days</li>
                <li>Bank transfers: 7-14 business days</li>
                <li>Digital wallets: 3-5 business days</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">6. Partial Refunds</h2>
              <p className="text-muted-foreground">
                In cases where only a portion of credits can be refunded (e.g., partial transfer errors), we will issue
                partial refunds proportional to the affected credits.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">7. Escrow Protection</h2>
              <p className="text-muted-foreground">
                Payments are held in escrow until:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Registry confirms credit transfer</li>
                <li>Serial numbers are issued and verified</li>
                <li>Credits appear in your wallet</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                If any of these steps fail, automatic refund processing will be initiated.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">8. Chargeback Policy</h2>
              <p className="text-muted-foreground">
                Please contact our support team before initiating a chargeback with your bank. Chargebacks may result in
                account suspension and legal action if credits have already been transferred.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">9. Project Owner Payouts</h2>
              <p className="text-muted-foreground">
                For project owners, payouts are processed after:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Credit sale is completed</li>
                <li>Buyer confirms receipt and registry transfer</li>
                <li>Platform commission is deducted</li>
                <li>No disputes or verification issues arise</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">10. Dispute Resolution</h2>
              <p className="text-muted-foreground">
                If your refund request is denied and you believe there's been an error, you may escalate to our dispute
                resolution team at disputes@offst.ai. Decisions will be made within 14 business days.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">Contact for Refunds</h2>
              <p className="text-muted-foreground">
                Email:{" "}
                <a href="mailto:refunds@offst.ai" className="text-primary hover:underline">
                  refunds@offst.ai
                </a>
                <br />
                Include: Transaction ID, Date, Amount, Reason
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Refund;
