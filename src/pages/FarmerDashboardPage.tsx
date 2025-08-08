import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Bell, User, LogOut } from "lucide-react";
import { supabaseUserStore, Profile } from "@/store/supabaseUserStore";
import { languageStore } from "@/store/languageStore";
import LanguageSelector from "@/components/LanguageSelector";
import FarmerDashboard from "@/components/FarmerDashboard";

const FarmerDashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = supabaseUserStore.getCurrentUser();
      if (!currentUser) {
        navigate('/auth');
        return;
      }
      
      const profile = await supabaseUserStore.getProfile(currentUser.id);
      if (profile) {
        // Ensure user is a farmer
        if (profile.user_type !== 'farmer') {
          navigate('/buyer-dashboard');
          return;
        }
        setUser(profile);
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabaseUserStore.signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gradient">Agro Mart</span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {languageStore.translate('nav.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, Farmer {user.name}!
          </h1>
          <p className="text-gray-600">
            Manage your farm and products
          </p>
        </div>

        {/* Dashboard Content */}
        <FarmerDashboard user={user} />
      </div>
    </div>
  );
};

export default FarmerDashboardPage;