import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function Settings() {
  const [settings, setSettings] = useState({
    platformName: "Offst.AI",
    kycRequired: true,
    autoVerifyProjects: false,
    commissionRate: 2.5,
    minProjectCredits: 1000,
    emailNotifications: true,
    maintenanceMode: false,
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to database
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Platform Settings</h2>
        <p className="text-muted-foreground">Configure platform-wide settings</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="platform-name">Platform Name</Label>
            <Input
              id="platform-name"
              value={settings.platformName}
              onChange={(e) => setSettings({...settings, platformName: e.target.value})}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily disable public access to the platform
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* KYC Settings */}
      <Card>
        <CardHeader>
          <CardTitle>KYC & Verification</CardTitle>
          <CardDescription>User verification requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require KYC for Trading</Label>
              <p className="text-sm text-muted-foreground">
                Users must complete KYC verification before trading
              </p>
            </div>
            <Switch
              checked={settings.kycRequired}
              onCheckedChange={(checked) => setSettings({...settings, kycRequired: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Verify Projects</Label>
              <p className="text-sm text-muted-foreground">
                Automatically verify projects from trusted registries
              </p>
            </div>
            <Switch
              checked={settings.autoVerifyProjects}
              onCheckedChange={(checked) => setSettings({...settings, autoVerifyProjects: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Configuration</CardTitle>
          <CardDescription>Transaction and pricing settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="commission">Platform Commission Rate (%)</Label>
            <Input
              id="commission"
              type="number"
              step="0.1"
              value={settings.commissionRate}
              onChange={(e) => setSettings({...settings, commissionRate: parseFloat(e.target.value)})}
            />
            <p className="text-sm text-muted-foreground">
              Fee charged on each transaction
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-credits">Minimum Project Credits</Label>
            <Input
              id="min-credits"
              type="number"
              value={settings.minProjectCredits}
              onChange={(e) => setSettings({...settings, minProjectCredits: parseInt(e.target.value)})}
            />
            <p className="text-sm text-muted-foreground">
              Minimum credits required to list a project
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Email and alert preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send email alerts for important events
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} size="lg">
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
