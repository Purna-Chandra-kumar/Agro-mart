# Agro Mart

A farmer-to-buyer marketplace connecting local farmers directly with consumers.

## About

This project started when I couldn't find decent fresh vegetables without paying ridiculous prices at those fancy organic stores. Then I met a farmer who was selling amazing produce for a fraction of the price but couldn't reach customers directly. So I built this to solve that problem.

## What it does

**For Farmers:**
- Create profiles with farm photos
- List products with real-time pricing
- Manage inventory
- Connect directly with buyers
- Get fair prices without middlemen

**For Buyers:**
- Find local farms and fresh produce
- See what's actually in season
- Compare prices easily
- Order directly from farmers
- Know exactly where food comes from

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Supabase for backend (auth, database, storage)
- React Router for navigation
- Vite for development
- React Query for state management

## Getting Started

```bash
npm install
npm run dev
```

The app will start on `localhost:5173`

## Features

- Dual authentication (email + Aadhaar for farmers)
- Real-time product listings
- Location-based farmer discovery
- Direct messaging between farmers and buyers
- Order management system
- Delivery partner integration

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── store/         # State management
├── utils/         # Helper functions
└── data/          # Static data and types
```

## Contributing

Found a bug or want to add a feature? 

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Keep it simple and focused.

## License

MIT - feel free to use this however you want.

---

*Built to help small farms thrive* 🌱
