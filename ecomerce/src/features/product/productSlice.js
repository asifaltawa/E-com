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
  selectedProduct:null
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

export const createProductAsync  = createAsyncThunk(
  'product/createProduct',
  async (product) => {
    const response = await createProduct(product);
    return response.data;
  }
);

export const updateProductAsync  = createAsyncThunk(
  'product/updateProduct',
  async (update) => {
    const response = await updateProduct(update);
    return response.data;
  }
);

export const fetchProductsByIdAsync  = createAsyncThunk(
  'product/fetchProductsById',
  async (id) => {
    const response = await fetchProductsById(id);
    return response.data;
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
      .addCase(fetchProductsByIdAsync.pending,(state)=>{
        state.status = 'loading';
      })
      .addCase(fetchProductsByIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selectedProduct = action.payload;
      })
      .addCase(createProductAsync.pending,(state)=>{
        state.status = 'loading';
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products.push(action.payload);
      })
      .addCase(updateProductAsync.pending,(state)=>{
        state.status = 'loading';
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.products.findIndex((product)=> product.id === action.payload.id)
        state.products[index] = action.payload;
      })
  },
});

export const {clearSelectedProducts } = productSlice.actions;
export const allproducts = (state) => state.product.products;
export const selectCategories = (state) => state.product.categories;
export const selectBrands = (state) => state.product.brands;
export const selectTotalItems = (state) => state.product.totalItems;
export const selectProductsById = (state) => state.product.selectedProduct;

export default productSlice.reducer;
