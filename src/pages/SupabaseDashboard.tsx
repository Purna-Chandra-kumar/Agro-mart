import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Bell, ShoppingCart, User, LogOut, Users, Settings } from "lucide-react";
import { supabaseUserStore, Profile } from "@/store/supabaseUserStore";
import { languageStore } from "@/store/languageStore";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import LanguageSelector from "@/components/LanguageSelector";
import BuyerDashboard from "@/components/BuyerDashboard";
import FarmerDashboard from "@/components/FarmerDashboard";
import UserManagement from "@/components/UserManagement";

const SupabaseDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Fetch user profile
            const userProfile = await supabaseUserStore.getProfile(session.user.id);
            setProfile(userProfile);
          } else {
            setProfile(null);
            navigate('/auth');
          }
        }
      );

      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userProfile = await supabaseUserStore.getProfile(session.user.id);
        setProfile(userProfile);
      } else {
        navigate('/auth');
      }

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Auth initialization error:', error);
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabaseUserStore.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to access this page.</p>
          <Button onClick={() => navigate('/auth')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  // Convert Supabase user to legacy User format for existing components
  const legacyUser = {
    id: user.id,
    email: user.email || '',
    name: profile.name || '',
    type: profile.user_type,
    verified: profile.verified,
    phone: profile.phone || '',
    aadharNumber: profile.aadhar_number || '',
    dateOfBirth: profile.date_of_birth || '',
    whatsappNumber: profile.whatsapp_number || '',
    profileCompleted: profile.profile_completed,
    location: profile.location
  };

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
              {profile.user_type === 'buyer' && (
                <Button variant="ghost" size="sm">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              )}
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
            Welcome, {profile.name || user.email}!
          </h1>
          <p className="text-gray-600">
            {profile.user_type === 'buyer' 
              ? 'Discover fresh vegetables and fruits directly from farmers'
              : 'Manage your farm and products'
            }
          </p>
        </div>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {/* Dashboard Content */}
            {profile.user_type === 'buyer' ? (
              <BuyerDashboard user={legacyUser} />
            ) : (
              <FarmerDashboard user={legacyUser} />
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Account Settings</h3>
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Profile Information</h4>
                  <p className="text-sm text-gray-600">Name: {profile.name || 'Not provided'}</p>
                  <p className="text-sm text-gray-600">Email: {user.email}</p>
                  <p className="text-sm text-gray-600">Phone: {profile.phone || 'Not provided'}</p>
                  <p className="text-sm text-gray-600">Account Type: {profile.user_type}</p>
                  <p className="text-sm text-gray-600">Status: {profile.verified ? 'Verified' : 'Unverified'}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupabaseDashboard;