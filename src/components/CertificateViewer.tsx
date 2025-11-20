import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Shield, CheckCircle2, QrCode } from "lucide-react";
import { format } from "date-fns";

interface CertificateViewerProps {
  certificate: {
    id: string;
    serial_number: string;
    credits_retired: number;
    retirement_reason: string | null;
    created_at: string;
    certificate_url: string | null;
    qr_code_url: string | null;
    project_id: string;
  };
  projectDetails?: {
    title: string;
    project_type: string;
    registry: string;
    location_country: string;
    registry_id?: string;
  };
}

export function CertificateViewer({ certificate, projectDetails }: CertificateViewerProps) {
  const handleDownload = () => {
    if (certificate.certificate_url) {
      window.open(certificate.certificate_url, '_blank');
    }
  };

  const handleVerifyUCR = () => {
    // Link to UCR verification page with serial number
    const ucrUrl = `https://ucr.universalcarbonregistry.org/verify/${certificate.serial_number}`;
    window.open(ucrUrl, '_blank');
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Carbon Credit Retirement Certificate
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Verified by Universal Carbon Registry (UCR)
            </p>
          </div>
          <Badge variant="default" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* Certificate Details */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Certificate ID</label>
              <p className="mt-1 font-mono text-sm">{certificate.id}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">UCR Serial Number</label>
              <p className="mt-1 font-mono text-sm font-semibold">{certificate.serial_number}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Credits Retired</label>
              <p className="mt-1 text-2xl font-bold text-primary">
                {certificate.credits_retired.toLocaleString()} tCO₂e
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Retirement Date</label>
              <p className="mt-1">
                {format(new Date(certificate.created_at), 'PPP')}
              </p>
            </div>
          </div>

          {/* Project Information */}
          {projectDetails && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Project Name</label>
                <p className="mt-1 font-medium">{projectDetails.title}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Project Type</label>
                <p className="mt-1">{projectDetails.project_type.replace(/_/g, ' ')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Registry</label>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="outline">{projectDetails.registry}</Badge>
                  {projectDetails.registry_id && (
                    <span className="text-xs text-muted-foreground">
                      ID: {projectDetails.registry_id}
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <p className="mt-1">{projectDetails.location_country}</p>
              </div>
            </div>
          )}
        </div>

        {/* Retirement Reason */}
        {certificate.retirement_reason && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Retirement Reason</label>
            <p className="mt-1 rounded-md bg-muted/50 p-3 text-sm">
              {certificate.retirement_reason}
            </p>
          </div>
        )}

        {/* QR Code for Verification */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-md bg-background">
              <QrCode className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1 font-semibold">Verification QR Code</h4>
              <p className="mb-3 text-sm text-muted-foreground">
                Scan this QR code to verify the authenticity of this certificate on the UCR registry
              </p>
              <Button variant="outline" size="sm" onClick={handleVerifyUCR} className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Verify on UCR
              </Button>
            </div>
          </div>
        </div>

        {/* Registry Information */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <h4 className="mb-2 flex items-center gap-2 font-semibold">
            <Shield className="h-4 w-4 text-primary" />
            UCR Registry Verification
          </h4>
          <p className="mb-3 text-sm text-muted-foreground">
            This certificate is registered and verified on the Universal Carbon Registry (UCR).
            All retirement transactions are permanently recorded on the blockchain for transparency and immutability.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Blockchain Verified
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Permanently Retired
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              No Double Counting
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download Certificate
          </Button>
          <Button variant="outline" onClick={handleVerifyUCR} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            View on UCR Registry
          </Button>
        </div>

        {/* Legal Footer */}
        <div className="border-t pt-4 text-xs text-muted-foreground">
          <p>
            This certificate confirms the permanent retirement of the specified carbon credits.
            These credits can no longer be traded or transferred. Certificate authenticity can be
            verified at any time through the UCR registry using the serial number provided above.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
