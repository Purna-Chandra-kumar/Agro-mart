# Agro Mart

A direct farmer-to-buyer marketplace platform built with React and Supabase.

## Overview

Agro Mart connects local farmers directly with consumers, eliminating middlemen and ensuring fresh produce at fair prices. The platform supports both email-based authentication for buyers and dual authentication (email/Aadhaar) for farmers.

## Features

### For Farmers
- Create detailed farm profiles with photos
- List products with real-time pricing
- Inventory management
- Direct communication with buyers
- Aadhaar-based authentication option

### For Buyers  
- Browse local farms and fresh produce
- Seasonal availability tracking
- Price comparison tools
- Direct ordering from farmers
- Traceability of produce source

### Platform Features
- Responsive design for all devices
- Real-time notifications
- Location-based farmer discovery
- Order management system
- Delivery partner integration
- Multi-language support

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **Routing**: React Router v6
- **State Management**: Zustand, React Query
- **UI Components**: Radix UI, Shadcn/ui
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd agro-mart

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   └── ui/             # Base UI components
├── pages/              # Route components  
├── hooks/              # Custom React hooks
├── store/              # State management
├── utils/              # Helper functions
├── data/               # Static data and types
└── integrations/       # External service integrations
```

## Development

### Code Style
- TypeScript strict mode enabled
- ESLint and Prettier for code formatting
- Conventional commit messages
- Component-based architecture

### Testing
```bash
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
```

### Build
```bash
npm run build       # Production build
npm run preview     # Preview production build
```

## Database Schema

The application uses Supabase with the following main tables:
- `profiles` - User profile information
- `farms` - Farm details and information  
- `products` - Product listings
- `orders` - Order management
- `delivery_partners` - Delivery service providers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built to support local farming communities
- Inspired by the need for fair trade practices
- Thanks to all farmers and buyers using the platform