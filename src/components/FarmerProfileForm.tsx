import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabaseUserStore, Profile } from "@/store/supabaseUserStore";
import { languageStore } from "@/store/languageStore";

interface FarmerProfileFormProps {
  user: Profile;
  onProfileComplete: () => void;
}

const FarmerProfileForm = ({ user, onProfileComplete }: FarmerProfileFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    whatsappNumber: user.whatsapp_number || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const t = (key: string) => languageStore.translate(key);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await supabaseUserStore.updateProfile(user.user_id, {
        name: formData.name,
        phone: formData.phone,
        whatsapp_number: formData.whatsappNumber,
        profile_completed: true
      });

      if (success) {
        toast({
          title: "Profile updated successfully!",
          description: "Welcome to your farmer dashboard!",
          className: "bg-green-50 border-green-200"
        });
        onProfileComplete();
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('profile.complete')}</CardTitle>
          <CardDescription>
            {t('profile.before_continue')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.farmer_name')} *</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('auth.enter_farmer_name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('common.phone')} *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t('auth.enter_phone')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">{t('profile.whatsapp')}</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder={t('profile.enter_whatsapp')}
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.processing') : t('common.save')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerProfileForm;