
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Trash2, Package, IndianRupee } from "lucide-react";
import { userStore, User, Product, Farm } from "@/store/userStore";
import { languageStore } from "@/store/languageStore";
import { getCurrentLocation, Location } from "@/utils/locationUtils";
import { useToast } from "@/hooks/use-toast";

const FarmerDashboard = ({ user }: { user: User }) => {
  const { toast } = useToast();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    type: 'vegetable' as 'vegetable' | 'fruit',
    category: '',
    name: '',
    quantity: 0,
    price: 0,
    unit: 'kg',
    description: ''
  });
  const [farmLocation, setFarmLocation] = useState<Location | null>(null);

  const categories = {
    vegetable: [
      languageStore.translate('category.leafy'),
      languageStore.translate('category.root'), 
      languageStore.translate('category.other')
    ],
    fruit: [
      languageStore.translate('category.fruits'),
      languageStore.translate('category.berries')
    ]
  };

  useEffect(() => {
    const existingFarm = userStore.getFarmByFarmerId(user.id);
    if (existingFarm) {
      setFarm(existingFarm);
      setFarmLocation(existingFarm.location);
    }
  }, [user.id]);

  const handleGetLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setFarmLocation(location);
      
      // Update user location in store
      userStore.updateUserLocation(user.id, {
        lat: location.lat,
        lng: location.lng,
        address: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
      });

      toast({
        title: "Location updated successfully",
        description: `Latitude: ${location.lat.toFixed(4)}, Longitude: ${location.lng.toFixed(4)}`
      });
    } catch (error) {
      toast({
        title: "Error getting location",
        description: "Please enable location access and try again",
        variant: "destructive"
      });
    }
  };

  const handleAddProduct = () => {
    if (!farmLocation) {
      toast({
        title: "Please set farm location first",
        variant: "destructive"
      });
      return;
    }

    if (!newProduct.name || !newProduct.category || newProduct.quantity <= 0 || newProduct.price <= 0) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      let currentFarm = farm;
      
      if (!currentFarm) {
        // Create new farm
        const farmId = userStore.addFarm({
          farmerId: user.id,
          location: {
            lat: farmLocation.lat,
            lng: farmLocation.lng,
            address: user.location?.address || `${farmLocation.lat.toFixed(4)}, ${farmLocation.lng.toFixed(4)}`
          },
          products: []
        });
        currentFarm = userStore.getFarms().find(f => f.id === farmId)!;
        setFarm(currentFarm);
      }

      // Add product to farm
      userStore.addProductToFarm(currentFarm.id, {
        ...newProduct,
        farmerId: user.id,
        createdAt: new Date()
      });

      // Reset form
      setNewProduct({
        type: 'vegetable',
        category: '',
        name: '',
        quantity: 0,
        price: 0,
        unit: 'kg',
        description: ''
      });
      setShowAddProduct(false);

      // Refresh farm data
      const updatedFarm = userStore.getFarmByFarmerId(user.id);
      setFarm(updatedFarm!);

      toast({
        title: "Product added successfully",
        className: "bg-green-50 border-green-200"
      });
    } catch (error) {
      toast({
        title: "Error adding product",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Farm Location Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Farm Location</span>
          </CardTitle>
          <CardDescription>
            Set your farm location to help buyers find you
          </CardDescription>
        </CardHeader>
        <CardContent>
          {farmLocation ? (
            <div className="space-y-2">
              <p className="text-sm text-green-600">
                ✓ Location set: {farmLocation.lat.toFixed(4)}, {farmLocation.lng.toFixed(4)}
              </p>
              <Button variant="outline" onClick={handleGetLocation}>
                Update Location
              </Button>
            </div>
          ) : (
            <Button onClick={handleGetLocation}>
              <MapPin className="h-4 w-4 mr-2" />
              Get Current Location
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Products Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>My Products</span>
            </div>
            <Button onClick={() => setShowAddProduct(true)} disabled={!farmLocation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {farm?.products.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {farm.products.map((product) => (
                <Card key={product.id} className="border-green-100">
                  <CardHeader className="pb-3">
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
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products added yet</p>
              <p className="text-sm">Add your first product to start selling</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      {showAddProduct && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select 
                  value={newProduct.type} 
                  onValueChange={(value: 'vegetable' | 'fruit') => {
                    setNewProduct({ ...newProduct, type: value, category: '' });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetable">Vegetable</SelectItem>
                    <SelectItem value="fruit">Fruit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={newProduct.category} 
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[newProduct.type].map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Product Name</label>
              <Input
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="e.g., Fresh Spinach"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Unit</label>
                <Select 
                  value={newProduct.unit} 
                  onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="bunch">bunch</SelectItem>
                    <SelectItem value="piece">piece</SelectItem>
                    <SelectItem value="dozen">dozen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Describe your product quality, freshness, etc."
              />
            </div>

            <div className="flex space-x-4">
              <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                {languageStore.translate('common.add')}
              </Button>
              <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                {languageStore.translate('common.cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FarmerDashboard;
