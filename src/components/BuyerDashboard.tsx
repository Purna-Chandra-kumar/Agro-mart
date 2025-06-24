
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Search, Filter, Truck, User, ShoppingCart, Star } from "lucide-react";
import { userStore, User, Farm, Product, DeliveryPartner } from "@/store/userStore";
import { languageStore } from "@/store/languageStore";
import { getCurrentLocation, calculateDistance, formatDistance, Location } from "@/utils/locationUtils";
import { useToast } from "@/hooks/use-toast";
import DeliveryOptionsModal from "./DeliveryOptionsModal";

interface ProductWithDistance extends Product {
  distance: number;
  farmerName: string;
  farmerPhone: string;
  farmLocation: Location;
}

const BuyerDashboard = ({ user }: { user: User }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<ProductWithDistance[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithDistance | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'Leafy Greens', label: languageStore.translate('category.leafy') },
    { value: 'Root Vegetables', label: languageStore.translate('category.root') },
    { value: 'Other Vegetables', label: languageStore.translate('category.other') },
    { value: 'Fruits', label: languageStore.translate('category.fruits') },
    { value: 'Berries', label: languageStore.translate('category.berries') }
  ];

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      // Get user location
      const location = await getCurrentLocation();
      setUserLocation(location);
      
      // Get all farms and calculate distances
      const farms = userStore.getFarms();
      const allProducts: ProductWithDistance[] = [];

      farms.forEach(farm => {
        const farmer = userStore.getCurrentUser(); // In real app, get farmer by farm.farmerId
        farm.products.forEach(product => {
          const distance = calculateDistance(location, farm.location);
          allProducts.push({
            ...product,
            distance,
            farmerName: farmer?.name || 'Unknown Farmer',
            farmerPhone: farmer?.phone || '',
            farmLocation: farm.location
          });
        });
      });

      // Sort by distance
      allProducts.sort((a, b) => a.distance - b.distance);
      setProducts(allProducts);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error getting location",
        description: "Using default location for distance calculation",
        variant: "destructive"
      });
      
      // Fallback without location
      const farms = userStore.getFarms();
      const allProducts: ProductWithDistance[] = [];
      
      farms.forEach(farm => {
        const farmer = userStore.getCurrentUser();
        farm.products.forEach(product => {
          allProducts.push({
            ...product,
            distance: 0,
            farmerName: farmer?.name || 'Unknown Farmer',
            farmerPhone: farmer?.phone || '',
            farmLocation: farm.location
          });
        });
      });
      
      setProducts(allProducts);
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleLocationClick = (location: Location) => {
    const mapsUrl = `https://www.google.com/maps/search/${location.lat},${location.lng}`;
    window.open(mapsUrl, '_blank');
  };

  const handleBuyProduct = (product: ProductWithDistance) => {
    setSelectedProduct(product);
    setShowDeliveryModal(true);
  };

  const handleDirectBuy = (product: ProductWithDistance) => {
    toast({
      title: "Contact farmer directly",
      description: `Call ${product.farmerName} at ${product.farmerPhone}`,
      className: "bg-blue-50 border-blue-200"
    });
  };

  const handleDeliveryOrder = (product: ProductWithDistance, deliveryPartner: DeliveryPartner, quantity: number) => {
    const productTotal = product.price * quantity;
    const deliveryFee = Math.round(product.distance * deliveryPartner.pricePerKm);
    const total = productTotal + deliveryFee;
    
    toast({
      title: "Order placed for delivery!",
      description: `Total: ₹${total} (Product: ₹${productTotal} + Delivery: ₹${deliveryFee})`,
      className: "bg-green-50 border-green-200"
    });
    
    setShowDeliveryModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={languageStore.translate('common.search') + " vegetables, fruits, or farmers..."}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products by Category */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.value} value={category.value} className="text-xs">
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.value} value={category.value} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts
                .filter(p => category.value === 'all' || p.category === category.value)
                .map((product) => (
                <Card key={product.id} className="card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ₹{product.price}/{product.unit}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.quantity} {product.unit} available
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{product.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-1" />
                          {product.farmerName}
                        </span>
                        <a href={`tel:${product.farmerPhone}`} className="flex items-center text-green-600 hover:text-green-700">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </a>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={() => handleLocationClick(product.farmLocation)}
                          className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          View on Map
                        </button>
                        <span className="text-sm text-gray-500">
                          {userLocation ? formatDistance(product.distance) : 'Location unavailable'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleBuyProduct(product)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredProducts.filter(p => category.value === 'all' || p.category === category.value).length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No products found in this category</div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Delivery Options Modal */}
      {selectedProduct && (
        <DeliveryOptionsModal
          isOpen={showDeliveryModal}
          onClose={() => setShowDeliveryModal(false)}
          product={selectedProduct}
          onDirectBuy={handleDirectBuy}
          onDeliveryOrder={handleDeliveryOrder}
        />
      )}
    </div>
  );
};

export default BuyerDashboard;
