import { useState, useEffect } from "react";
import { Stock } from "@/lib/api";
import { X, Upload, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { stockName: string; price: number; logo: string }) => void;
  stock?: Stock | null;
  isLoading?: boolean;
}

const StockModal = ({ isOpen, onClose, onSubmit, stock, isLoading }: StockModalProps) => {
  const [stockName, setStockName] = useState("");
  const [price, setPrice] = useState("");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    if (stock) {
      setStockName(stock.stockName);
      setPrice(stock.price.toString());
      setLogo(stock.logo || "");
    } else {
      setStockName("");
      setPrice("");
      setLogo("");
    }
  }, [stock, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      stockName: stockName.trim(),
      price: parseFloat(price),
      logo: logo.trim(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md card-gradient rounded-2xl border border-border shadow-card animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 sm:p-6">
          <h2 className="text-xl font-bold">
            {stock ? "Edit Stock" : "Add New Stock"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {/* Logo Preview */}
          <div className="flex justify-center">
            {logo ? (
              <img
                src={logo}
                alt="Stock logo"
                className="h-20 w-20 rounded-xl object-cover bg-secondary"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-secondary">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="logo"
                type="url"
                placeholder="https://example.com/logo.png"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Stock Name */}
          <div className="space-y-2">
            <Label htmlFor="stockName">Stock Name *</Label>
            <Input
              id="stockName"
              type="text"
              placeholder="e.g., Reliance Industries"
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 2500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : stock ? "Update Stock" : "Add Stock"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StockModal;
