import { Stock } from "@/lib/api";
import { TrendingUp, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminStockCardProps {
  stock: Stock;
  index: number;
  onEdit: (stock: Stock) => void;
  onDelete: (stock: Stock) => void;
}

const AdminStockCard = ({ stock, index, onEdit, onDelete }: AdminStockCardProps) => {
  return (
    <div
      className="group card-gradient rounded-xl border border-border/50 p-4 sm:p-5 shadow-card hover:border-primary/30 transition-all duration-300 animate-fade-in"
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

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onEdit(stock)}
            className="hover:bg-primary/20 hover:text-primary transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onDelete(stock)}
            className="hover:bg-destructive/20 hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminStockCard;
