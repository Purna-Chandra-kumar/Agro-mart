
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userStore, User as UserType } from "@/store/userStore";

interface FarmerProfileFormProps {
  user: UserType;
  onProfileComplete: () => void;
}

const FarmerProfileForm = ({ user, onProfileComplete }: FarmerProfileFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    farmerName: user.name || '',
    phoneNumber: user.phone || '',
    email: user.email || '',
    whatsappNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.farmerName.trim() || !formData.phoneNumber.trim()) {
      toast({
        title: "Please fill required fields",
        description: "Farmer name and phone number are required",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Update user profile with farmer details
      userStore.updateUserProfile(user.id, {
        name: formData.farmerName,
        phone: formData.phoneNumber,
        email: formData.email || user.email,
        whatsappNumber: formData.whatsappNumber,
        profileCompleted: true
      });

      toast({
        title: "Profile updated successfully!",
        description: "You can now manage your farm and products",
        className: "bg-green-50 border-green-200"
      });

      onProfileComplete();
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Complete Your Farmer Profile</span>
          </CardTitle>
          <CardDescription>
            Please provide your details to set up your farmer account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="farmerName" className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Farmer Name *</span>
              </Label>
              <Input
                id="farmerName"
                value={formData.farmerName}
                onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Phone Number *</span>
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>Email (Optional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappNumber" className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Number (Optional)</span>
              </Label>
              <Input
                id="whatsappNumber"
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="Enter your WhatsApp number"
              />
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Updating Profile...' : 'Complete Profile & Continue'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerProfileForm;
