import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Search, UserPlus, Heart, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
const Index = () => {
  const {
    user,
    profile
  } = useAuth();
  const features = [{
    icon: Search,
    title: "Smart Matching",
    description: "Find flatmates based on your preferences and lifestyle"
  }, {
    icon: Shield,
    title: "Verified Profiles",
    description: "All users are verified for your safety and security"
  }, {
    icon: Heart,
    title: "Perfect Compatibility",
    description: "Advanced filters to find your ideal living companion"
  }];
  const stats = [{
    number: "10K+",
    label: "Happy Users"
  }, {
    number: "5K+",
    label: "Successful Matches"
  }, {
    number: "50+",
    label: "Cities Covered"
  }];
  return <Layout>
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-coral-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-br from-mint-400 to-blue-400 rounded-full blur-3xl opacity-20 animate-bounce"></div>
        </div>

        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-violet-500 blur-2xl opacity-30 rounded-full animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-coral-400 to-violet-500 p-6 rounded-3xl shadow-2xl">
                  <Home className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
              Find Your Perfect
              <span className="block">Flatmate Adventure</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto font-medium">
              Connect with like-minded people and discover your ideal shared living experience in the city you love.
            </p>

            {user ? <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/browse">
                  <Button className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-200">
                    <Search className="h-5 w-5 mr-2" />
                    Browse Listings
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                
                {profile?.role === 'flat_owner' && <Link to="/profile">
                    <Button variant="outline" className="h-14 px-8 text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-2xl">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Create Listing
                    </Button>
                  </Link>}
              </div> : <p className="text-lg text-slate-600">
                Welcome! You're already signed in and ready to explore.
              </p>}
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => <Card key={index} className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-coral-400 to-violet-500 bg-clip-text text-transparent mb-2 bg-slate-500">
                      {stat.number}
                    </div>
                    <div className="text-slate-600 font-semibold text-lg">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                Why Choose FlatMates?
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                We make finding the perfect flatmate simple, safe, and enjoyable.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
              const Icon = feature.icon;
              return <Card key={index} className="bg-white/80 backdrop-blur-md border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group">
                    <CardContent className="p-8 text-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-violet-500 blur-xl opacity-30 rounded-full group-hover:opacity-50 transition-opacity"></div>
                        <div className="relative bg-gradient-to-r from-coral-400 to-violet-500 p-4 rounded-2xl shadow-xl inline-block">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>;
            })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 border-0 rounded-3xl shadow-2xl overflow-hidden">
              <CardContent className="p-12">
                <div className="text-white">
                  <Sparkles className="h-12 w-12 mx-auto mb-6 animate-pulse" />
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Ready to Find Your Flatmate?
                  </h2>
                  <p className="text-xl mb-8 opacity-90">
                    Join thousands of happy users who found their perfect living companion.
                  </p>
                  <Link to="/browse">
                    <Button className="h-14 px-8 text-lg font-bold bg-white text-coral-500 hover:bg-slate-50 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-200">
                      <Search className="h-5 w-5 mr-2" />
                      Start Your Journey
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>;
};
export default Index;