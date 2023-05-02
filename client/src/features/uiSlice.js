import { createSlice } from "@reduxjs/toolkit";

 const uiSlice = createSlice({
    name:"ui",
    initialState:{
        drawerState:false,
        snackbarOpen:false,
        bottomMenuState:false
    },
    reducers:{
        setSnackbarOpen:(state,action)=>{
            state.snackbarOpen = action.payload
        },
        setBottomMenutState:(state,action)=>{
            state.bottomMenuState = action.payload
        },
        setDrawerState:(state,action)=>{
            state.drawerState = action.payload
        }
    }
})

export const {setSnackbarOpen,setBottomMenutState,setDrawerState} = uiSlice.actions;

export default uiSlice.reducer