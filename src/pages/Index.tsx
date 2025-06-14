
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Home, 
  Search, 
  UserPlus, 
  Heart,
  Shield,
  Sparkles,
  ArrowRight,
  Zap,
  Users,
  MapPin
} from "lucide-react";
import { Layout } from "@/components/Layout";

const Index = () => {
  const features = [
    {
      icon: Zap,
      title: "Instant Matching",
      description: "AI-powered compatibility scoring finds your perfect flatmate in seconds",
      gradient: "from-purple-haze to-neon-pink"
    },
    {
      icon: Shield,
      title: "Safe & Verified",
      description: "Every profile is verified with social media integration for your peace of mind",
      gradient: "from-electric-blue to-cyber-lime"
    },
    {
      icon: Users,
      title: "Community Vibes",
      description: "Join interest-based groups and find flatmates who share your lifestyle",
      gradient: "from-sunset-orange to-neon-pink"
    }
  ];

  const stats = [
    { number: "50K+", label: "Gen Z Users", icon: "🚀" },
    { number: "25K+", label: "Perfect Matches", icon: "💝" },
    { number: "100+", label: "Cities", icon: "🌍" }
  ];

  return (
    <Layout>
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-haze/20 to-neon-pink/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-electric-blue/20 to-cyber-lime/20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-br from-sunset-orange/20 to-neon-pink/20 rounded-full blur-3xl float"></div>
        </div>

        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-haze to-neon-pink blur-2xl opacity-40 rounded-full animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-purple-haze to-neon-pink p-6 rounded-3xl shadow-2xl elevation-4">
                  <Home className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6 hero-gradient leading-tight">
              Find Your
              <span className="block">Flatmate Tribe</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              The coolest way to discover your perfect flatmate. Swipe, match, and move in together. 
              <span className="hero-gradient font-bold"> It's giving main character energy! ✨</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/browse">
                <Button className="btn-primary h-16 px-10 text-xl font-black rounded-3xl">
                  <Search className="h-6 w-6 mr-3" />
                  Start Exploring
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
              </Link>
              
              <Button variant="outline" className="h-16 px-10 text-xl font-bold border-2 border-purple-haze/30 text-purple-haze hover:bg-purple-haze/10 rounded-3xl backdrop-blur-md">
                <Heart className="h-6 w-6 mr-3" />
                How It Works
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="card-modern group cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">{stat.icon}</div>
                    <div className="text-4xl md:text-5xl font-black hero-gradient mb-2">
                      {stat.number}
                    </div>
                    <div className="text-slate-600 font-bold text-lg">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-6 hero-gradient">
                Why We're Different
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                Not your basic flatmate finder. We're serving main character energy with every match! 💅
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="card-modern group cursor-pointer overflow-hidden relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-all duration-300`}></div>
                    <CardContent className="p-8 text-center relative z-10">
                      <div className="relative mb-6">
                        <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} blur-xl opacity-30 rounded-full group-hover:opacity-50 transition-opacity`}></div>
                        <div className={`relative bg-gradient-to-r ${feature.gradient} p-4 rounded-2xl shadow-xl inline-block`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed font-medium">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="card-modern overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-haze via-neon-pink to-electric-blue"></div>
              <CardContent className="p-12 relative z-10">
                <div className="text-white">
                  <Sparkles className="h-12 w-12 mx-auto mb-6 animate-pulse" />
                  <h2 className="text-4xl md:text-5xl font-black mb-6">
                    Ready to Find Your People?
                  </h2>
                  <p className="text-xl mb-8 opacity-90 font-medium">
                    Join the flatmate revolution. No cap, it's about to be iconic! 🔥
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/browse">
                      <Button className="h-14 px-8 text-lg font-black bg-white text-purple-haze hover:bg-slate-50 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                        <Search className="h-5 w-5 mr-2" />
                        Let's Go Bestie!
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
