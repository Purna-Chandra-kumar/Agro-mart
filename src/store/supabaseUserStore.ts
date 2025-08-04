import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  phone: string | null;
  user_type: 'buyer' | 'farmer';
  verified: boolean;
  aadhar_number: string | null;
  date_of_birth: string | null;
  whatsapp_number: string | null;
  profile_completed: boolean;
  location: any;
  created_at: string;
  updated_at: string;
}

export interface UserWithEmail extends Profile {
  email: string;
}

class SupabaseUserStore {
  private currentUser: User | null = null;
  private currentSession: Session | null = null;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    this.currentSession = session;
    this.currentUser = session?.user ?? null;

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      this.currentSession = session;
      this.currentUser = session?.user ?? null;
    });
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getAllUsersWithEmails(): Promise<UserWithEmail[]> {
    try {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get all users from auth to get emails
      const { data, error: authError } = await supabase.auth.admin.listUsers();
      const authUsers = data;
      
      if (authError) {
        console.warn('Could not fetch auth users (admin access required):', authError);
        // Return profiles without emails if admin access is not available
        return profiles?.map(profile => ({
          ...profile,
          user_type: profile.user_type as 'buyer' | 'farmer',
          email: 'Email not available'
        })) || [];
      }

      // Combine profiles with email data
      const usersWithEmails: UserWithEmail[] = profiles?.map(profile => {
        const authUser = authUsers?.users?.find((user: any) => user.id === profile.user_id);
        return {
          ...profile,
          user_type: profile.user_type as 'buyer' | 'farmer',
          email: authUser?.email || 'Email not available'
        };
      }) || [];

      return usersWithEmails;
    } catch (error) {
      console.error('Error fetching users with emails:', error);
      throw error;
    }
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return {
      ...data,
      user_type: data.user_type as 'buyer' | 'farmer'
    };
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }

    return true;
  }

  async getFarms() {
    const { data, error } = await supabase
      .from('farms')
      .select(`
        *,
        products (*)
      `);

    if (error) throw error;
    return data || [];
  }

  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  async getDeliveryPartners() {
    const { data, error } = await supabase
      .from('delivery_partners')
      .select('*')
      .eq('available', true);

    if (error) throw error;
    return data || [];
  }
}

export const supabaseUserStore = new SupabaseUserStore();