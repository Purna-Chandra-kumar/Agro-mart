interface User {
  id: string;
  email: string;
  name: string;
  type: 'buyer' | 'farmer' | 'delivery';
  verified: boolean;
  phone?: string;
  aadharNumber?: string;
  dateOfBirth?: string;
  whatsappNumber?: string;
  profileCompleted?: boolean;
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
  contactInfo?: string;
  additionalInfo?: string;
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
      phone: '+91 9876543210',
      profileCompleted: true
    },
    {
      id: '2', 
      email: 'farmer@test.com',
      name: 'Test Farmer',
      type: 'farmer',
      verified: true,
      phone: '+91 9876543211',
      aadharNumber: '123456789012',
      dateOfBirth: '1985-06-15',
      profileCompleted: true,
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
        // Leafy Greens
        {
          id: '1',
          farmerId: '2',
          type: 'vegetable',
          category: 'Leafy Greens',
          name: 'Spinach',
          quantity: 50,
          price: 30,
          unit: 'kg',
          description: 'Fresh organic spinach leaves',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '2',
          farmerId: '2',
          type: 'vegetable',
          category: 'Leafy Greens',
          name: 'Kale',
          quantity: 25,
          price: 45,
          unit: 'kg',
          description: 'Nutrient-rich kale leaves',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '3',
          farmerId: '2',
          type: 'vegetable',
          category: 'Leafy Greens',
          name: 'Lettuce',
          quantity: 30,
          price: 35,
          unit: 'kg',
          description: 'Fresh crispy lettuce',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '4',
          farmerId: '2',
          type: 'vegetable',
          category: 'Leafy Greens',
          name: 'Cabbage',
          quantity: 40,
          price: 25,
          unit: 'kg',
          description: 'Fresh green cabbage heads',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '5',
          farmerId: '2',
          type: 'vegetable',
          category: 'Leafy Greens',
          name: 'Collard Greens',
          quantity: 20,
          price: 40,
          unit: 'kg',
          description: 'Fresh collard green leaves',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '6',
          farmerId: '2',
          type: 'vegetable',
          category: 'Leafy Greens',
          name: 'Watercress',
          quantity: 15,
          price: 60,
          unit: 'kg',
          description: 'Fresh watercress with peppery flavor',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        // Root Vegetables
        {
          id: '7',
          farmerId: '2',
          type: 'vegetable',
          category: 'Root Vegetables',
          name: 'Carrots',
          quantity: 60,
          price: 40,
          unit: 'kg',
          description: 'Fresh orange carrots',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '8',
          farmerId: '2',
          type: 'vegetable',
          category: 'Root Vegetables',
          name: 'Potatoes',
          quantity: 100,
          price: 20,
          unit: 'kg',
          description: 'Fresh farm potatoes',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '9',
          farmerId: '2',
          type: 'vegetable',
          category: 'Root Vegetables',
          name: 'Sweet Potatoes',
          quantity: 45,
          price: 35,
          unit: 'kg',
          description: 'Sweet and nutritious sweet potatoes',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '10',
          farmerId: '2',
          type: 'vegetable',
          category: 'Root Vegetables',
          name: 'Radish',
          quantity: 25,
          price: 30,
          unit: 'kg',
          description: 'Fresh white radish',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '11',
          farmerId: '2',
          type: 'vegetable',
          category: 'Root Vegetables',
          name: 'Beetroot',
          quantity: 35,
          price: 45,
          unit: 'kg',
          description: 'Fresh red beetroot',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '12',
          farmerId: '2',
          type: 'vegetable',
          category: 'Root Vegetables',
          name: 'Turnips',
          quantity: 20,
          price: 35,
          unit: 'kg',
          description: 'Fresh white turnips',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        // Other Vegetables
        {
          id: '13',
          farmerId: '2',
          type: 'vegetable',
          category: 'Other Vegetables',
          name: 'Broccoli',
          quantity: 30,
          price: 60,
          unit: 'kg',
          description: 'Fresh green broccoli heads',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '14',
          farmerId: '2',
          type: 'vegetable',
          category: 'Other Vegetables',
          name: 'Cauliflower',
          quantity: 25,
          price: 50,
          unit: 'kg',
          description: 'Fresh white cauliflower heads',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        // Fruits
        {
          id: '15',
          farmerId: '2',
          type: 'fruit',
          category: 'Fruits',
          name: 'Apples',
          quantity: 80,
          price: 120,
          unit: 'kg',
          description: 'Fresh red apples',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '16',
          farmerId: '2',
          type: 'fruit',
          category: 'Fruits',
          name: 'Bananas',
          quantity: 60,
          price: 40,
          unit: 'kg',
          description: 'Ripe yellow bananas',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '17',
          farmerId: '2',
          type: 'fruit',
          category: 'Fruits',
          name: 'Grapes',
          quantity: 40,
          price: 80,
          unit: 'kg',
          description: 'Sweet green grapes',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '18',
          farmerId: '2',
          type: 'fruit',
          category: 'Fruits',
          name: 'Mangoes',
          quantity: 50,
          price: 100,
          unit: 'kg',
          description: 'Sweet Alphonso mangoes',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '19',
          farmerId: '2',
          type: 'fruit',
          category: 'Fruits',
          name: 'Papayas',
          quantity: 30,
          price: 50,
          unit: 'kg',
          description: 'Fresh ripe papayas',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '20',
          farmerId: '2',
          type: 'fruit',
          category: 'Fruits',
          name: 'Oranges',
          quantity: 70,
          price: 60,
          unit: 'kg',
          description: 'Juicy sweet oranges',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '21',
          farmerId: '2',
          type: 'fruit',
          category: 'Fruits',
          name: 'Lemons',
          quantity: 40,
          price: 80,
          unit: 'kg',
          description: 'Fresh tangy lemons',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        // Berries
        {
          id: '22',
          farmerId: '2',
          type: 'fruit',
          category: 'Berries',
          name: 'Strawberries',
          quantity: 20,
          price: 200,
          unit: 'kg',
          description: 'Fresh sweet strawberries',
          contactInfo: '+91 9876543211',
          createdAt: new Date()
        },
        {
          id: '23',
          farmerId: '2',
          type: 'fruit',
          category: 'Berries',
          name: 'Blueberries',
          quantity: 15,
          price: 300,
          unit: 'kg',
          description: 'Fresh antioxidant-rich blueberries',
          contactInfo: '+91 9876543211',
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

  loginWithAadhar(aadharNumber: string, dateOfBirth: string): { success: boolean; message: string; user?: User } {
    const user = this.users.find(u => u.aadharNumber === aadharNumber && u.dateOfBirth === dateOfBirth && u.verified);
    
    if (!user) {
      return { success: false, message: 'Invalid Aadhar number or date of birth. Please check your details or sign up first.' };
    }

    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, message: 'Login successful', user };
  }

  signup(userData: Partial<User>): { success: boolean; message: string } {
    if (this.users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already exists' };
    }

    if (userData.aadharNumber && this.users.find(u => u.aadharNumber === userData.aadharNumber)) {
      return { success: false, message: 'Aadhar number already registered' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      name: userData.name!,
      type: userData.type!,
      verified: false,
      phone: userData.phone,
      aadharNumber: userData.aadharNumber,
      dateOfBirth: userData.dateOfBirth,
      profileCompleted: userData.type === 'buyer' ? true : false
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

  updateUserProfile(userId: string, profileData: Partial<User>): boolean {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      Object.assign(user, profileData);
      if (this.currentUser?.id === userId) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }
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
