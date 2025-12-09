import { Stock } from "../models/stock.model.js";

/**
 * GET /api/stocks
 * Public - view all stocks
 */
export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, stocks });
  } catch (error) {
    console.error("getAllStocks error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * POST /api/stocks
 * Protected - only authenticated (admin) can add
 * Body: { stockName, price, logo? }
 */
export const addNewStock = async (req, res) => {
  try {
    const { stockName, price, logo = "" } = req.body;

    if (!stockName || price === undefined) {
      return res.status(400).json({ success: false, message: "stockName and price are required" });
    }

    const exists = await Stock.findOne({ stockName: String(stockName).trim() });
    if (exists) {
      return res.status(409).json({ success: false, message: "Stock with this name already exists" });
    }

    const newStock = await Stock.create({
      stockName: String(stockName).trim(),
      price: Number(price),
      logo: String(logo)
    });

    return res.status(201).json({ success: true, message: "Stock added", stock: newStock });
  } catch (error) {
    console.error("addNewStock error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * PUT /api/stocks/:id
 * Protected - update stock (authenticated/admin)
 */
export const updateOldStock = async (req, res) => {
  try {
    const stockId = req.params.id;
    const updates = {};

    if (req.body.stockName !== undefined) updates.stockName = String(req.body.stockName).trim();
    if (req.body.price !== undefined) updates.price = Number(req.body.price);
    if (req.body.logo !== undefined) updates.logo = String(req.body.logo);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No fields provided to update" });
    }

    if (updates.stockName) {
      const duplicate = await Stock.findOne({ stockName: updates.stockName, _id: { $ne: stockId } });
      if (duplicate) {
        return res.status(409).json({ success: false, message: "Another stock with this name exists" });
      }
    }

    const updated = await Stock.findByIdAndUpdate(stockId, updates, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Stock not found" });
    }

    return res.status(200).json({ success: true, message: "Stock updated", stock: updated });
  } catch (error) {
    console.error("updateOldStock error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * DELETE /api/stocks/:id
 * Protected - delete stock (authenticated/admin)
 */
export const deleteStock = async (req, res) => {
  try {
    const stockId = req.params.id;
    const deleted = await Stock.findByIdAndDelete(stockId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Stock not found" });
    }
    return res.status(200).json({ success: true, message: "Stock deleted", stock: deleted });
  } catch (error) {
    console.error("deleteStock error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
