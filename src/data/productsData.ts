// Static product data for demonstration
export interface ProductData {
  id: string;
  name: string;
  category: string;
  type: string;
  price: number;
  unit: string;
  description: string;
  image: string;
  farmerName: string;
  farmerPhone: string;
  quantity: number;
}

export const staticProducts: ProductData[] = [
  // Leafy Greens
  {
    id: '1',
    name: 'Fresh Spinach',
    category: 'Leafy Greens',
    type: 'vegetable',
    price: 40,
    unit: 'kg',
    description: 'Fresh organic spinach, rich in iron and vitamins',
    image: '/api/placeholder/300/200',
    farmerName: 'Ramesh Kumar',
    farmerPhone: '+91 9876543210',
    quantity: 50
  },
  {
    id: '2',
    name: 'Kale',
    category: 'Leafy Greens',
    type: 'vegetable',
    price: 60,
    unit: 'kg',
    description: 'Nutrient-dense kale, perfect for salads and smoothies',
    image: '/api/placeholder/300/200',
    farmerName: 'Priya Sharma',
    farmerPhone: '+91 9876543211',
    quantity: 30
  },
  {
    id: '3',
    name: 'Lettuce',
    category: 'Leafy Greens',
    type: 'vegetable',
    price: 35,
    unit: 'kg',
    description: 'Crisp and fresh lettuce leaves',
    image: '/api/placeholder/300/200',
    farmerName: 'Suresh Patel',
    farmerPhone: '+91 9876543212',
    quantity: 40
  },
  {
    id: '4',
    name: 'Cabbage',
    category: 'Leafy Greens',
    type: 'vegetable',
    price: 25,
    unit: 'kg',
    description: 'Fresh green cabbage, great for cooking and salads',
    image: '/api/placeholder/300/200',
    farmerName: 'Lakshmi Devi',
    farmerPhone: '+91 9876543213',
    quantity: 60
  },
  {
    id: '5',
    name: 'Collard Greens',
    category: 'Leafy Greens',
    type: 'vegetable',
    price: 45,
    unit: 'kg',
    description: 'Nutritious collard greens, perfect for traditional dishes',
    image: '/api/placeholder/300/200',
    farmerName: 'Vijay Singh',
    farmerPhone: '+91 9876543214',
    quantity: 25
  },
  {
    id: '6',
    name: 'Watercress',
    category: 'Leafy Greens',
    type: 'vegetable',
    price: 80,
    unit: 'kg',
    description: 'Fresh watercress with a peppery flavor',
    image: '/api/placeholder/300/200',
    farmerName: 'Anita Rao',
    farmerPhone: '+91 9876543215',
    quantity: 15
  },

  // Root Vegetables
  {
    id: '7',
    name: 'Carrots',
    category: 'Root Vegetables',
    type: 'vegetable',
    price: 30,
    unit: 'kg',
    description: 'Sweet and crunchy carrots, rich in beta-carotene',
    image: '/api/placeholder/300/200',
    farmerName: 'Mohan Lal',
    farmerPhone: '+91 9876543216',
    quantity: 80
  },
  {
    id: '8',
    name: 'Potatoes',
    category: 'Root Vegetables',
    type: 'vegetable',
    price: 20,
    unit: 'kg',
    description: 'Fresh potatoes, perfect for all types of cooking',
    image: '/api/placeholder/300/200',
    farmerName: 'Rajesh Kumar',
    farmerPhone: '+91 9876543217',
    quantity: 100
  },
  {
    id: '9',
    name: 'Sweet Potatoes',
    category: 'Root Vegetables',
    type: 'vegetable',
    price: 35,
    unit: 'kg',
    description: 'Nutritious sweet potatoes with natural sweetness',
    image: '/api/placeholder/300/200',
    farmerName: 'Sunita Devi',
    farmerPhone: '+91 9876543218',
    quantity: 45
  },
  {
    id: '10',
    name: 'Radish',
    category: 'Root Vegetables',
    type: 'vegetable',
    price: 28,
    unit: 'kg',
    description: 'Fresh white radish, great for salads and cooking',
    image: '/api/placeholder/300/200',
    farmerName: 'Arvind Gupta',
    farmerPhone: '+91 9876543219',
    quantity: 35
  },
  {
    id: '11',
    name: 'Beetroot',
    category: 'Root Vegetables',
    type: 'vegetable',
    price: 40,
    unit: 'kg',
    description: 'Fresh beetroot, rich in antioxidants and minerals',
    image: '/api/placeholder/300/200',
    farmerName: 'Kavita Sharma',
    farmerPhone: '+91 9876543220',
    quantity: 30
  },
  {
    id: '12',
    name: 'Turnips',
    category: 'Root Vegetables',
    type: 'vegetable',
    price: 32,
    unit: 'kg',
    description: 'Fresh turnips with a mild, peppery flavor',
    image: '/api/placeholder/300/200',
    farmerName: 'Deepak Singh',
    farmerPhone: '+91 9876543221',
    quantity: 25
  },

  // Other Vegetables
  {
    id: '13',
    name: 'Broccoli',
    category: 'Other Vegetables',
    type: 'vegetable',
    price: 70,
    unit: 'kg',
    description: 'Fresh broccoli florets, packed with vitamins',
    image: '/api/placeholder/300/200',
    farmerName: 'Neeta Patel',
    farmerPhone: '+91 9876543222',
    quantity: 20
  },
  {
    id: '14',
    name: 'Cauliflower',
    category: 'Other Vegetables',
    type: 'vegetable',
    price: 45,
    unit: 'kg',
    description: 'Fresh white cauliflower, versatile vegetable',
    image: '/api/placeholder/300/200',
    farmerName: 'Harish Kumar',
    farmerPhone: '+91 9876543223',
    quantity: 35
  },

  // Fruits
  {
    id: '15',
    name: 'Apples',
    category: 'Fruits',
    type: 'fruit',
    price: 120,
    unit: 'kg',
    description: 'Fresh red apples, crisp and sweet',
    image: '/api/placeholder/300/200',
    farmerName: 'Sanjay Thakur',
    farmerPhone: '+91 9876543224',
    quantity: 50
  },
  {
    id: '16',
    name: 'Bananas',
    category: 'Fruits',
    type: 'fruit',
    price: 40,
    unit: 'dozen',
    description: 'Ripe yellow bananas, rich in potassium',
    image: '/api/placeholder/300/200',
    farmerName: 'Ravi Nair',
    farmerPhone: '+91 9876543225',
    quantity: 100
  },
  {
    id: '17',
    name: 'Grapes',
    category: 'Fruits',
    type: 'fruit',
    price: 80,
    unit: 'kg',
    description: 'Sweet green grapes, perfect for snacking',
    image: '/api/placeholder/300/200',
    farmerName: 'Meera Joshi',
    farmerPhone: '+91 9876543226',
    quantity: 40
  },
  {
    id: '18',
    name: 'Mangoes',
    category: 'Fruits',
    type: 'fruit',
    price: 150,
    unit: 'kg',
    description: 'Sweet and juicy mangoes, king of fruits',
    image: '/api/placeholder/300/200',
    farmerName: 'Ashok Kumar',
    farmerPhone: '+91 9876543227',
    quantity: 30
  },
  {
    id: '19',
    name: 'Papayas',
    category: 'Fruits',
    type: 'fruit',
    price: 60,
    unit: 'kg',
    description: 'Fresh papayas, rich in vitamins and enzymes',
    image: '/api/placeholder/300/200',
    farmerName: 'Usha Devi',
    farmerPhone: '+91 9876543228',
    quantity: 25
  },
  {
    id: '20',
    name: 'Oranges',
    category: 'Fruits',
    type: 'fruit',
    price: 70,
    unit: 'kg',
    description: 'Juicy oranges, packed with vitamin C',
    image: '/api/placeholder/300/200',
    farmerName: 'Ganesh Rao',
    farmerPhone: '+91 9876543229',
    quantity: 60
  },
  {
    id: '21',
    name: 'Lemons',
    category: 'Fruits',
    type: 'fruit',
    price: 50,
    unit: 'kg',
    description: 'Fresh lemons, perfect for cooking and drinks',
    image: '/api/placeholder/300/200',
    farmerName: 'Shanti Patel',
    farmerPhone: '+91 9876543230',
    quantity: 45
  },

  // Berries
  {
    id: '22',
    name: 'Strawberries',
    category: 'Berries',
    type: 'fruit',
    price: 200,
    unit: 'kg',
    description: 'Fresh strawberries, sweet and aromatic',
    image: '/api/placeholder/300/200',
    farmerName: 'Anjali Singh',
    farmerPhone: '+91 9876543231',
    quantity: 15
  },
  {
    id: '23',
    name: 'Blueberries',
    category: 'Berries',
    type: 'fruit',
    price: 300,
    unit: 'kg',
    description: 'Fresh blueberries, rich in antioxidants',
    image: '/api/placeholder/300/200',
    farmerName: 'Rajiv Gupta',
    farmerPhone: '+91 9876543232',
    quantity: 10
  }
];
