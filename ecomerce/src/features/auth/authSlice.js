import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUser ,checkuser,signOut} from './authAPI';

const initialState = {
  UserData: null,
  status: 'idle',
  error:null
};


// typically used to make async requests.
export const createUserAsync = createAsyncThunk(
  'user/createUser',
  async (data) => {
    const response = await createUser(data);
    return response.data;
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
    try{
      const response = await checkuser(loginInfo);
      return response.data;
    }catch(error){
      console.log(error)
      return rejectWithValue(error);
    }
  }
);

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.UserData = action.payload;
      })
      .addCase(checkuserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkuserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.UserData = action.payload;
      })
      .addCase(checkuserAsync.rejected, (state,action) => {
        state.status = 'loading';
        state.error = action.payload;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signOutAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.UserData = null;
      })
  },
});

export const { increment} = counterSlice.actions;
export const selectUserData = (state)=>state.auth.UserData
export const selectError = (state)=>state.auth.error
export default counterSlice.reducer;
