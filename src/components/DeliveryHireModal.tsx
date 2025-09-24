import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, ShoppingCart, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/store/supabaseUserStore";
import { getCurrentLocation } from "@/utils/locationUtils";
import { staticProducts, type ProductData } from "@/data/productsData";
import { useCartStore } from "@/store/cartStore";
import PaymentModal from "./PaymentModal";

interface DeliveryHireModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Profile;
  selectedProduct?: ProductData | null;
}

const DeliveryHireModal = ({ isOpen, onClose, user, selectedProduct }: DeliveryHireModalProps) => {
  const { toast } = useToast();
  const { addItem } = useCartStore();
  const [currentProduct, setCurrentProduct] = useState<ProductData | null>(selectedProduct || null);
  const [showProductSelection, setShowProductSelection] = useState(!selectedProduct);
  const [formData, setFormData] = useState({
    pickupAddress: '',
    dropAddress: '',
    contactName: user.name || '',
    contactPhone: user.phone || '',
    specialInstructions: '',
    estimatedDistance: 0,
    basePrice: 50, // Base price in rupees
    quantity: 1,
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const pricePerKm = 8; // Rate per km
  const deliveryFee = formData.estimatedDistance * pricePerKm;
  const productTotal = currentProduct ? (currentProduct.price * formData.quantity) : 0;
  const totalCost = formData.basePrice + deliveryFee + productTotal;

  const handleGetCurrentLocation = async (field: 'pickup' | 'drop') => {
    try {
      const location = await getCurrentLocation();
      const address = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
      
      if (field === 'pickup') {
        setFormData(prev => ({ ...prev, pickupAddress: address }));
      } else {
        setFormData(prev => ({ ...prev, dropAddress: address }));
      }
      
      toast({
        title: "Location added",
        description: "Current location has been added to the address field"
      });
    } catch (error) {
      toast({
        title: "Error getting location",
        description: "Please enable location access and try again",
        variant: "destructive"
      });
    }
  };

  const calculateDistance = () => {
    // Simple distance calculation (in a real app, you'd use Google Maps API)
    const randomDistance = Math.floor(Math.random() * 25) + 5; // 5-30 km range
    setFormData(prev => ({ ...prev, estimatedDistance: randomDistance }));
    
    toast({
      title: "Distance calculated",
      description: `Estimated distance: ${randomDistance} km`
    });
  };

  const handleProductSelect = (product: ProductData) => {
    setCurrentProduct(product);
    setShowProductSelection(false);
    
    toast({
      title: "Product Selected",
      description: `${product.name} selected for delivery hire. Complete the form to add to cart.`,
      className: "bg-blue-50 border-blue-200"
    });
  };

  const handleSubmitDelivery = () => {
    if (!currentProduct) {
      toast({
        title: "No product selected",
        description: "Please select a product for delivery",
        variant: "destructive"
      });
      return;
    }

    if (!formData.pickupAddress || !formData.dropAddress || !formData.contactPhone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.estimatedDistance === 0) {
      toast({
        title: "Please calculate distance",
        description: "Click 'Calculate Distance' to get pricing",
        variant: "destructive"
      });
      return;
    }

    // Add product to cart with delivery partner details
    const deliveryFee = formData.estimatedDistance * pricePerKm + formData.basePrice;
    
    addItem({
      productId: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      unit: currentProduct.unit,
      quantity: formData.quantity,
      deliveryPartnerId: `delivery-${Date.now()}`,
      deliveryPartnerName: "AgroMart Delivery Service",
      deliveryFee: deliveryFee,
      farmerName: currentProduct.farmerName,
      farmerPhone: currentProduct.farmerPhone,
    });

    toast({
      title: "Added to Cart!",
      description: `${currentProduct.name} with delivery service has been added to your cart. Check the cart icon to proceed with payment.`,
      className: "bg-green-50 border-green-200"
    });

    // Close modal and reset
    onClose();
    setCurrentProduct(null);
    setShowProductSelection(!selectedProduct);
    setFormData(prev => ({
      ...prev,
      pickupAddress: '',
      dropAddress: '',
      specialInstructions: '',
      estimatedDistance: 0,
      quantity: 1,
    }));
  };

  const handlePaymentSuccess = (transaction: any) => {
    toast({
      title: "Delivery Partner Hired!",
      description: `Payment successful. Transaction ID: ${transaction.transaction_id}. Delivery partner will contact you shortly.`,
      className: "bg-green-50 border-green-200"
    });
    
    // Reset form and close
    setFormData(prev => ({
      ...prev,
      pickupAddress: '',
      dropAddress: '',
      specialInstructions: '',
      estimatedDistance: 0,
      quantity: 1,
    }));
    setCurrentProduct(null);
    setShowProductSelection(!selectedProduct);
    onClose();
  };

  const handlePaymentFailure = (error: string) => {
    toast({
      title: "Payment Failed",
      description: `Payment failed: ${error}. Please try again.`,
      variant: "destructive"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Hire Delivery Service</span>
          </DialogTitle>
          <DialogDescription>
            Book a delivery partner to transport your goods
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Selection */}
          {showProductSelection ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Product for Delivery</CardTitle>
                <CardDescription>Choose a product to add to cart and hire delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                  {staticProducts.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="flex-1">
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm text-gray-600">{product.farmerName}</div>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">₹{product.price}/{product.unit}</div>
                        <div className="text-xs text-gray-500">{product.quantity} {product.unit} available</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Selected Product Summary */}
              {currentProduct && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Selected Product
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-lg">{currentProduct.name}</div>
                        <div className="text-sm text-gray-600">By {currentProduct.farmerName}</div>
                        <Badge variant="secondary" className="mt-1">
                          {currentProduct.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600 text-lg">
                          ₹{currentProduct.price}/{currentProduct.unit}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Label htmlFor="quantity">Quantity:</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                        >
                          -
                        </Button>
                        <span className="px-3 py-1 border rounded">{formData.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                        >
                          +
                        </Button>
                        <span className="text-sm text-gray-600">{currentProduct.unit}</span>
                      </div>
                    </div>

                    <div className="flex justify-between font-semibold">
                      <span>Product Total:</span>
                      <span className="text-green-600">₹{productTotal}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowProductSelection(true)}
                    >
                      Change Product
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Delivery Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Delivery Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup">Pickup Address *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="pickup"
                      placeholder="Enter pickup location"
                      value={formData.pickupAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, pickupAddress: e.target.value }))}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleGetCurrentLocation('pickup')}
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drop">Drop Address *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="drop"
                      placeholder="Enter drop location"
                      value={formData.dropAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, dropAddress: e.target.value }))}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleGetCurrentLocation('drop')}
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any special handling instructions for the delivery"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button onClick={calculateDistance} className="bg-blue-600 hover:bg-blue-700">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Distance
                  </Button>
                  {formData.estimatedDistance > 0 && (
                    <span className="text-lg font-semibold">
                      Distance: {formData.estimatedDistance} km
                    </span>
                  )}
                </div>

                {formData.estimatedDistance > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {currentProduct && (
                      <>
                        <div className="flex justify-between">
                          <span>Product ({formData.quantity} {currentProduct.unit}):</span>
                          <span>₹{productTotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Base Service Fee:</span>
                          <span>₹{formData.basePrice}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Fee ({formData.estimatedDistance} km × ₹{pricePerKm}/km):</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Cost:</span>
                      <span className="text-green-600">₹{totalCost}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

              <div className="flex space-x-4">
                <Button 
                  onClick={handleSubmitDelivery} 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!currentProduct}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart & Hire Delivery
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default DeliveryHireModal;