import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Trash2, Plus, Minus, ShoppingCart, CreditCard } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import PaymentModal from "./PaymentModal";

interface CartDropdownProps {
  trigger: React.ReactNode;
}

const CartDropdown = ({ trigger }: CartDropdownProps) => {
  const { items, removeItem, updateQuantity, clearCart, getTotalAmount } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentOrderDetails, setPaymentOrderDetails] = useState<any>(null);

  const handleProceedToPayment = () => {
    if (items.length === 0) return;
    
    const orderDetails = {
      items: items.map(item => ({
        product_name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        delivery_partner: item.deliveryPartnerName,
        delivery_fee: item.deliveryFee
      })),
      total_amount: getTotalAmount(),
      delivery_fees: items.reduce((total, item) => total + item.deliveryFee, 0),
      service_type: "product_purchase_bulk"
    };
    
    setPaymentOrderDetails(orderDetails);
    setShowPaymentModal(true);
    setIsOpen(false);
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setShowPaymentModal(false);
    // Could show success toast here
  };

  const handlePaymentFailure = () => {
    setShowPaymentModal(false);
    // Could show error toast here  
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {trigger}
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart ({items.length} items)
            </SheetTitle>
            <SheetDescription>
              Review your items and proceed to payment
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your cart is empty</p>
                <p className="text-sm">Add some vegetables to get started!</p>
              </div>
            ) : (
              items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        From {item.farmerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        via {item.deliveryPartnerName}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          ₹{item.price}/{item.unit}
                        </Badge>
                        <Badge variant="secondary">
                          Delivery: ₹{item.deliveryFee}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-sm">
                        <div>₹{(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-xs text-gray-500">+ ₹{item.deliveryFee} delivery</div>
                        <div className="font-medium">₹{item.total.toFixed(2)}</div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
          
          {items.length > 0 && (
            <div className="mt-6 space-y-4">
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fees:</span>
                  <span>₹{items.reduce((total, item) => total + item.deliveryFee, 0).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleProceedToPayment}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Payment
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Payment Modal */}
      {showPaymentModal && paymentOrderDetails && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderDetails={paymentOrderDetails}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
        />
      )}
    </>
  );
};

export default CartDropdown;