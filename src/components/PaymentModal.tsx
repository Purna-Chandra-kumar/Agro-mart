import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Truck, AlertCircle, CheckCircle, QrCode, ArrowLeft, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    productName?: string;
    productPrice?: number;
    deliveryFee?: number;
    totalAmount: number;
    service_type: string;
    product_id?: string;
    delivery_partner_id?: string;
    metadata?: any;
    items?: Array<{
      product_name: string;
      quantity: number;
      unit: string;
      price: number;
      delivery_partner: string;
      delivery_fee: number;
    }>;
    total_amount?: number;
    delivery_fees?: number;
  };
  onPaymentSuccess: (transaction: any) => void;
  onPaymentFailure: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  orderDetails, 
  onPaymentSuccess, 
  onPaymentFailure 
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selection' | 'qr' | 'processing'>('selection');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('');
  const [customUpiId, setCustomUpiId] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>('');

  const upiApps = [
    { id: 'googlepay', name: 'Google Pay', color: 'bg-blue-600', scheme: 'gpay://' },
    { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-600', scheme: 'phonepe://' },
    { id: 'paytm', name: 'Paytm', color: 'bg-blue-800', scheme: 'paytmmp://' },
    { id: 'bhim', name: 'BHIM UPI', color: 'bg-orange-600', scheme: 'bhim://' },
    { id: 'amazonpay', name: 'Amazon Pay', color: 'bg-orange-500', scheme: 'amazonpay://' },
    { id: 'whatsapp', name: 'WhatsApp Pay', color: 'bg-green-600', scheme: 'whatsapp://' },
  ];

  useEffect(() => {
    // Load Razorpay script
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => {
        toast({
          title: "Payment Gateway Error",
          description: "Failed to load payment gateway. Please try again.",
          variant: "destructive"
        });
      };
      document.head.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }

    return () => {
      // Cleanup script if needed
    };
  }, []);

  const generateQRCode = async (upiId: string) => {
    const amount = orderDetails.totalAmount || orderDetails.total_amount;
    const upiString = `upi://pay?pa=${upiId}&pn=AgroMart&am=${amount}&cu=INR&tn=Payment for AgroMart products`;
    
    // Generate QR code URL (using a simple QR service for demo)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
    setQrCode(qrCodeUrl);
    setPaymentUrl(upiString);
    setCurrentStep('qr');
  };

  const handleUpiAppSelect = (appId: string) => {
    setSelectedUpiApp(appId);
    const selectedApp = upiApps.find(app => app.id === appId);
    if (selectedApp) {
      // For demo purposes, using test UPI ID
      generateQRCode('test@upi');
    }
  };

  const handleCustomUpiSubmit = () => {
    if (!customUpiId.trim()) {
      toast({
        title: "UPI ID Required",
        description: "Please enter a valid UPI ID",
        variant: "destructive"
      });
      return;
    }
    generateQRCode(customUpiId);
  };

  const copyUpiString = () => {
    navigator.clipboard.writeText(paymentUrl);
    toast({
      title: "Copied!",
      description: "UPI payment string copied to clipboard",
    });
  };

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast({
        title: "Payment Gateway Loading",
        description: "Please wait for payment gateway to load.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setCurrentStep('processing');

    try {
      // Create order via edge function
      const { data, error } = await supabase.functions.invoke('razorpay-payment', {
        body: {
          action: 'create_order',
          amount: orderDetails.totalAmount,
          service_type: orderDetails.service_type,
          product_id: orderDetails.product_id,
          delivery_partner_id: orderDetails.delivery_partner_id,
          metadata: orderDetails.metadata,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      const { order_id, amount, currency, key_id, transaction_id } = data;

      // Configure Razorpay options
      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: 'AgroMart',
        description: `Payment for ${orderDetails.productName}`,
        order_id: order_id,
        prefill: {
          method: 'upi',
        },
        theme: {
          color: '#16a34a'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setPaymentStatus('idle');
            toast({
              title: "Payment Cancelled",
              description: "Payment was cancelled by user.",
              variant: "destructive"
            });
          }
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('razorpay-payment', {
              body: {
                action: 'verify_payment',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                transaction_id: transaction_id,
              },
            });

            if (verifyError || !verifyData.success) {
              throw new Error('Payment verification failed');
            }

            setPaymentStatus('success');
            toast({
              title: "Payment Successful!",
              description: `Payment of ₹${orderDetails.totalAmount} completed successfully.`,
              className: "bg-green-50 border-green-200"
            });

            onPaymentSuccess(verifyData.transaction);
            onClose();

          } catch (error: any) {
            setPaymentStatus('failed');
            toast({
              title: "Payment Verification Failed",
              description: error.message,
              variant: "destructive"
            });
            onPaymentFailure(error.message);
          } finally {
            setIsProcessing(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      setIsProcessing(false);
      setPaymentStatus('failed');
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive"
      });
      onPaymentFailure(error.message);
    }
  };

  const handleRetry = () => {
    setPaymentStatus('idle');
    setCurrentStep('selection');
    setSelectedUpiApp('');
    setCustomUpiId('');
    setQrCode('');
  };

  const handleBack = () => {
    if (currentStep === 'qr') {
      setCurrentStep('selection');
      setSelectedUpiApp('');
      setCustomUpiId('');
      setQrCode('');
    }
  };

  const simulatePaymentSuccess = () => {
    // Simulate successful payment for demo
    setPaymentStatus('success');
    toast({
      title: "Payment Successful!",
      description: `Payment of ₹${orderDetails.totalAmount || orderDetails.total_amount} completed successfully.`,
      className: "bg-green-50 border-green-200"
    });
    
    // Simulate transaction data
    const mockTransaction = {
      id: `txn_${Date.now()}`,
      amount: orderDetails.totalAmount || orderDetails.total_amount,
      status: 'success',
      payment_method: selectedUpiApp || 'custom_upi',
      upi_id: customUpiId || 'test@upi',
      timestamp: new Date().toISOString()
    };
    
    onPaymentSuccess(mockTransaction);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {currentStep === 'qr' && (
              <Button variant="ghost" size="sm" onClick={handleBack} className="p-1 h-6 w-6">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <CreditCard className="h-5 w-5" />
            <span>
              {currentStep === 'selection' ? 'Choose Payment Method' : 
               currentStep === 'qr' ? 'Scan QR Code' : 'Processing Payment'}
            </span>
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'selection' ? 'Select your preferred UPI app or enter UPI ID' :
             currentStep === 'qr' ? 'Scan the QR code with your UPI app' :
             'Please wait while we process your payment'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary - Show on all steps */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {orderDetails.items ? (
                // Bulk order from cart
                <>
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span>{item.product_name} ({item.quantity} {item.unit})</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="ml-4">via {item.delivery_partner}</span>
                        <span>+₹{item.delivery_fee}</span>
                      </div>
                    </div>
                  ))}
                  <hr />
                  <div className="flex justify-between">
                    <span>Total Delivery Fees</span>
                    <span>₹{orderDetails.delivery_fees || 0}</span>
                  </div>
                </>
              ) : (
                // Single item order
                <>
                  <div className="flex justify-between">
                    <span>{orderDetails.productName}</span>
                    <span>₹{orderDetails.productPrice}</span>
                  </div>
                  {orderDetails.deliveryFee && orderDetails.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <Truck className="h-4 w-4 mr-1" />
                        Delivery Fee
                      </span>
                      <span>₹{orderDetails.deliveryFee}</span>
                    </div>
                  )}
                </>
              )}
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-green-600">₹{orderDetails.totalAmount || orderDetails.total_amount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: UPI App Selection */}
          {currentStep === 'selection' && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Choose UPI App
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {upiApps.map((app) => (
                      <Button
                        key={app.id}
                        variant="outline"
                        className={`h-16 flex flex-col gap-1 ${selectedUpiApp === app.id ? 'ring-2 ring-green-500' : ''}`}
                        onClick={() => handleUpiAppSelect(app.id)}
                      >
                        <div className={`w-6 h-6 rounded ${app.color}`}></div>
                        <span className="text-xs">{app.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-sm text-gray-500">OR</span>
                <Separator className="flex-1" />
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Enter UPI ID</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="upi-id">UPI ID</Label>
                    <Input
                      id="upi-id"
                      placeholder="yourname@paytm"
                      value={customUpiId}
                      onChange={(e) => setCustomUpiId(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleCustomUpiSubmit}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!customUpiId.trim()}
                  >
                    Generate QR Code
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Step 2: QR Code Display */}
          {currentStep === 'qr' && qrCode && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Scan QR Code
                </CardTitle>
                <CardDescription>
                  Scan this QR code with your UPI app to complete the payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <img 
                    src={qrCode} 
                    alt="UPI QR Code" 
                    className="w-48 h-48 border rounded-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">UPI Payment String:</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={paymentUrl} 
                      readOnly 
                      className="text-xs"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={copyUpiString}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Instructions:</strong>
                    <br />• Open your UPI app and scan the QR code
                    <br />• Or copy the payment string and paste in your UPI app
                    <br />• Confirm the payment of ₹{orderDetails.totalAmount || orderDetails.total_amount}
                  </p>
                </div>

                <Button 
                  onClick={simulatePaymentSuccess}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  I have completed the payment
                </Button>
              </CardContent>
            </Card>
          )}


          {/* Payment Status */}
          {paymentStatus === 'processing' && (
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span>Processing payment...</span>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <span className="text-green-800">Payment successful!</span>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <span className="text-red-800">Payment failed. Please retry.</span>
            </div>
          )}

          {/* Action Buttons - only show cancel/back on selection and QR steps */}
          {(currentStep === 'selection' || currentStep === 'qr') && paymentStatus !== 'success' && (
            <div className="space-y-2">
              {paymentStatus === 'failed' && (
                <Button 
                  onClick={handleRetry}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Retry Payment
                </Button>
              )}

              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full"
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Security Notice */}
          <div className="text-xs text-gray-500 text-center">
            🔒 Your payment is secured with 256-bit SSL encryption
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;