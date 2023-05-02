import {configureStore} from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import uiReducer from '../features/uiSlice'
import appReducer from "../features/appSlice";
export default configureStore({
    reducer:{
        auth:authReducer,
        ui:uiReducer,
        app:appReducer
    }
})

