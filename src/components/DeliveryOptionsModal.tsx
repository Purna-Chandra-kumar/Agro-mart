
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Truck, User, Phone, Star, MapPin, IndianRupee, ShoppingCart } from "lucide-react";
import { supabaseUserStore } from "@/store/supabaseUserStore";
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/hooks/use-toast";

interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  location: any;
  rating: number;
  price_per_km: number;
  available: boolean;
}
import { languageStore } from "@/store/languageStore";

interface ProductWithDistance {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  distance: number;
  farmerName: string;
  farmerPhone: string;
  farmLocation: { lat: number; lng: number };
}

interface DeliveryOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductWithDistance;
  onDirectBuy: (product: ProductWithDistance, quantity: number) => void;
  onDeliveryOrder?: (product: ProductWithDistance, deliveryPartner: DeliveryPartner, quantity: number) => void;
}

const DeliveryOptionsModal = ({
  isOpen,
  onClose,
  product,
  onDirectBuy,
  onDeliveryOrder
}: DeliveryOptionsModalProps) => {
  const [selectedOption, setSelectedOption] = useState<'direct' | 'delivery' | null>(null);
  const [selectedDeliveryPartner, setSelectedDeliveryPartner] = useState<DeliveryPartner | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([]);
  
  const { addItem } = useCartStore();
  
  useEffect(() => {
    const loadPartners = async () => {
      const partners = await supabaseUserStore.getDeliveryPartners();
      setDeliveryPartners(partners);
    };
    loadPartners();
  }, []);

  const handleDirectBuy = () => {
    onDirectBuy(product, orderQuantity);
    onClose();
  };

  const handleDeliveryOrder = () => {
    if (selectedDeliveryPartner && orderQuantity > 0 && onDeliveryOrder) {
      onDeliveryOrder(product, selectedDeliveryPartner, orderQuantity);
    }
  };

  const handleAddToCart = () => {
    if (selectedDeliveryPartner && orderQuantity > 0) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        quantity: orderQuantity,
        deliveryPartnerId: selectedDeliveryPartner.id,
        deliveryPartnerName: selectedDeliveryPartner.name,
        deliveryFee: calculateDeliveryFee(selectedDeliveryPartner),
        farmerName: product.farmerName,
        farmerPhone: product.farmerPhone
      });
      
      toast({
        title: "Added to Cart!",
        description: `${orderQuantity} ${product.unit} of ${product.name} added to your cart.`,
      });
      
      onClose();
    }
  };

  const calculateDeliveryFee = (partner: DeliveryPartner) => {
    return Math.round(product.distance * partner.price_per_km);
  };

  const calculateTotal = () => {
    const productTotal = product.price * orderQuantity;
    const deliveryFee = selectedDeliveryPartner ? calculateDeliveryFee(selectedDeliveryPartner) : 0;
    return productTotal + deliveryFee;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buy {product.name}</DialogTitle>
          <DialogDescription>
            Choose how you want to purchase this product
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Summary */}
          <Card className="border-green-100">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600">
                    From {product.farmerName} • {product.distance.toFixed(1)}km away
                  </p>
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
          </Card>

          {/* Purchase Options */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Choose Purchase Method</h3>
            
            {/* Direct Buy Option */}
            <Card 
              className={`cursor-pointer border-2 transition-colors ${
                selectedOption === 'direct' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedOption('direct')}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">
                      {languageStore.translate('delivery.direct')}
                    </CardTitle>
                    <CardDescription>
                      Contact the farmer directly for purchase and pickup
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{product.farmerPhone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{product.distance.toFixed(1)}km away</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    No extra charges
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Option */}
            <Card 
              className={`cursor-pointer border-2 transition-colors ${
                selectedOption === 'delivery' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedOption('delivery')}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Truck className="h-6 w-6 text-green-600" />
                  <div>
                    <CardTitle className="text-lg">
                      {languageStore.translate('delivery.hire')}
                    </CardTitle>
                    <CardDescription>
                      Get the product delivered to your location
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              {selectedOption === 'delivery' && (
                <CardContent className="space-y-4">
                  {/* Quantity Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {languageStore.translate('product.quantity')}
                    </label>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                        disabled={orderQuantity <= 1}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center"
                        min="1"
                        max={product.quantity}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOrderQuantity(Math.min(product.quantity, orderQuantity + 1))}
                        disabled={orderQuantity >= product.quantity}
                      >
                        +
                      </Button>
                      <span className="text-sm text-gray-500">{product.unit}</span>
                    </div>
                  </div>

                  {/* Delivery Partners */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Select Delivery Partner
                    </label>
                    <div className="space-y-2">
                      {deliveryPartners.map((partner) => (
                        <Card
                          key={partner.id}
                          className={`cursor-pointer border transition-colors ${
                            selectedDeliveryPartner?.id === partner.id 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedDeliveryPartner(partner)}
                        >
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <Truck className="h-5 w-5 text-gray-500" />
                                <div>
                                  <div className="font-medium">{partner.name}</div>
                                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Star className="h-3 w-3 fill-current text-yellow-400" />
                                    <span>{partner.rating}</span>
                                    <span>•</span>
                                    <span>{partner.phone}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">₹{calculateDeliveryFee(partner)}</div>
                                <div className="text-sm text-gray-500">delivery fee</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  {selectedDeliveryPartner && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Order Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>{product.name} ({orderQuantity} {product.unit})</span>
                          <span>₹{product.price * orderQuantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{languageStore.translate('delivery.fee')}</span>
                          <span>₹{calculateDeliveryFee(selectedDeliveryPartner)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>₹{calculateTotal()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {selectedOption === 'direct' && (
              <Button onClick={handleDirectBuy} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Phone className="h-4 w-4 mr-2" />
                Contact Farmer
              </Button>
            )}
            
            {selectedOption === 'delivery' && selectedDeliveryPartner && (
              <Button onClick={handleAddToCart} className="flex-1 bg-green-600 hover:bg-green-700">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            )}
            
            <Button variant="outline" onClick={onClose}>
              {languageStore.translate('common.cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryOptionsModal;
