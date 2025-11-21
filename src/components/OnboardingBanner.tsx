import { useState } from "react";
import { X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface OnboardingBannerProps {
  userType: "buyer" | "project_owner" | "guest";
}

export function OnboardingBanner({ userType }: OnboardingBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getContent = () => {
    switch (userType) {
      case "buyer":
        return {
          title: "Welcome to Offst.AI! 👋",
          message: "Start by browsing projects in the marketplace. Purchase credits in INR and get instant retirement certificates.",
          cta: { text: "Browse Projects", link: "/marketplace" }
        };
      case "project_owner":
        return {
          title: "Welcome, Project Owner! 🌱",
          message: "Ready to list your carbon credit project? Register your project and start verification with UCR, Verra, or Gold Standard.",
          cta: { text: "Register Project", link: "/register-project" }
        };
      default:
        return {
          title: "New to Carbon Credits? 🌍",
          message: "Learn how carbon credits work, browse verified projects, or try our demo to see the platform in action.",
          cta: { text: "Learn More", link: "/knowledge" }
        };
    }
  };

  const content = getContent();

  return (
    <Card className="relative bg-primary/5 border-primary/20 mb-6">
      <div className="p-4 flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{content.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{content.message}</p>
          <Button variant="default" size="sm" asChild>
            <Link to={content.cta.link}>{content.cta.text}</Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
