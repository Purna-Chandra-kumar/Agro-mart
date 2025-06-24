
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Star, ArrowLeft, Leaf, Calendar, Shield, Heart, Share2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock product data - in real app, this would come from API
  const product = {
    id: parseInt(id || "1"),
    name: "Fresh Tomatoes",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&h=400&fit=crop",
    price: "₹40/kg",
    farmer: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh.kumar@email.com",
      location: "Village Khanna, Punjab",
      experience: "15 years",
      rating: 4.8
    },
    freshness: 5,
    isOrganic: true,
    category: "vegetable",
    description: "Premium quality fresh tomatoes, grown organically without pesticides. Perfect for cooking, salads, and making sauces. These tomatoes are hand-picked at optimal ripeness to ensure maximum flavor and nutritional value.",
    characteristics: [
      "Organically grown",
      "No pesticides used",
      "Hand-picked at perfect ripeness",
      "Rich in lycopene and vitamins",
      "Ideal for cooking and fresh consumption"
    ],
    productionDate: "2024-06-20",
    shelfLife: "7-10 days when stored properly",
    weight: "Available in 1kg, 2kg, and 5kg packs",
    availableQuantity: "500kg",
    harvestSeason: "Year-round availability",
    certifications: ["Organic Certified", "Pesticide-Free"]
  };

  const handleLocationClick = () => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(product.farmer.location)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleCallFarmer = () => {
    window.open(`tel:${product.farmer.phone}`, '_self');
  };

  const handleWhatsApp = () => {
    const message = `Hi ${product.farmer.name}, I'm interested in buying your ${product.name}. Can you please provide more details?`;
    const whatsappUrl = `https://wa.me/${product.farmer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out these ${product.name} from ${product.farmer.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({ 
      title: isFavorite ? "Removed from favorites" : "Added to favorites!",
      description: isFavorite ? undefined : "You can find this in your favorites list"
    });
  };

  const handleBuyNow = () => {
    toast({ 
      title: "Contact farmer to proceed",
      description: "Call or message the farmer to place your order",
      className: "bg-green-50 border-green-200"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-gradient">Agro Mart</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              {product.isOrganic && (
                <Badge className="absolute top-4 right-4 bg-green-600 text-white">
                  <Leaf className="h-3 w-3 mr-1" />
                  Organic Certified
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavorite}
                className={`absolute top-4 left-4 ${isFavorite ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl font-bold text-green-600">{product.price}</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-4 w-4 ${i < product.freshness ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">Freshness Rating</span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Farmer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Farmer Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{product.farmer.name}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{product.farmer.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={handleLocationClick}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    {product.farmer.location}
                  </button>
                  <span className="text-sm text-gray-500">{product.farmer.experience} experience</span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button onClick={handleCallFarmer} className="flex-1 bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Farmer
                  </Button>
                  <Button onClick={handleWhatsApp} variant="outline" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Product Characteristics */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Product Characteristics</h3>
              <div className="grid grid-cols-1 gap-2">
                {product.characteristics.map((char, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{char}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-500">Production Date</span>
                    <p className="font-medium">{new Date(product.productionDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-500">Shelf Life</span>
                    <p className="font-medium">{product.shelfLife}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Available Quantity</span>
                  <p className="font-medium">{product.availableQuantity}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Package Options</span>
                  <p className="font-medium">{product.weight}</p>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {product.certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button onClick={handleBuyNow} size="lg" className="flex-1 bg-green-600 hover:bg-green-700">
                Buy Now
              </Button>
              <Button onClick={handleCallFarmer} variant="outline" size="lg" className="flex-1">
                Contact Farmer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
