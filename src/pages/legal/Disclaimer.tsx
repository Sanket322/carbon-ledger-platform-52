import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-4xl font-bold text-foreground">Disclaimer</h1>

          <Card className="p-8">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <p className="text-muted-foreground">Last Updated: November 2025</p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">1. Platform Role and Limitations</h2>
              <p className="text-muted-foreground">
                Offst.AI is a marketplace platform that facilitates transactions between carbon credit project
                developers and buyers. We do not:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Generate or own carbon credits ourselves</li>
                <li>Guarantee the environmental impact of listed projects</li>
                <li>Act as a registry or certification body</li>
                <li>Provide investment, financial, or legal advice</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">2. Project Information Accuracy</h2>
              <p className="text-muted-foreground">
                While we verify projects through registry partnerships (UCR, Verra, Gold Standard), we rely on:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Information provided by project owners</li>
                <li>Documentation submitted for verification</li>
                <li>Third-party registry certification processes</li>
                <li>Periodic monitoring and reporting by project developers</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                We cannot guarantee the accuracy, completeness, or timeliness of all project information. Users should
                conduct their own due diligence before purchasing credits.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">3. Registry Verification</h2>
              <p className="text-muted-foreground">
                Projects are verified by independent registries. Offst.AI does not control or influence registry
                decisions regarding:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Project certification or de-certification</li>
                <li>Credit issuance or serial number assignment</li>
                <li>Verification standards or methodologies</li>
                <li>Registry rules, policies, or procedures</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">4. Market Risk Disclosure</h2>
              <p className="text-muted-foreground">Carbon credit trading involves risks including:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>
                  <strong>Price Volatility:</strong> Credit prices fluctuate based on market demand
                </li>
                <li>
                  <strong>Regulatory Changes:</strong> Carbon markets are subject to evolving regulations
                </li>
                <li>
                  <strong>Project Performance:</strong> Actual emission reductions may vary from estimates
                </li>
                <li>
                  <strong>Liquidity Risk:</strong> Credits may not always be easy to sell or trade
                </li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">5. Not Financial Advice</h2>
              <p className="text-muted-foreground">
                Information on our platform is for informational purposes only and should not be considered:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Investment advice or recommendations</li>
                <li>Financial, tax, or legal counsel</li>
                <li>Guarantees of future performance or returns</li>
                <li>Endorsements of specific projects or credits</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                Consult qualified professionals before making financial decisions.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">6. Technical Limitations</h2>
              <p className="text-muted-foreground">
                We strive for platform reliability but cannot guarantee:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Uninterrupted access or error-free operation</li>
                <li>Real-time data synchronization from all sources</li>
                <li>Prevention of all security threats or breaches</li>
                <li>Compatibility with all devices and browsers</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">7. Third-Party Services</h2>
              <p className="text-muted-foreground">Our platform integrates with third-party services including:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Payment processors (Razorpay, Stripe)</li>
                <li>Registry APIs and databases</li>
                <li>IoT device integrations</li>
                <li>Cloud infrastructure providers</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                We are not responsible for third-party service outages, errors, or policy changes.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">8. Energy Data and IoT Integration</h2>
              <p className="text-muted-foreground">
                Energy readings and carbon credit calculations based on automated data imports are:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Dependent on accuracy of IoT devices and APIs</li>
                <li>Subject to verification by registries</li>
                <li>Provided as-is without guarantees</li>
                <li>May contain errors or transmission delays</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">9. Compliance and Legal Requirements</h2>
              <p className="text-muted-foreground">Users are responsible for:</p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Complying with local laws and regulations</li>
                <li>Understanding tax implications of transactions</li>
                <li>Obtaining necessary licenses or permits</li>
                <li>Meeting corporate sustainability reporting requirements</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">10. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, Offst.AI shall not be liable for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages arising from reliance on platform information</li>
                <li>Third-party actions or registry decisions</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">11. No Warranty</h2>
              <p className="text-muted-foreground">
                The platform is provided "as is" without warranties of any kind, either express or implied, including
                but not limited to warranties of merchantability, fitness for a particular purpose, or
                non-infringement.
              </p>

              <h2 className="mt-8 text-2xl font-bold text-foreground">12. Indemnification</h2>
              <p className="text-muted-foreground">
                Users agree to indemnify and hold Offst.AI harmless from claims arising from:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Violation of terms and conditions</li>
                <li>Misrepresentation of project information</li>
                <li>Unauthorized use of the platform</li>
                <li>Infringement of third-party rights</li>
              </ul>

              <h2 className="mt-8 text-2xl font-bold text-foreground">Questions About This Disclaimer</h2>
              <p className="text-muted-foreground">
                Contact:{" "}
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

export default Disclaimer;
