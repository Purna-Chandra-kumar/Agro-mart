
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, TrendingUp, TrendingDown, Minus } from "lucide-react";

const MarketPrices = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const marketData = [
    {
      id: 1,
      name: "Tomatoes",
      currentPrice: "₹40/kg",
      previousPrice: "₹35/kg",
      change: "+14.3%",
      trend: "up",
      category: "Vegetables",
      season: "Peak Season",
      demandLevel: "High"
    },
    {
      id: 2,
      name: "Onions",
      currentPrice: "₹30/kg",
      previousPrice: "₹32/kg",
      change: "-6.2%",
      trend: "down",
      category: "Vegetables",
      season: "Off Season",
      demandLevel: "Medium"
    },
    {
      id: 3,
      name: "Potatoes",
      currentPrice: "₹25/kg",
      previousPrice: "₹25/kg",
      change: "0%",
      trend: "stable",
      category: "Vegetables",
      season: "Available",
      demandLevel: "High"
    },
    {
      id: 4,
      name: "Mangoes",
      currentPrice: "₹120/kg",
      previousPrice: "₹100/kg",
      change: "+20%",
      trend: "up",
      category: "Fruits",
      season: "Peak Season",
      demandLevel: "Very High"
    },
    {
      id: 5,
      name: "Bananas",
      currentPrice: "₹60/dozen",
      previousPrice: "₹55/dozen",
      change: "+9.1%",
      trend: "up",
      category: "Fruits",
      season: "Available",
      demandLevel: "High"
    },
    {
      id: 6,
      name: "Carrots",
      currentPrice: "₹50/kg",
      previousPrice: "₹48/kg",
      change: "+4.2%",
      trend: "up",
      category: "Vegetables",
      season: "Available",
      demandLevel: "Medium"
    },
    {
      id: 7,
      name: "Spinach",
      currentPrice: "₹30/bunch",
      previousPrice: "₹35/bunch",
      change: "-14.3%",
      trend: "down",
      category: "Vegetables",
      season: "Peak Season",
      demandLevel: "Medium"
    },
    {
      id: 8,
      name: "Apples",
      currentPrice: "₹150/kg",
      previousPrice: "₹140/kg",
      change: "+7.1%",
      trend: "up",
      category: "Fruits",
      season: "Off Season",
      demandLevel: "High"
    },
    {
      id: 9,
      name: "Oranges",
      currentPrice: "₹80/kg",
      previousPrice: "₹85/kg",
      change: "-5.9%",
      trend: "down",
      category: "Fruits",
      season: "Available",
      demandLevel: "Medium"
    },
    {
      id: 10,
      name: "Cauliflower",
      currentPrice: "₹35/piece",
      previousPrice: "₹30/piece",
      change: "+16.7%",
      trend: "up",
      category: "Vegetables",
      season: "Peak Season",
      demandLevel: "High"
    }
  ];

  const filteredData = marketData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand.toLowerCase()) {
      case 'very high':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeasonColor = (season: string) => {
    switch (season.toLowerCase()) {
      case 'peak season':
        return 'bg-green-100 text-green-800';
      case 'off season':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <h1 className="text-xl font-bold text-gray-800">Market Prices</h1>
            <div className="w-32"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title and Search */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Daily Market Prices</h2>
          <p className="text-gray-600 mb-6">Real-time pricing information for vegetables and fruits</p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for vegetables, fruits..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Market Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marketData.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Price Increases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marketData.filter(item => item.trend === 'up').length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Price Decreases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marketData.filter(item => item.trend === 'down').length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Stable Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marketData.filter(item => item.trend === 'stable').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Table */}
        <Card>
          <CardHeader>
            <CardTitle>Current Market Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Item</th>
                    <th className="text-left py-3 px-2">Category</th>
                    <th className="text-right py-3 px-2">Current Price</th>
                    <th className="text-right py-3 px-2">Previous Price</th>
                    <th className="text-right py-3 px-2">Change</th>
                    <th className="text-left py-3 px-2">Season</th>
                    <th className="text-left py-3 px-2">Demand</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-2">
                        <div className="font-medium">{item.name}</div>
                      </td>
                      <td className="py-4 px-2">
                        <Badge variant="outline">{item.category}</Badge>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <span className="font-bold text-green-600">{item.currentPrice}</span>
                      </td>
                      <td className="py-4 px-2 text-right text-gray-500">
                        {item.previousPrice}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className={`flex items-center justify-end space-x-1 ${getTrendColor(item.trend)}`}>
                          {getTrendIcon(item.trend)}
                          <span className="font-medium">{item.change}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <Badge className={getSeasonColor(item.season)}>
                          {item.season}
                        </Badge>
                      </td>
                      <td className="py-4 px-2">
                        <Badge className={getDemandColor(item.demandLevel)}>
                          {item.demandLevel}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No items found matching your search</div>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          </div>
        )}

        {/* Market Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">Market Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm">Mango prices are rising due to peak season demand</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm">Onion prices dropping after good harvest</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm">Tomato demand high due to festival season</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700">Best Deals Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Spinach</span>
                <span className="text-green-600 font-bold">₹30/bunch</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Potatoes</span>
                <span className="text-green-600 font-bold">₹25/kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Oranges</span>
                <span className="text-green-600 font-bold">₹80/kg</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;
