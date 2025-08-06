import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Phone, MapPin } from "lucide-react";
import { ProductData } from "@/data/productsData";

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    product: ProductData;
    quantity: number;
    total: number;
    deliveryFee?: number;
    orderType: 'delivery' | 'direct';
    deliveryPartner?: {
      name: string;
      phone: string;
    };
  } | null;
}

const OrderConfirmation = ({ isOpen, onClose, order }: OrderConfirmationProps) => {
  if (!order) return null;

  const productTotal = order.product.price * order.quantity;
  const deliveryFee = order.deliveryFee || 0;
  const grandTotal = productTotal + deliveryFee;

  const downloadInvoice = () => {
    // Create a simple text invoice
    const invoiceText = `
AGRO MART - INVOICE
==================
Order ID: ${order.id}
Date: ${new Date().toLocaleDateString()}

PRODUCT DETAILS:
- Product: ${order.product.name}
- Farmer: ${order.product.farmerName}
- Quantity: ${order.quantity} ${order.product.unit}
- Price per ${order.product.unit}: ₹${order.product.price}
- Product Total: ₹${productTotal}

${order.orderType === 'delivery' ? `
DELIVERY DETAILS:
- Delivery Partner: ${order.deliveryPartner?.name}
- Delivery Fee: ₹${deliveryFee}
` : 'ORDER TYPE: Direct Purchase'}

TOTAL AMOUNT: ₹${grandTotal}

Thank you for shopping with Agro Mart!
    `;

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2 text-green-600 mb-2">
            <CheckCircle className="h-6 w-6" />
            <DialogTitle>Order Confirmed!</DialogTitle>
          </div>
          <DialogDescription>
            Your order has been successfully placed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">{order.product.name}</span>
                <span>₹{order.product.price} × {order.quantity}</span>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Farmer: {order.product.farmerName}</span>
                <span>₹{productTotal}</span>
              </div>

              {order.orderType === 'delivery' && (
                <>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery by: {order.deliveryPartner?.name}</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total Amount</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>
                </>
              )}

              {order.orderType === 'direct' && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-1">Direct Purchase</p>
                  <p className="text-sm text-blue-600">
                    Contact the farmer directly to arrange pickup and payment.
                  </p>
                  <div className="flex items-center mt-2 text-sm text-blue-700">
                    <Phone className="h-4 w-4 mr-1" />
                    {order.product.farmerPhone}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={downloadInvoice}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmation;