import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Plane, Home, Utensils, Calculator, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CarbonCalculator() {
  const [transportation, setTransportation] = useState({
    carMiles: 0,
    carType: "average",
    flights: 0,
    flightType: "short",
  });
  
  const [home, setHome] = useState({
    electricity: 0,
    naturalGas: 0,
    residents: 1,
  });

  const [lifestyle, setLifestyle] = useState({
    diet: "average",
    shopping: "average",
  });

  const [result, setResult] = useState<number | null>(null);

  const calculateEmissions = () => {
    let total = 0;

    // Transportation emissions (lbs CO2)
    const carEmissionFactors: Record<string, number> = {
      average: 0.96, // lbs CO2 per mile
      suv: 1.26,
      electric: 0.47,
      hybrid: 0.52,
    };
    total += transportation.carMiles * (carEmissionFactors[transportation.carType] || 0.96);

    // Flight emissions (lbs CO2 per flight)
    const flightEmissionFactors: Record<string, number> = {
      short: 1100, // < 3 hours
      medium: 2200, // 3-6 hours
      long: 4400, // > 6 hours
    };
    total += transportation.flights * (flightEmissionFactors[transportation.flightType] || 1100);

    // Home energy (lbs CO2)
    // Electricity: ~1.2 lbs CO2 per kWh
    total += (home.electricity * 1.2) / home.residents;
    // Natural gas: ~12 lbs CO2 per therm
    total += (home.naturalGas * 12) / home.residents;

    // Lifestyle emissions (annual lbs CO2)
    const dietEmissions: Record<string, number> = {
      vegan: 3000,
      vegetarian: 3700,
      average: 4400,
      meat: 7300,
    };
    total += (dietEmissions[lifestyle.diet] || 4400) / 12; // Monthly

    const shoppingEmissions: Record<string, number> = {
      minimal: 500,
      average: 1200,
      high: 2400,
    };
    total += (shoppingEmissions[lifestyle.shopping] || 1200) / 12; // Monthly

    // Convert to metric tons
    const tons = total / 2204.62;
    setResult(tons);
  };

  const treesNeeded = result ? Math.ceil(result * 16.5) : 0; // ~16.5 trees per ton CO2/year
  const creditsNeeded = result ? Math.ceil(result) : 0;

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          <CardTitle>Carbon Footprint Calculator</CardTitle>
        </div>
        <CardDescription>
          Calculate your monthly carbon emissions and discover how many credits you need to offset
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transport" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transport">
              <Car className="mr-2 h-4 w-4" />
              Transport
            </TabsTrigger>
            <TabsTrigger value="home">
              <Home className="mr-2 h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="lifestyle">
              <Utensils className="mr-2 h-4 w-4" />
              Lifestyle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transport" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="carMiles">Monthly Car Miles</Label>
                <Input
                  id="carMiles"
                  type="number"
                  placeholder="1000"
                  value={transportation.carMiles || ""}
                  onChange={(e) => setTransportation({...transportation, carMiles: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label>Vehicle Type</Label>
                <Select value={transportation.carType} onValueChange={(value) => setTransportation({...transportation, carType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electric">Electric Vehicle</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="average">Average Car</SelectItem>
                    <SelectItem value="suv">SUV/Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="flights">Monthly Flights</Label>
                <Input
                  id="flights"
                  type="number"
                  placeholder="2"
                  value={transportation.flights || ""}
                  onChange={(e) => setTransportation({...transportation, flights: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label>Flight Duration</Label>
                <Select value={transportation.flightType} onValueChange={(value) => setTransportation({...transportation, flightType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short Haul (&lt; 3 hours)</SelectItem>
                    <SelectItem value="medium">Medium Haul (3-6 hours)</SelectItem>
                    <SelectItem value="long">Long Haul (&gt; 6 hours)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="home" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="electricity">Monthly Electricity (kWh)</Label>
                <Input
                  id="electricity"
                  type="number"
                  placeholder="900"
                  value={home.electricity || ""}
                  onChange={(e) => setHome({...home, electricity: parseFloat(e.target.value) || 0})}
                />
                <p className="mt-1 text-xs text-muted-foreground">Average US household: ~900 kWh/month</p>
              </div>
              <div>
                <Label htmlFor="naturalGas">Monthly Natural Gas (therms)</Label>
                <Input
                  id="naturalGas"
                  type="number"
                  placeholder="40"
                  value={home.naturalGas || ""}
                  onChange={(e) => setHome({...home, naturalGas: parseFloat(e.target.value) || 0})}
                />
                <p className="mt-1 text-xs text-muted-foreground">Average US household: ~40 therms/month</p>
              </div>
              <div>
                <Label htmlFor="residents">Number of Residents</Label>
                <Input
                  id="residents"
                  type="number"
                  placeholder="1"
                  min="1"
                  value={home.residents || 1}
                  onChange={(e) => setHome({...home, residents: parseInt(e.target.value) || 1})}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lifestyle" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Diet Type</Label>
                <Select value={lifestyle.diet} onValueChange={(value) => setLifestyle({...lifestyle, diet: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="average">Average (some meat)</SelectItem>
                    <SelectItem value="meat">High Meat Consumption</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Shopping Habits</Label>
                <Select value={lifestyle.shopping} onValueChange={(value) => setLifestyle({...lifestyle, shopping: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal (essentials only)</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="high">High (frequent purchases)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-4">
          <Button onClick={calculateEmissions} className="w-full" size="lg">
            <Calculator className="mr-2 h-4 w-4" />
            Calculate My Carbon Footprint
          </Button>

          {result !== null && (
            <div className="rounded-lg border-2 border-primary/20 bg-gradient-subtle p-6 text-center">
              <div className="mb-4">
                <div className="mb-2 text-sm font-medium text-muted-foreground">Your Monthly Carbon Footprint</div>
                <div className="text-5xl font-bold text-primary">{result.toFixed(2)}</div>
                <div className="text-lg text-muted-foreground">tons CO₂</div>
              </div>

              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-background/50 p-4">
                  <div className="text-2xl font-bold text-foreground">{treesNeeded}</div>
                  <div className="text-sm text-muted-foreground">Trees needed to offset annually</div>
                </div>
                <div className="rounded-lg bg-background/50 p-4">
                  <div className="text-2xl font-bold text-foreground">{creditsNeeded}</div>
                  <div className="text-sm text-muted-foreground">Carbon credits needed</div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/marketplace">
                    Offset Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/knowledge">Learn More</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
