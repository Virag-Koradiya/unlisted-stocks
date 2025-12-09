const API_BASE = "https://unlisted-stocks.onrender.com/api";

export interface Stock {
  _id: string;
  stockName: string;
  price: number;
  logo: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  stocks?: T[];
  stock?: T;
  user?: User;
}

// Stock APIs
export const getAllStocks = async (): Promise<Stock[]> => {
  const res = await fetch(`${API_BASE}/stock`, {
    credentials: "include",
  });
  const data: ApiResponse<Stock> = await res.json();
  return data.stocks || [];
};

export const addStock = async (stockData: { stockName: string; price: number; logo: string }): Promise<ApiResponse<Stock>> => {
  const res = await fetch(`${API_BASE}/stock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(stockData),
  });
  return res.json();
};

export const updateStock = async (id: string, stockData: Partial<{ stockName: string; price: number; logo: string }>): Promise<ApiResponse<Stock>> => {
  const res = await fetch(`${API_BASE}/stock/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(stockData),
  });
  return res.json();
};

export const deleteStock = async (id: string): Promise<ApiResponse<Stock>> => {
  const res = await fetch(`${API_BASE}/stock/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
};

// Auth APIs
export const login = async (email: string, password: string): Promise<ApiResponse<User> & { user?: User }> => {
  const res = await fetch(`${API_BASE}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const logout = async (): Promise<ApiResponse<null>> => {
  const res = await fetch(`${API_BASE}/user/logout`, {
    credentials: "include",
  });
  return res.json();
};
