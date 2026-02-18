import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ProjectTypesSection from "@/components/landing/ProjectTypesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CalculatorSection from "@/components/landing/CalculatorSection";
import AboutSection from "@/components/landing/AboutSection";
import CTASection from "@/components/landing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ProjectTypesSection />
      <HowItWorksSection />
      <CalculatorSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
