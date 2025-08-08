import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Truck, CreditCard, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/store/supabaseUserStore";
import { getCurrentLocation } from "@/utils/locationUtils";

interface DeliveryHireModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Profile;
}

const DeliveryHireModal = ({ isOpen, onClose, user }: DeliveryHireModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    pickupAddress: '',
    dropAddress: '',
    contactName: user.name || '',
    contactPhone: user.phone || '',
    specialInstructions: '',
    estimatedDistance: 0,
    basePrice: 50 // Base price in rupees
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const pricePerKm = 8; // Rate per km
  const estimatedCost = formData.basePrice + (formData.estimatedDistance * pricePerKm);

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

  const handleSubmitDelivery = () => {
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

    setShowPayment(true);
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful!",
        description: `Delivery booked for ₹${estimatedCost}. Delivery partner will contact you shortly.`,
        className: "bg-green-50 border-green-200"
      });
      
      onClose();
      setShowPayment(false);
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        pickupAddress: '',
        dropAddress: '',
        specialInstructions: '',
        estimatedDistance: 0
      }));
      
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToDetails = () => {
    setShowPayment(false);
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

        {!showPayment ? (
          <div className="space-y-6">
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
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>₹{formData.basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distance ({formData.estimatedDistance} km × ₹{pricePerKm}/km):</span>
                      <span>₹{formData.estimatedDistance * pricePerKm}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Cost:</span>
                      <span className="text-green-600">₹{estimatedCost}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <Button onClick={handleSubmitDelivery} className="flex-1 bg-green-600 hover:bg-green-700">
                Proceed to Payment
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Pickup:</span>
                    <span className="text-right flex-1 ml-4">{formData.pickupAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drop:</span>
                    <span className="text-right flex-1 ml-4">{formData.dropAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span>{formData.estimatedDistance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact:</span>
                    <span>{formData.contactName} - {formData.contactPhone}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-green-600">₹{estimatedCost}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Payment will be processed securely. Your delivery partner will be assigned after payment confirmation.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <Button 
                onClick={handlePayment} 
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Processing Payment...' : `Pay ₹${estimatedCost}`}
              </Button>
              <Button variant="outline" onClick={handleBackToDetails}>
                Back to Details
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryHireModal;