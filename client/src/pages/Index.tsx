import { useEffect, useState } from "react";
import { getAllStocks, Stock } from "@/lib/api";
import Header from "@/components/Header";
import StockCard from "@/components/StockCard";
import { TrendingUp, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const data = await getAllStocks();
      setStocks(data);
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const filteredStocks = stocks.filter((stock) =>
    stock.stockName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen hero-gradient">
      <Header />

      <main className="container py-6 sm:py-10">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-4">
            <TrendingUp className="h-4 w-4" />
            Live Stock Prices
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            Invest in Your Future
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Browse our curated selection of stocks. Click BUY to connect with us on WhatsApp for personalized investment guidance.
          </p>
        </div>

        {/* Search & Refresh */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search stocks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="secondary"
            onClick={fetchStocks}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stocks Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-card animate-pulse"
              />
            ))}
          </div>
        ) : filteredStocks.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStocks.map((stock, index) => (
              <StockCard key={stock._id} stock={stock} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Stocks Found</h3>
            <p className="text-muted-foreground">
              {search
                ? "Try adjusting your search query"
                : "No stocks available at the moment"}
            </p>
          </div>
        )}

        {/* Stats */}
        {stocks.length > 0 && (
          <div className="mt-8 sm:mt-12 flex justify-center gap-8 text-center">
            <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <p className="text-3xl sm:text-4xl font-bold text-primary">{stocks.length}</p>
              <p className="text-sm text-muted-foreground">Active Stocks</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <p className="text-3xl sm:text-4xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Support</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
              <p className="text-3xl sm:text-4xl font-bold text-primary">100%</p>
              <p className="text-sm text-muted-foreground">Secure</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 StockHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
