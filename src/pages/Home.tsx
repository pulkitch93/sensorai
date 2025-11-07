import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Activity, BarChart3, Brain, Shield, Zap, TrendingUp } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Leverage machine learning to predict equipment failures before they happen"
    },
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description: "Track asset health and performance metrics in real-time across your entire portfolio"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep dive into performance data with comprehensive analytics and reporting"
    },
    {
      icon: Shield,
      title: "Predictive Maintenance",
      description: "Reduce downtime and maintenance costs with intelligent predictive alerts"
    },
    {
      icon: Zap,
      title: "Automated Workflows",
      description: "Streamline operations with AI agents that handle routine tasks automatically"
    },
    {
      icon: TrendingUp,
      title: "Portfolio Optimization",
      description: "Maximize ROI across your entire asset portfolio with data-driven decisions"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Asset Intelligence for <span className="text-primary">Industry</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Transform your industrial operations with AI-powered predictive maintenance 
            and real-time asset intelligence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/dashboard")}
              className="text-lg px-8 py-6"
            >
              Go to Plant Operations
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Comprehensive Asset Intelligence Platform
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">45%</div>
              <p className="text-muted-foreground">Reduction in Downtime</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">30%</div>
              <p className="text-muted-foreground">Lower Maintenance Costs</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">98%</div>
              <p className="text-muted-foreground">Prediction Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-muted-foreground">
            Get started with our comprehensive asset intelligence platform today
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/dashboard")}
            className="text-lg px-8 py-6"
          >
            Access Plant Operations
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>
            Designed and developed by{" "}
            <a 
              href="https://www.linkedin.com/in/pulkit-chaudhary" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Pulkit Chaudhary
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
