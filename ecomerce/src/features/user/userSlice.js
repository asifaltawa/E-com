import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchLoggedInUserOrders,fetchLoggedInUserData,updateAddress } from './userAPI';

const initialState = {
  userOrders: [],
  status: 'idle',
  loggedInUserData:[]
};


// typically used to make async requests.
export const fetchLoggedInUserOrdersAsync = createAsyncThunk(
  'user/fetchLoggedInUserOrders',
  async (userId) => {
    const response = await fetchLoggedInUserOrders(userId);
    return response.data;
  }
);

export const updateAddressAsync = createAsyncThunk(
  'user/updateAddress',
  async (userId) => {
    const response = await updateAddress(userId);
    return response.data;
  }
);

export const fetchLoggedInUserDataAsync = createAsyncThunk(
  'user/fetchLoggedInUserData',
  async (userId) => {
    const response = await fetchLoggedInUserData(userId);
    return response.data;
  }
);


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    increment: (state) => {
      
      state.value += 1;
    },
    
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoggedInUserOrdersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLoggedInUserOrdersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.userOrders = action.payload;
      })
      .addCase(fetchLoggedInUserDataAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLoggedInUserDataAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserData = action.payload;
      })
      .addCase(updateAddressAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAddressAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserData = action.payload;
      });
  },
});

export const { increment} = userSlice.actions;
export const selectUserOrders = (state) => state.user.userOrders;
export const selectLoggedInUserData = (state) => state.user.loggedInUserData;

export default userSlice.reducer;
