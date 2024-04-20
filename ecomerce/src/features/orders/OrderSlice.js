import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CreateOrder, fetchAllOrders, updateOrder } from './OrderAPI';

const initialState = {
  orders: [],
  status: 'idle',
  currentOrder: null,
  totalOrder:0
  
};


// typically used to make async requests.
export const CreateOrderAsync = createAsyncThunk(
  'order/CreateOrder',
  async (order) => {
    const response = await CreateOrder(order);
    return response.data;
  }
);

export const updateOrderAsync = createAsyncThunk(
  'order/updateOrder',
  async (update) => {
    const response = await updateOrder(update);
    return response.data;
  }
);

// export const fetchAllOrdersAsync = createAsyncThunk(
//   'order/fetchAllOrders',
//   async ({sort,pagination}) => {
//     const response = await fetchAllOrders(sort,pagination);
//     return response.data;
//   }
// );

export const fetchAllOrdersAsync = createAsyncThunk(
  'order/fetchAllOrders',
  async ({sort, pagination}) => {
    const response = await fetchAllOrders(sort,pagination);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const OrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.currentOrder = null;
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(CreateOrderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(CreateOrderAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orders.push(action.payload);
        state.currentOrder = action.payload
      })
      .addCase(fetchAllOrdersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orders = action.payload.orders;
        state.totalOrder = action.payload.totalOrders;
      })
      .addCase(updateOrderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.orders.findIndex(order => order.id === action.payload.id)
        state.orders[index] = action.payload;        
      });
  },
});

export const { resetOrder} = OrderSlice.actions;
// export const selectOrder = (state) => state.order.orders;
export const selectTotalOrder = (state)=> state.order.totalOrder;
export const selectOrders = (state)=> state.order.orders;

export const selectCurrentOrder = (state)=> state.order.currentOrder;
export default OrderSlice.reducer;
