import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText, CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const statusOrder = [
  'application',
  'registered',
  'pre_validation',
  'validated',
  'audited',
  'active',
  'held',
  'sold_held',
  'retired',
  'rejected'
];

const statusLabels: Record<string, string> = {
  application: 'Application',
  registered: 'Registered',
  pre_validation: 'Pre-Validation',
  validated: 'Validated',
  audited: 'Audited',
  active: 'Active',
  held: 'Held',
  sold_held: 'Sold & Held',
  retired: 'Retired',
  rejected: 'Rejected'
};

export default function CertificationWorkflow() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'update'>('approve');
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    notes: "",
    rejection_reason: "",
    vvb_name: "",
    vvb_accreditation_number: "",
    validation_date: "",
    verification_date: "",
  });

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("projects")
        .select("*, profiles(full_name, company_name)")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (project: any, action: 'approve' | 'reject' | 'update') => {
    setSelectedProject(project);
    setActionType(action);
    setFormData({
      notes: "",
      rejection_reason: "",
      vvb_name: project.vvb_name || "",
      vvb_accreditation_number: project.vvb_accreditation_number || "",
      validation_date: project.validation_date || "",
      verification_date: project.verification_date || "",
    });
    setShowDialog(true);
  };

  const getNextStatus = (currentStatus: string): string => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
      return statusOrder[currentIndex + 1];
    }
    return currentStatus;
  };

  const handleAction = async () => {
    if (!selectedProject) return;

    try {
      let updates: any = {};

      if (actionType === 'reject') {
        if (!formData.rejection_reason) {
          toast.error("Please provide a rejection reason");
          return;
        }
        updates = {
          status: 'rejected',
          current_stage: 'rejected',
          rejection_reason: formData.rejection_reason,
        };
      } else if (actionType === 'approve') {
        const nextStatus = getNextStatus(selectedProject.status);
        updates = {
          status: nextStatus,
          current_stage: nextStatus,
        };

        if (nextStatus === 'validated') {
          updates.validated = true;
          updates.validation_date = new Date().toISOString();
        }
      } else if (actionType === 'update') {
        updates = {
          vvb_name: formData.vvb_name,
          vvb_accreditation_number: formData.vvb_accreditation_number,
          validation_date: formData.validation_date,
          verification_date: formData.verification_date,
        };
      }

      const { error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", selectedProject.id);

      if (error) throw error;

      toast.success(`Project ${actionType === 'reject' ? 'rejected' : actionType === 'approve' ? 'advanced' : 'updated'} successfully`);
      setShowDialog(false);
      fetchProjects();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      application: "outline",
      registered: "secondary",
      pre_validation: "secondary",
      validated: "default",
      audited: "default",
      active: "default",
      held: "outline",
      sold_held: "outline",
      retired: "outline",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{statusLabels[status] || status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Certification Workflow</h2>
          <p className="text-muted-foreground">Manage project certification stages and approvals</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="application">Application</SelectItem>
            <SelectItem value="registered">Registered</SelectItem>
            <SelectItem value="pre_validation">Pre-Validation</SelectItem>
            <SelectItem value="validated">Validated</SelectItem>
            <SelectItem value="audited">Audited</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects in Certification Process</CardTitle>
          <CardDescription>Total projects: {projects.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{project.title}</div>
                      <div className="text-sm text-muted-foreground">{project.company_name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{project.profiles?.full_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{statusLabels[project.current_stage] || project.current_stage}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {project.no_harm_declaration_signed && (
                        <div className="flex items-center gap-1 text-xs text-success">
                          <CheckCircle className="h-3 w-3" />
                          No-Harm
                        </div>
                      )}
                      {project.carbon_asset_mandate_signed && (
                        <div className="flex items-center gap-1 text-xs text-success">
                          <CheckCircle className="h-3 w-3" />
                          Mandate
                        </div>
                      )}
                      {project.ownership_proof_url && (
                        <div className="flex items-center gap-1 text-xs text-success">
                          <CheckCircle className="h-3 w-3" />
                          Ownership
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {project.status !== 'rejected' && project.status !== 'retired' && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => openDialog(project, 'approve')}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Advance
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDialog(project, 'update')}
                          >
                            <FileText className="mr-1 h-4 w-4" />
                            Update
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openDialog(project, 'reject')}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`/project/${project.id}`, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'Advance Project'}
              {actionType === 'reject' && 'Reject Project'}
              {actionType === 'update' && 'Update Project Information'}
            </DialogTitle>
            <DialogDescription>
              {selectedProject?.title}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="action" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="action">Action</TabsTrigger>
              <TabsTrigger value="details">Project Details</TabsTrigger>
            </TabsList>

            <TabsContent value="action" className="space-y-4">
              {actionType === 'approve' && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm">
                      Current Stage: <strong>{statusLabels[selectedProject?.status]}</strong>
                    </p>
                    <p className="text-sm">
                      Next Stage: <strong>{statusLabels[getNextStatus(selectedProject?.status)]}</strong>
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="notes">Admin Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Add any notes about this advancement..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {actionType === 'reject' && (
                <div>
                  <Label htmlFor="rejection_reason">Rejection Reason *</Label>
                  <Textarea
                    id="rejection_reason"
                    value={formData.rejection_reason}
                    onChange={(e) => setFormData({...formData, rejection_reason: e.target.value})}
                    placeholder="Provide detailed reason for rejection..."
                    rows={4}
                    required
                  />
                </div>
              )}

              {actionType === 'update' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="vvb_name">VVB Name</Label>
                    <Input
                      id="vvb_name"
                      value={formData.vvb_name}
                      onChange={(e) => setFormData({...formData, vvb_name: e.target.value})}
                      placeholder="ISO 14065-accredited VVB"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vvb_accreditation">VVB Accreditation Number</Label>
                    <Input
                      id="vvb_accreditation"
                      value={formData.vvb_accreditation_number}
                      onChange={(e) => setFormData({...formData, vvb_accreditation_number: e.target.value})}
                      placeholder="Accreditation number"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="validation_date">Validation Date</Label>
                      <Input
                        id="validation_date"
                        type="date"
                        value={formData.validation_date}
                        onChange={(e) => setFormData({...formData, validation_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="verification_date">Verification Date</Label>
                      <Input
                        id="verification_date"
                        type="date"
                        value={formData.verification_date}
                        onChange={(e) => setFormData({...formData, verification_date: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid gap-4 text-sm">
                <div>
                  <span className="font-medium">Company:</span> {selectedProject?.company_name}
                </div>
                <div>
                  <span className="font-medium">Contact:</span> {selectedProject?.contact_email}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {selectedProject?.project_type}
                </div>
                <div>
                  <span className="font-medium">Registry:</span> {selectedProject?.registry}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {selectedProject?.location_country}
                </div>
                <div>
                  <span className="font-medium">Installed Capacity:</span> {selectedProject?.installed_capacity}
                </div>
                <div>
                  <span className="font-medium">Total Credits:</span> {selectedProject?.total_credits} tons
                </div>
                {selectedProject?.ownership_proof_url && (
                  <div>
                    <a href={selectedProject.ownership_proof_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      View Ownership Proof
                    </a>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAction}>
              {actionType === 'approve' && 'Advance Stage'}
              {actionType === 'reject' && 'Reject Project'}
              {actionType === 'update' && 'Update Information'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
