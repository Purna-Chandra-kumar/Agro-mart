
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Star, Leaf, Users, ShoppingCart } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'buyer' | 'farmer'>('buyer');
  const navigate = useNavigate();

  const featuredProducts = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop",
      price: "₹40/kg",
      farmer: "Rajesh Kumar",
      location: "Punjab",
      freshness: 5,
      isOrganic: true
    },
    {
      id: 2,
      name: "Sweet Mangoes",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop",
      price: "₹120/kg",
      farmer: "Sunita Devi",
      location: "Maharashtra",
      freshness: 5,
      isOrganic: false
    },
    {
      id: 3,
      name: "Organic Carrots",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=300&h=200&fit=crop",
      price: "₹60/kg",
      farmer: "Amit Singh",
      location: "Haryana",
      freshness: 4,
      isOrganic: true
    }
  ];

  const handleAuthClick = (mode: 'login' | 'signup', type: 'buyer' | 'farmer') => {
    setAuthMode(mode);
    setUserType(type);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gradient">Agro Mart</span>
          </div>
          <div className="space-x-4">
            <Button 
              variant="outline" 
              onClick={() => handleAuthClick('login', 'buyer')}
              className="border-green-200 hover:bg-green-50"
            >
              Login
            </Button>
            <Button 
              onClick={() => handleAuthClick('signup', 'buyer')}
              className="bg-green-600 hover:bg-green-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Fresh From Farm to Your Table
          </h1>
          <p className="text-xl mb-8 animate-fade-in opacity-90 max-w-2xl mx-auto">
            Connect directly with farmers and get the freshest vegetables and fruits 
            at the best prices. No middlemen, just pure freshness.
          </p>
          <div className="space-x-4 animate-slide-in">
            <Button 
              size="lg" 
              onClick={() => handleAuthClick('signup', 'buyer')}
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-3"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Start Buying
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => handleAuthClick('signup', 'farmer')}
              className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3"
            >
              <Users className="mr-2 h-5 w-5" />
              Join as Farmer
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Agro Mart?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover border-green-100">
              <CardHeader className="text-center">
                <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-800">100% Fresh</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Directly sourced from farms, ensuring maximum freshness and quality
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover border-green-100">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-800">Direct Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Connect directly with farmers, know your food source
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover border-green-100">
              <CardHeader className="text-center">
                <ShoppingCart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-800">Best Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  No middlemen means better prices for both buyers and farmers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Fresh Arrivals
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="card-hover overflow-hidden">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.isOrganic && (
                    <Badge className="absolute top-2 right-2 bg-green-600">
                      Organic
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <span className="text-lg font-bold text-green-600">{product.price}</span>
                  </div>
                  <CardDescription className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {product.farmer}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {product.location}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${i < product.freshness ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">Freshness</span>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleAuthClick('login', 'buyer')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Experience Fresh?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers and farmers on Agro Mart
          </p>
          <Button 
            size="lg" 
            onClick={() => handleAuthClick('signup', 'buyer')}
            className="bg-white text-green-600 hover:bg-green-50 px-8 py-3"
          >
            Start Shopping Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-6 w-6 text-green-400" />
            <span className="text-xl font-bold">Agro Mart</span>
          </div>
          <p className="text-gray-400">
            Connecting farmers and buyers for a fresher tomorrow
          </p>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        userType={userType}
        onSuccess={handleAuthSuccess}
        onSwitchMode={(newMode) => setAuthMode(newMode)}
        onSwitchUserType={(newType) => setUserType(newType)}
      />
    </div>
  );
};

export default Index;
