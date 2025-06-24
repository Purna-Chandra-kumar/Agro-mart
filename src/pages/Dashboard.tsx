
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Star, Search, Filter, Leaf, ShoppingCart, User, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const products = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop",
      price: "₹40/kg",
      farmer: "Rajesh Kumar",
      location: "Punjab",
      phone: "+91 98765 43210",
      freshness: 5,
      isOrganic: true,
      category: "vegetable",
      description: "Fresh red tomatoes, perfect for cooking and salads"
    },
    {
      id: 2,
      name: "Sweet Mangoes",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop",
      price: "₹120/kg",
      farmer: "Sunita Devi",
      location: "Maharashtra",
      phone: "+91 87654 32109",
      freshness: 5,
      isOrganic: false,
      category: "fruit",
      description: "Sweet Alphonso mangoes, hand-picked at perfect ripeness"
    },
    {
      id: 3,
      name: "Organic Carrots",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=300&h=200&fit=crop",
      price: "₹60/kg",
      farmer: "Amit Singh",
      location: "Haryana",
      phone: "+91 76543 21098",
      freshness: 4,
      isOrganic: true,
      category: "vegetable",
      description: "Organically grown carrots, rich in vitamins and minerals"
    },
    {
      id: 4,
      name: "Fresh Spinach",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=200&fit=crop",
      price: "₹30/bunch",
      farmer: "Priya Sharma",
      location: "Uttar Pradesh",
      phone: "+91 65432 10987",
      freshness: 5,
      isOrganic: true,
      category: "vegetable",
      description: "Fresh green spinach leaves, harvested this morning"
    },
    {
      id: 5,
      name: "Sweet Oranges",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=200&fit=crop",
      price: "₹80/kg",
      farmer: "Ramesh Patel",
      location: "Gujarat",
      phone: "+91 54321 09876",
      freshness: 4,
      isOrganic: false,
      category: "fruit",
      description: "Juicy sweet oranges, packed with vitamin C"
    },
    {
      id: 6,
      name: "Fresh Potatoes",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop",
      price: "₹25/kg",
      farmer: "Krishna Reddy",
      location: "Andhra Pradesh",
      phone: "+91 43210 98765",
      freshness: 4,
      isOrganic: false,
      category: "vegetable",
      description: "Farm-fresh potatoes, ideal for all cooking purposes"
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || 
                         product.category === selectedFilter ||
                         (selectedFilter === "organic" && product.isOrganic);
    
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleLocationClick = (location: string) => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gradient">Agro Mart</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Fresh Marketplace</h1>
          <p className="text-gray-600">Discover fresh vegetables and fruits directly from farmers</p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for vegetables, fruits, or farmers..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="vegetable">Vegetables</SelectItem>
                  <SelectItem value="fruit">Fruits</SelectItem>
                  <SelectItem value="organic">Organic Only</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline"
                onClick={() => navigate('/market-prices')}
                className="whitespace-nowrap"
              >
                Market Prices
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fresh Arrivals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Organic Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter(p => p.isOrganic).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="card-hover overflow-hidden">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.isOrganic && (
                  <Badge className="absolute top-2 right-2 bg-green-600">
                    <Leaf className="h-3 w-3 mr-1" />
                    Organic
                  </Badge>
                )}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-white/90">
                    {product.category === 'vegetable' ? '🥬' : '🍎'} {product.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <span className="text-lg font-bold text-green-600">{product.price}</span>
                </div>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${i < product.freshness ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-1 text-gray-600">Freshness</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-1" />
                      {product.farmer}
                    </span>
                    <a href={`tel:${product.phone}`} className="flex items-center text-green-600 hover:text-green-700">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </a>
                  </div>
                  
                  <button 
                    onClick={() => handleLocationClick(product.location)}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    {product.location} (View on Map)
                  </button>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleViewDetails(product.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(`tel:${product.phone}`, '_self')}
                    className="border-green-200 hover:bg-green-50"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No products found matching your search criteria</div>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
