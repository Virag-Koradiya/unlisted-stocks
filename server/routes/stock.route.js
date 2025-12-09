import express from "express";
import { getAllStocks, addNewStock, updateOldStock, deleteStock } from "../controllers/stock.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Public
router.get("/", getAllStocks);

// Protected - only authenticated (admin) users can add/update/delete
router.post("/", isAuthenticated, addNewStock);
router.put("/:id", isAuthenticated, updateOldStock);
router.delete("/:id", isAuthenticated, deleteStock);

export default router;