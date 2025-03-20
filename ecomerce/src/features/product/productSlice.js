import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  
  fetchallproducts ,
  fetchfiltersBrands,
  fetchfiltersCategories,
  fetchProductsByFilters,
  fetchProductsById,
  createProduct,
  updateProduct
} from './ProductApi';

const initialState = {
  products: [],
  brands: [],
  categories: [],
  status: 'idle',
  totalItems:0,
  selectedProduct:null,
  error: null
};


// typically used to make async requests.
export const fetchallproductsAsync = createAsyncThunk(
  'product/fetchallproducts',
  async () => {
    const response = await fetchallproducts();
    return response.data;
  }
);
export const fetchfiltersCategoriesAsync = createAsyncThunk(
  'product/fetchfiltersCategories',
  async () => {
    const response = await fetchfiltersCategories();
    return response.data;
  }
);
export const fetchfiltersBrandsAsync  = createAsyncThunk(
  'product/fetchfiltersBrands',
  async () => {
    const response = await fetchfiltersBrands();
    return response.data;
  }
);

export const createProductAsync = createAsyncThunk(
  'product/createProduct',
  async (product, { rejectWithValue }) => {
    try {
      const response = await createProduct(product);
      return response;
    } catch (error) {
      // Handle duplicate title error specifically
      if (error.message.includes('already exists')) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue(error.message || 'Failed to create product');
    }
  }
);

export const updateProductAsync  = createAsyncThunk(
  'product/updateProduct',
  async (update) => {
    const response = await updateProduct(update);
    return response.data;
  }
);

export const fetchProductsByIdAsync = createAsyncThunk(
  'product/fetchProductsById',
  async (id, { rejectWithValue }) => {
    console.log('productSlice - fetchProductsByIdAsync called with ID:', id);
    try {
      const response = await fetchProductsById(id);
      console.log('productSlice - API response:', response.data);
      if (!response.data || !response.data.id) {
        console.error('Invalid data received from API:', response.data);
        return rejectWithValue('Invalid product data received');
      }
      return response.data;
    } catch (error) {
      console.error('Error in fetchProductsByIdAsync:', error);
      return rejectWithValue(error.toString());
    }
  }
);


export const fetchFilteredProductsAsync = createAsyncThunk(
  'product/fetchProductsByFilters',
  async ({filter,sort,pagination,admin}) => {
    const response = await fetchProductsByFilters(filter,sort,pagination,admin);
    return response.data;
  }
);
export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearSelectedProducts:(state,payload)=>{
      state.selectedProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchallproductsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchallproductsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload;
      })
      .addCase(fetchFilteredProductsAsync.pending,(state)=>{
        state.status = 'loading';
      })
      .addCase(fetchFilteredProductsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchfiltersCategoriesAsync.pending,(state)=>{
        state.status = 'loading';
      })
      .addCase(fetchfiltersCategoriesAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.categories = action.payload;
      })
      .addCase(fetchfiltersBrandsAsync.pending,(state)=>{
        state.status = 'loading';
      })
      .addCase(fetchfiltersBrandsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.brands = action.payload;
      })
      .addCase(fetchProductsByIdAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductsByIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selectedProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductsByIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load product';
        state.selectedProduct = null;
      })
      .addCase(createProductAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products.push(action.payload);
        state.error = null;
      })
      .addCase(createProductAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create product';
      })
      .addCase(updateProductAsync.pending,(state)=>{
        state.status = 'loading';
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.products.findIndex((product)=> product.id === action.payload.id);
        state.products[index] = action.payload;
      });
  },
});

export const {clearSelectedProducts } = productSlice.actions;
export const allproducts = (state) => state.product.products;
export const selectCategories = (state) => state.product.categories;
export const selectBrands = (state) => state.product.brands;
export const selectTotalItems = (state) => state.product.totalItems;
export const selectProductsById = (state) => state.product.selectedProduct;

export default productSlice.reducer;
