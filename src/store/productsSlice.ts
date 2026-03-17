import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Product } from '../types/product';

 
interface ProductsState {
  items: Product[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

 
const initialState: ProductsState = {
  items: [],
  loading: 'idle',
  error: null,
};

 
const PRODUCTS_URL = 'https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json';

 
export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts',
  async () => {
    const response = await fetch(PRODUCTS_URL);
    if (!response.ok) {
      throw new Error('Ошибка загрузки');
    }
    const data: Product[] = await response.json();
    return data;  
  }
);
 
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Неизвестная ошибка';
      });
  },
});

export default productsSlice.reducer;