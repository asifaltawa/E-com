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
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetchLoggedInUserOrders(userId);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
      return rejectWithValue(error.message || 'Failed to fetch user orders');
    }
  }
);

export const updateAddressAsync = createAsyncThunk(
  'user/updateAddress',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await updateAddress(userData);
      return response.data;
    } catch (error) {
      console.error('Failed to update address:', error);
      return rejectWithValue(error.error || 'Failed to update address');
    }
  }
);

export const fetchLoggedInUserDataAsync = createAsyncThunk(
  'user/fetchLoggedInUserData',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetchLoggedInUserData(userId);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      return rejectWithValue(error.message || 'Failed to fetch user data');
    }
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
        state.userOrders = action.payload || [];
      })
      .addCase(fetchLoggedInUserOrdersAsync.rejected, (state, action) => {
        state.status = 'failed';
        console.error('User orders fetch failed:', action.payload);
        state.userOrders = [];
      })
      .addCase(fetchLoggedInUserDataAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLoggedInUserDataAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserData = action.payload || {};
      })
      .addCase(fetchLoggedInUserDataAsync.rejected, (state, action) => {
        state.status = 'failed';
        console.error('User data fetch failed:', action.payload);
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
