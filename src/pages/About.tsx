import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Home, Star, CheckCircle, MessageCircle } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "All users go through a verification process to ensure safety and authenticity."
    },
    {
      icon: Users,
      title: "Quality Matches",
      description: "Our smart matching algorithm connects you with compatible flatmates."
    },
    {
      icon: Home,
      title: "Trusted Listings",
      description: "Every property listing is verified for accuracy and legitimacy."
    },
    {
      icon: MessageCircle,
      title: "Secure Communication",
      description: "Chat safely with potential flatmates through our secure messaging system."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Users" },
    { number: "5,000+", label: "Successful Matches" },
    { number: "50+", label: "Cities Covered" },
    { number: "4.8", label: "Average Rating" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Bangalore",
      text: "Found my perfect flatmate within a week! The verification process made me feel safe.",
      rating: 5
    },
    {
      name: "Rahul Gupta",
      location: "Mumbai",
      text: "Listed my flat and got genuine inquiries. The platform is very user-friendly.",
      rating: 5
    },
    {
      name: "Sneha Patel",
      location: "Pune",
      text: "The matching system is brilliant. Found someone with similar lifestyle preferences.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white space-section">
        <div className="section-container text-center">
          <h1 className="text-display mb-6">
            About FlatMates
          </h1>
          <p className="text-body-large text-blue-100 max-w-3xl mx-auto">
            We're revolutionizing the way people find flats and flatmates in India. 
            Our platform connects verified seekers with trusted property owners through 
            a safe, secure, and intelligent matching system.
          </p>
        </div>
      </div>

      <div className="section-container">
        {/* Mission Section */}
        <div className="section-header">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-description">
            To create a trusted ecosystem where finding the perfect flat and compatible flatmates 
            is simple, safe, and stress-free. We believe everyone deserves a home where they feel 
            comfortable, secure, and happy.
          </p>
        </div>

        {/* Features Section */}
        <div className="space-component">
          <h2 className="section-title text-center mb-12">Why Choose FlatMates?</h2>
          <div className="grid-features">
            {features.map((feature, index) => (
              <Card key={index} className="card-primary text-center hover-lift">
                <CardHeader>
                  <div className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-heading-3">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-body text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white p-12 space-component">
          <h2 className="text-heading-1 text-center mb-12">Our Impact</h2>
          <div className="grid-stats text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="space-component">
          <h2 className="section-title text-center mb-12">How It Works</h2>
          <div className="grid-cards">
            <div className="text-center animate-slide-up">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-heading-3 mb-2">Create Your Profile</h3>
              <p className="text-body text-slate-600">Sign up and create a detailed profile with your preferences and requirements.</p>
            </div>
            <div className="text-center animate-slide-up">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="text-heading-3 mb-2">Browse & Connect</h3>
              <p className="text-body text-slate-600">Search for flats or list your property. Connect with verified users.</p>
            </div>
            <div className="text-center animate-slide-up">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-heading-3 mb-2">Move In Safely</h3>
              <p className="text-body text-slate-600">Complete the process securely with our verified users and support team.</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-component">
          <h2 className="section-title text-center mb-12">What Our Users Say</h2>
          <div className="grid-cards">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-primary hover-lift">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-body text-slate-600 mb-4">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-body-small text-slate-500">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center card-secondary p-12 animate-scale-in">
          <h2 className="text-heading-1 mb-6">Ready to Find Your Perfect Home?</h2>
          <p className="text-body-large text-slate-600 mb-8">
            Join thousands of happy users who found their ideal living situation through FlatMates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-primary">
              <a href="/browse">Browse Flats</a>
            </Button>
            <Button className="btn-outline">
              <a href="/create-listing">List Your Property</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;