import { Stock } from "@/lib/api";
import { MessageCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StockCardProps {
  stock: Stock;
  index: number;
}

const StockCard = ({ stock, index }: StockCardProps) => {
  const handleBuy = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in buying ${stock.stockName} stock at ₹${stock.price}. Please provide more details.`
    );
    // Replace with your WhatsApp number
    window.open(`https://wa.me/6355327531?text=${message}`, "_blank");
  };

  return (
    <div
      className="group card-gradient rounded-xl border border-border/50 p-4 sm:p-5 shadow-card hover:border-primary/30 hover:shadow-glow transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="relative flex-shrink-0">
          {stock.logo ? (
            <img
              src={stock.logo}
              alt={stock.stockName}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg object-cover bg-secondary"
            />
          ) : (
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg bg-secondary">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-primary animate-pulse" />
        </div>

        {/* Stock Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate text-base sm:text-lg">
            {stock.stockName}
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-primary">
            ₹{stock.price.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Buy Button */}
        <Button
          onClick={handleBuy}
          className="gap-2 green-glow hover:scale-105 transition-transform flex-shrink-0"
          size="lg"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">BUY</span>
        </Button>
      </div>
    </div>
  );
};

export default StockCard;
