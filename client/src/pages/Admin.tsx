import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStocks, addStock, updateStock, deleteStock, Stock } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import AdminStockCard from "@/components/AdminStockCard";
import StockModal from "@/components/StockModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { Plus, Search, RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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
    if (isAuthenticated) {
      fetchStocks();
    }
  }, [isAuthenticated]);

  const handleAddClick = () => {
    setSelectedStock(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: { stockName: string; price: number; logo: string }) => {
    setActionLoading(true);
    try {
      if (selectedStock) {
        const result = await updateStock(selectedStock._id, data);
        if (result.success) {
          toast({ title: "Success", description: "Stock updated successfully" });
          fetchStocks();
          setIsModalOpen(false);
        } else {
          toast({ title: "Error", description: result.message, variant: "destructive" });
        }
      } else {
        const result = await addStock(data);
        if (result.success) {
          toast({ title: "Success", description: "Stock added successfully" });
          fetchStocks();
          setIsModalOpen(false);
        } else {
          toast({ title: "Error", description: result.message, variant: "destructive" });
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Operation failed", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedStock) return;
    setActionLoading(true);
    try {
      const result = await deleteStock(selectedStock._id);
      if (result.success) {
        toast({ title: "Success", description: "Stock deleted successfully" });
        fetchStocks();
        setIsDeleteModalOpen(false);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.stockName.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen hero-gradient">
      <Header />

      <main className="container py-6 sm:py-10">
        {/* Title */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Stock Management</h1>
          <p className="text-muted-foreground">
            Add, edit, or remove stocks from your portfolio
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
              <div key={i} className="h-24 rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        ) : filteredStocks.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStocks.map((stock, index) => (
              <AdminStockCard
                key={stock._id}
                stock={stock}
                index={index}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Stocks Found</h3>
            <p className="text-muted-foreground mb-4">
              {search ? "Try adjusting your search" : "Add your first stock to get started"}
            </p>
            {!search && (
              <Button onClick={handleAddClick} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Stock
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <Button
        onClick={handleAddClick}
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg green-glow hover:scale-110 transition-transform"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Modals */}
      <StockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        stock={selectedStock}
        isLoading={actionLoading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        stock={selectedStock}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default Admin;
