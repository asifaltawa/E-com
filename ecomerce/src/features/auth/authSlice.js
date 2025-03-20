import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUser, checkuser, signOut } from './authAPI';

// Define API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

const initialState = {
  UserData: null,
  status: 'idle',
  error: null
};

export const createUserAsync = createAsyncThunk(
  'user/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('authSlice: Creating user with data:', JSON.stringify(userData, null, 2));
      const response = await createUser(userData);
      console.log('authSlice: User creation response:', response);
      
      // Check if the response has the expected structure
      if (!response || !response.success) {
        return rejectWithValue({
          message: response?.message || 'Failed to create account'
        });
      }
      
      return response;
    } catch (error) {
      console.error('authSlice: User creation error:', error);
      return rejectWithValue({
        message: error.message || 'Failed to create account'
      });
    }
  }
);

export const signOutAsync = createAsyncThunk(
  'user/signOut',
  async (userId) => {
    const response = await signOut(userId);
    return response.data;
  }
);

export const checkuserAsync = createAsyncThunk(
  'user/checkuser',
  async (loginInfo, { rejectWithValue }) => {
    try {
      const response = await checkuser(loginInfo);
      console.log('Auth slice: Raw login response:', response);
      
      if (!response.data || !response.data.success || !response.data.user) {
        throw new Error('Invalid user data received');
      }
      
      // Create a properly structured user data object
      const userData = {
        id: response.data.user._id || response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name || 'New User',
        role: response.data.user.role || 'user',
        addresses: response.data.user.addresses || [],
        success: true,
        user: {
          id: response.data.user._id || response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name || 'New User',
          role: response.data.user.role || 'user',
          addresses: response.data.user.addresses || []
        }
      };
      
      // Store in localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      console.log('Auth slice: stored structured user data:', userData);
      
      return userData;
    } catch (error) {
      console.error('Auth slice: Login error:', error);
      return rejectWithValue(error);
    }
  }
);

export const forgotPasswordAsync = createAsyncThunk(
  'auth/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    restoreUser: (state, action) => {
      console.log('authSlice: restoreUser called with payload:', action.payload);
      
      if (!action.payload) {
        console.log('authSlice: Empty payload in restoreUser, clearing user data');
        state.UserData = null;
        state.status = 'failed';
        state.error = { message: 'Invalid user data' };
        localStorage.removeItem('userData');
        return;
      }
      
      // Extract user ID - handle both possible structures
      const userId = action.payload.id || (action.payload.user && action.payload.user.id);
      
      if (!userId) {
        console.log('authSlice: No user ID found in payload, clearing user data');
        state.UserData = null;
        state.status = 'failed'; 
        state.error = { message: 'Invalid user data - no ID found' };
        localStorage.removeItem('userData');
        return;
      }
      
      // We have a valid ID, ensure consistent structure
      console.log('authSlice: Valid user ID found:', userId);
      
      // Standardize the user data structure
      const userData = {
        id: userId,
        email: action.payload.email || (action.payload.user && action.payload.user.email) || '',
        name: action.payload.name || (action.payload.user && action.payload.user.name) || 'New User',
        role: action.payload.role || (action.payload.user && action.payload.user.role) || 'user',
        addresses: action.payload.addresses || (action.payload.user && action.payload.user.addresses) || [],
        success: true,
        user: action.payload.user || {
          id: userId,
          email: action.payload.email || '',
          name: action.payload.name || 'New User',
          role: action.payload.role || 'user'
        }
      };
      
      // Update the state with properly structured data
      state.UserData = userData;
      state.status = 'idle';
      state.error = null;
      
      console.log('authSlice: User data restored successfully:', userData);
    },
    logoutUser: (state) => {
      state.UserData = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('userData');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        // We're not storing user data after signup since it requires email verification
        // Just mark as successful and let the UI navigate to verification page
        console.log('User signup completed successfully:', action.payload);
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.UserData = null;
      })
      .addCase(checkuserAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkuserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        if (action.payload && action.payload.success && action.payload.user) {
          state.UserData = action.payload;
          state.error = null;
          console.log('Login successful, storing user data:', action.payload);
        } else {
          state.status = 'failed';
          state.error = { message: 'Invalid user data received' };
          state.UserData = null;
        }
      })
      .addCase(checkuserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.UserData = null;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signOutAsync.fulfilled, (state) => {
        state.status = 'idle';
        state.UserData = null;
        state.error = null;
        localStorage.removeItem('userData');
      })
      .addCase(signOutAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(forgotPasswordAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(forgotPasswordAsync.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(forgotPasswordAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError, restoreUser, logoutUser } = authSlice.actions;

export const selectUserData = (state) => state.auth.UserData;
export const selectStatus = (state) => state.auth.status;
export const selectError = (state) => state.auth.error;

export default authSlice.reducer;
