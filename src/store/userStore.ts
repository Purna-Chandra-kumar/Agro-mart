
interface User {
  id: string;
  email: string;
  name: string;
  type: 'buyer' | 'farmer' | 'delivery';
  verified: boolean;
  phone?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface Product {
  id: string;
  farmerId: string;
  type: 'vegetable' | 'fruit';
  category: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
  description: string;
  image?: string;
  createdAt: Date;
}

interface Farm {
  id: string;
  farmerId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  products: Product[];
}

interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  location: {
    lat: number;
    lng: number;
  };
  rating: number;
  pricePerKm: number;
  available: boolean;
}

class UserStore {
  private users: User[] = [
    {
      id: '1',
      email: 'buyer@test.com',
      name: 'Test Buyer',
      type: 'buyer',
      verified: true,
      phone: '+91 9876543210'
    },
    {
      id: '2', 
      email: 'farmer@test.com',
      name: 'Test Farmer',
      type: 'farmer',
      verified: true,
      phone: '+91 9876543211',
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'New Delhi, India'
      }
    }
  ];

  private farms: Farm[] = [
    {
      id: '1',
      farmerId: '2',
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'New Delhi, India'
      },
      products: [
        {
          id: '1',
          farmerId: '2',
          type: 'vegetable',
          category: 'Leafy Greens',
          name: 'Spinach',
          quantity: 50,
          price: 30,
          unit: 'kg',
          description: 'Fresh organic spinach',
          createdAt: new Date()
        },
        {
          id: '2',
          farmerId: '2',
          type: 'fruit',
          category: 'Fruits',
          name: 'Mango',
          quantity: 100,
          price: 80,
          unit: 'kg',
          description: 'Sweet Alphonso mangoes',
          createdAt: new Date()
        }
      ]
    }
  ];

  private deliveryPartners: DeliveryPartner[] = [
    {
      id: '1',
      name: 'Quick Delivery',
      phone: '+91 9876543212',
      location: { lat: 28.6139, lng: 77.2090 },
      rating: 4.5,
      pricePerKm: 5,
      available: true
    },
    {
      id: '2',
      name: 'Fast Transport',
      phone: '+91 9876543213',
      location: { lat: 28.6100, lng: 77.2000 },
      rating: 4.8,
      pricePerKm: 4,
      available: true
    }
  ];

  private currentUser: User | null = null;

  login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const user = this.users.find(u => u.email === email && u.verified);
    
    if (!user) {
      const unverifiedUser = this.users.find(u => u.email === email);
      if (unverifiedUser) {
        return { success: false, message: 'Please verify your email first.' };
      }
      return { success: false, message: 'Account does not exist. Please sign up first.' };
    }

    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, message: 'Login successful', user };
  }

  signup(userData: Partial<User>): { success: boolean; message: string } {
    if (this.users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already exists' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      name: userData.name!,
      type: userData.type!,
      verified: false,
      phone: userData.phone
    };

    this.users.push(newUser);
    return { success: true, message: 'Signup successful. Please verify your email.' };
  }

  verifyEmail(email: string): boolean {
    const user = this.users.find(u => u.email === email);
    if (user) {
      user.verified = true;
      return true;
    }
    return false;
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getFarms(): Farm[] {
    return this.farms;
  }

  getFarmByFarmerId(farmerId: string): Farm | undefined {
    return this.farms.find(f => f.farmerId === farmerId);
  }

  addFarm(farm: Omit<Farm, 'id'>): string {
    const newFarm: Farm = {
      ...farm,
      id: Date.now().toString()
    };
    this.farms.push(newFarm);
    return newFarm.id;
  }

  addProductToFarm(farmId: string, product: Omit<Product, 'id'>): string {
    const farm = this.farms.find(f => f.id === farmId);
    if (farm) {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString()
      };
      farm.products.push(newProduct);
      return newProduct.id;
    }
    throw new Error('Farm not found');
  }

  getDeliveryPartners(): DeliveryPartner[] {
    return this.deliveryPartners.filter(dp => dp.available);
  }

  updateUserLocation(userId: string, location: User['location']) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.location = location;
      if (this.currentUser?.id === userId) {
        this.currentUser.location = location;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }
    }
  }
}

export const userStore = new UserStore();
export type { User, Product, Farm, DeliveryPartner };
