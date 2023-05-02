import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchUser } from '../apiCall';


 const authSlice = createSlice({
    name:"auth",
  
    initialState:{
        user:{},
        authStatus:false
    },
    reducers:{
        setAuthStatus:(state,action)=>{
            state.authStatus=action.payload
        },
        setUser :(state,action)=>{
            state.user = action.payload;
        },
        setFollow:(state,action)=>{
            
            state.user.followings  = action.payload;
            state.user = state.user
        }
    },
    extraReducers:builder =>{
        builder.addCase(checkAuth.fulfilled,(state,action)=>{
          
            if(action.payload){
                state.user = action.payload.user;
                state.authStatus = true;
            }else{
                state.user = {};
                state.authStatus = false;
            }
        })
       

    }

})

export const checkAuth = createAsyncThunk("auth/checkAuth",async({},{rejectWithValue})=>{
  
        let res = await fetchUser();
        return res;
    
})

export const {setAuthStatus,setUser,setFollow} = authSlice.actions

export default authSlice.reducer;

