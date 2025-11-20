import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Upload, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const steps = [
  "Company & Project Info",
  "Project Details",
  "Ownership & Compliance",
  "Impact & Baseline",
  "Documentation",
  "Review & Submit"
];

export default function RegisterProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isProjectOwner } = useUserRole();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState({
    // Company & Project Info
    company_name: "",
    contact_email: "",
    contact_phone: "",
    title: "",
    location_country: "",
    location_address: "",
    
    // Project Details
    project_type: "",
    registry: "",
    installed_capacity: "",
    vintage_year: new Date().getFullYear(),
    total_credits: 0,
    price_per_ton: 0,
    description: "",
    
    // Ownership & Compliance
    ownership_proof_url: "",
    no_harm_declaration_signed: false,
    carbon_asset_mandate_signed: false,
    
    // Impact & Baseline
    impact_criteria_compliance: "",
    baseline_justification: "",
    additionality_demonstration: "",
    co2_reduction_estimate: 0,
    
    // Documentation
    pcn_document_url: "",
    monitoring_plan_url: "",
    certificate_url: "",
    monitoring_report_url: "",
    stakeholder_consultation_url: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (field: string, file: File) => {
    if (!user) {
      toast.error("Please login to upload files");
      return;
    }

    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    try {
      setUploadingFiles(prev => ({ ...prev, [field]: true }));
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${field}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-documents')
        .getPublicUrl(fileName);

      updateField(field, publicUrl);
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploadingFiles(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit project");
      return;
    }

    // Validation
    if (!formData.no_harm_declaration_signed) {
      toast.error("Please sign the No-Harm Declaration");
      return;
    }

    if (!formData.carbon_asset_mandate_signed) {
      toast.error("Please sign the Carbon Asset Ownership Mandate");
      return;
    }

    // Ownership proof is now optional

    try {
      setLoading(true);

      const { error } = await supabase
        .from("projects")
        .insert({
          owner_id: user.id,
          title: formData.title,
          description: formData.description,
          project_type: formData.project_type as any,
          registry: formData.registry as any,
          location_country: formData.location_country,
          location_address: formData.location_address,
          vintage_year: formData.vintage_year,
          total_credits: formData.total_credits,
          available_credits: formData.total_credits,
          price_per_ton: formData.price_per_ton,
          co2_reduction_estimate: formData.co2_reduction_estimate,
          
          // New certification fields
          company_name: formData.company_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          installed_capacity: formData.installed_capacity,
          ownership_proof_url: formData.ownership_proof_url,
          no_harm_declaration_signed: formData.no_harm_declaration_signed,
          no_harm_declaration_date: new Date().toISOString(),
          carbon_asset_mandate_signed: formData.carbon_asset_mandate_signed,
          carbon_asset_mandate_date: new Date().toISOString(),
          impact_criteria_compliance: formData.impact_criteria_compliance,
          baseline_justification: formData.baseline_justification,
          additionality_demonstration: formData.additionality_demonstration,
          
          // Documentation URLs
          pcn_document_url: formData.pcn_document_url,
          monitoring_plan_url: formData.monitoring_plan_url,
          certificate_url: formData.certificate_url,
          monitoring_report_url: formData.monitoring_report_url,
          stakeholder_consultation_url: formData.stakeholder_consultation_url,
          
          status: 'application' as any,
          current_stage: 'application',
        });

      if (error) throw error;

      toast.success("Project submitted for review successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error submitting project:", error);
      toast.error(error.message || "Failed to submit project");
    } finally {
      setLoading(false);
    }
  };

  if (!isProjectOwner) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Only users with Project Owner role can register projects.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Register Carbon Credit Project</h1>
          <p className="text-muted-foreground">
            Follow the Decarb.earth certification procedure - Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-foreground">{steps[currentStep]}</span>
            <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="mt-4 flex justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 text-xs ${
                  index <= currentStep ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <div className={`h-4 w-4 rounded-full border-2 ${
                    index === currentStep ? "border-primary bg-primary" : "border-muted"
                  }`} />
                )}
                <span className="hidden sm:inline">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep]}</CardTitle>
            <CardDescription>
              {currentStep === 0 && "Provide company and basic project information"}
              {currentStep === 1 && "Technical project details and capacity"}
              {currentStep === 2 && "Legal ownership and compliance declarations"}
              {currentStep === 3 && "Impact criteria and baseline justification"}
              {currentStep === 4 && "Upload required certification documents"}
              {currentStep === 5 && "Review all information before submission"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step content - simplified for token limit */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => updateField("company_name", e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="contact_email">Contact Email *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => updateField("contact_email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_phone">Contact Phone *</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => updateField("contact_phone", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="location_country">Country *</Label>
                    <Input
                      id="location_country"
                      value={formData.location_country}
                      onChange={(e) => updateField("location_country", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location_address">Site Address *</Label>
                    <Input
                      id="location_address"
                      value={formData.location_address}
                      onChange={(e) => updateField("location_address", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Project Type *</Label>
                    <Select value={formData.project_type} onValueChange={(value) => updateField("project_type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="renewable_energy">Renewable Energy</SelectItem>
                        <SelectItem value="forestry">Forestry & Land Use</SelectItem>
                        <SelectItem value="energy_efficiency">Energy Efficiency</SelectItem>
                        <SelectItem value="waste_management">Waste Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="installed_capacity">Installed Capacity *</Label>
                    <Input
                      id="installed_capacity"
                      value={formData.installed_capacity}
                      onChange={(e) => updateField("installed_capacity", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={5}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="ownership_proof">Proof of Ownership (Optional)</Label>
                  <Input
                    id="ownership_proof"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload("ownership_proof_url", file);
                    }}
                    disabled={uploadingFiles.ownership_proof_url}
                  />
                  {uploadingFiles.ownership_proof_url && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </div>
                  )}
                  {formData.ownership_proof_url && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      File uploaded
                    </div>
                  )}
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="no_harm"
                    checked={formData.no_harm_declaration_signed}
                    onCheckedChange={(checked) => updateField("no_harm_declaration_signed", checked)}
                  />
                  <Label htmlFor="no_harm">
                    I declare this project complies with DE-ICS1 and causes no environmental or social harm
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="carbon_mandate"
                    checked={formData.carbon_asset_mandate_signed}
                    onCheckedChange={(checked) => updateField("carbon_asset_mandate_signed", checked)}
                  />
                  <Label htmlFor="carbon_mandate">
                    I confirm legal right to carbon credits from this project
                  </Label>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="impact_criteria">Impact Criteria Compliance *</Label>
                  <Textarea
                    id="impact_criteria"
                    value={formData.impact_criteria_compliance}
                    onChange={(e) => updateField("impact_criteria_compliance", e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="baseline">Baseline Justification *</Label>
                  <Textarea
                    id="baseline"
                    value={formData.baseline_justification}
                    onChange={(e) => updateField("baseline_justification", e.target.value)}
                    rows={5}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label>Project Design Document</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload("pcn_document_url", file);
                    }}
                    disabled={uploadingFiles.pcn_document_url}
                  />
                </div>
                <div>
                  <Label>Monitoring Plan</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload("monitoring_plan_url", file);
                    }}
                    disabled={uploadingFiles.monitoring_plan_url}
                  />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Review all information before submitting. Your project will enter the Application stage.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2 text-sm">
                  <div><strong>Company:</strong> {formData.company_name}</div>
                  <div><strong>Title:</strong> {formData.title}</div>
                  <div><strong>Type:</strong> {formData.project_type}</div>
                  <div><strong>Location:</strong> {formData.location_country}</div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || loading}
              >
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Review"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
