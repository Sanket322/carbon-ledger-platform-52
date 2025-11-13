import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const steps = [
  "Project Basics",
  "Location & Type",
  "Credits & Pricing",
  "Documentation",
  "Review & Submit",
];

const RegisterProject = () => {
  const { user } = useAuth();
  const { isProjectOwner } = useUserRole();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project_type: "",
    registry: "",
    registry_id: "",
    location_country: "",
    location_address: "",
    latitude: "",
    longitude: "",
    total_credits: "",
    available_credits: "",
    price_per_ton: "",
    vintage_year: new Date().getFullYear().toString(),
    co2_reduction_estimate: "",
    pcn_document_url: "",
    monitoring_report_url: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    if (!user || !isProjectOwner) {
      toast.error("You must be a project owner to register projects");
      return;
    }

    try {
      const { error } = await supabase.from("projects").insert([{
        owner_id: user.id,
        title: formData.title,
        description: formData.description,
        project_type: formData.project_type as any,
        registry: formData.registry as any,
        registry_id: formData.registry_id || null,
        location_country: formData.location_country,
        location_address: formData.location_address || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        total_credits: parseFloat(formData.total_credits),
        available_credits: parseFloat(formData.available_credits),
        price_per_ton: parseFloat(formData.price_per_ton),
        vintage_year: parseInt(formData.vintage_year),
        co2_reduction_estimate: formData.co2_reduction_estimate
          ? parseFloat(formData.co2_reduction_estimate)
          : null,
        pcn_document_url: formData.pcn_document_url || null,
        monitoring_report_url: formData.monitoring_report_url || null,
        status: "pending_verification",
      }]);

      if (error) throw error;

      toast.success("Project submitted for verification!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit project");
    }
  };

  if (!isProjectOwner) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You need to be a project owner to register projects.
          </p>
          <Button onClick={() => navigate("/dashboard")} className="mt-6">
            Go to Dashboard
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Register New Project
          </h1>
          <p className="text-muted-foreground">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="mt-4" />
        </div>

        <Card className="p-6">
          {/* Step 0: Project Basics */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Solar Farm in Maharashtra"
                />
              </div>
              <div>
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Describe your carbon offset project..."
                  rows={5}
                />
              </div>
            </div>
          )}

          {/* Step 1: Location & Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="project_type">Project Type *</Label>
                <Select value={formData.project_type} onValueChange={(v) => updateField("project_type", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Renewable_Energy">Renewable Energy</SelectItem>
                    <SelectItem value="Forest_Conservation">Forest Conservation</SelectItem>
                    <SelectItem value="Reforestation">Reforestation</SelectItem>
                    <SelectItem value="Clean_Cookstoves">Clean Cookstoves</SelectItem>
                    <SelectItem value="Waste_Management">Waste Management</SelectItem>
                    <SelectItem value="Energy_Efficiency">Energy Efficiency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location_country">Country *</Label>
                <Input
                  id="location_country"
                  value={formData.location_country}
                  onChange={(e) => updateField("location_country", e.target.value)}
                  placeholder="India"
                />
              </div>
              <div>
                <Label htmlFor="location_address">Address</Label>
                <Input
                  id="location_address"
                  value={formData.location_address}
                  onChange={(e) => updateField("location_address", e.target.value)}
                  placeholder="Full address"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => updateField("latitude", e.target.value)}
                    placeholder="19.0760"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => updateField("longitude", e.target.value)}
                    placeholder="72.8777"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Credits & Pricing */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="registry">Registry *</Label>
                <Select value={formData.registry} onValueChange={(v) => updateField("registry", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select registry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UCR">UCR (Universal Carbon Registry)</SelectItem>
                    <SelectItem value="Verra">Verra (VCS)</SelectItem>
                    <SelectItem value="Gold_Standard">Gold Standard</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="registry_id">Registry ID</Label>
                <Input
                  id="registry_id"
                  value={formData.registry_id}
                  onChange={(e) => updateField("registry_id", e.target.value)}
                  placeholder="UCR-12345"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="total_credits">Total Credits *</Label>
                  <Input
                    id="total_credits"
                    type="number"
                    step="0.01"
                    value={formData.total_credits}
                    onChange={(e) => updateField("total_credits", e.target.value)}
                    placeholder="10000"
                  />
                </div>
                <div>
                  <Label htmlFor="available_credits">Available Credits *</Label>
                  <Input
                    id="available_credits"
                    type="number"
                    step="0.01"
                    value={formData.available_credits}
                    onChange={(e) => updateField("available_credits", e.target.value)}
                    placeholder="10000"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="price_per_ton">Price per Ton (USD) *</Label>
                  <Input
                    id="price_per_ton"
                    type="number"
                    step="0.01"
                    value={formData.price_per_ton}
                    onChange={(e) => updateField("price_per_ton", e.target.value)}
                    placeholder="15.00"
                  />
                </div>
                <div>
                  <Label htmlFor="vintage_year">Vintage Year *</Label>
                  <Input
                    id="vintage_year"
                    type="number"
                    value={formData.vintage_year}
                    onChange={(e) => updateField("vintage_year", e.target.value)}
                    placeholder={new Date().getFullYear().toString()}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="co2_reduction_estimate">CO₂ Reduction Estimate (tons)</Label>
                <Input
                  id="co2_reduction_estimate"
                  type="number"
                  step="0.01"
                  value={formData.co2_reduction_estimate}
                  onChange={(e) => updateField("co2_reduction_estimate", e.target.value)}
                  placeholder="50000"
                />
              </div>
            </div>
          )}

          {/* Step 3: Documentation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="pcn_document_url">PCN Document URL</Label>
                <Input
                  id="pcn_document_url"
                  value={formData.pcn_document_url}
                  onChange={(e) => updateField("pcn_document_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="monitoring_report_url">Monitoring Report URL</Label>
                <Input
                  id="monitoring_report_url"
                  value={formData.monitoring_report_url}
                  onChange={(e) => updateField("monitoring_report_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  File upload functionality will be available soon. For now, please provide
                  direct URLs to your documents.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-bold text-foreground">Review Your Project</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Type:</strong> {formData.project_type}</p>
                  <p><strong>Registry:</strong> {formData.registry}</p>
                  <p><strong>Location:</strong> {formData.location_country}</p>
                  <p><strong>Total Credits:</strong> {formData.total_credits}</p>
                  <p><strong>Price per Ton:</strong> ${formData.price_per_ton}</p>
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  By submitting, you agree that all information provided is accurate and
                  that your project will undergo verification before being listed.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} variant="hero">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} variant="success">
                <Check className="mr-2 h-4 w-4" />
                Submit for Verification
              </Button>
            )}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterProject;
