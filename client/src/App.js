import logo from './logo.svg';
import './App.css';
import { useTheme } from "@mui/material/styles";
import { Box, Fab, Snackbar,Alert } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import {CssBaseline} from "@mui/material";
import Home from './Main/Home';
import Header from './Components/Header';
import MainNav from './Nav/MainNav';
import { useEffect, useState } from 'react';
import Register from './Users/Register';
import Login from './Users/Login'
import Profile from './Main/Profile'
import {
  Add as AddIcon, NotListedLocationOutlined, SportsCricketOutlined

} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux';
import AddTweet from './Form/AddTweet';
import { useNavigate } from 'react-router-dom';
import { setBottomMenutState, setDrawerState, setSnackbarOpen } from './features/uiSlice';
import Loading from './Util/Loading';
import BottomMenu from './Nav/BottomMenu';
import Tweet from './Main/Tweet';

import Followings from './Pages/Followings';
import Followers from './Pages/Followers'
import EditUser from './Users/EditUser';
import AddShare from './Form/AddShare';
import Error from './Util/Error';
import { io } from "socket.io-client";
import Noti from './Pages/Noti';
import { addNoti, setNoti } from './features/appSlice';
import { fetchNoti } from './apiCall';
import Likes from './Pages/Likes';
import Shares from './Pages/Shares';
var socket

function App() {
  const theme = useTheme();

  const {authStatus,user} = useSelector((state)=>state.auth);
  const navigate = useNavigate();
  const {snackbarOpen,bottomMenuState,drawerState} = useSelector((state)=>state.ui);
  const isLoading= useSelector((state)=>state.app.status==="loading");  
  const dispatch = useDispatch();
  const {count,page,total,notis} = useSelector((state)=>state.app);
  const [tweetIdOwner,setTweetIdOwner] = useState();

  
  const toggleBottomMenu = (open,tweetIdOwner)=>event=>{
   
    setTweetIdOwner(tweetIdOwner)
    dispatch(setBottomMenutState(open))
  }
  const toggleDrawer  = (open)=>event=>{
    if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		dispatch(setDrawerState(open));

  }
  useEffect(()=>{
    if(authStatus && !socket){
      socket = io("http://localhost:8000")
      socket.emit("joinUser",user._id)
    }
  },[authStatus])
  useEffect(()=>{
   (async()=>{
        if(authStatus && socket){
          socket.on("recieveNoti",(data)=>{
            dispatch(addNoti(data))
          })
        }
   })()
  },[authStatus])


  return (
    <Box sx={{ml:{md:"280px",sm:0}}}>
        {isLoading && <Loading />}
      	<CssBaseline />
        <Box>
            <Header notis={notis} toggleDrawer={toggleDrawer} />
            <MainNav 
              drawerState={drawerState}
              toggleDrawer={toggleDrawer}
            />
            <Routes>
                <Route 
                  path='/'
                  element={
                    <Home 
                    toggleBottomMenu={toggleBottomMenu}
                    count={count}
                    page={page}
                    total={total}
                    />
                  }
                />
                <Route 
                  path="/tweet/:id/likes"
                  element={
                    <Likes />
                  }
                />
                <Route
                  path='/tweet/:id/shares'
                  element={
                    <Shares />
                  }
                />
                <Route 
                  path='/tweet/:id'
                  element={
                    <Tweet toggleBottomMenu={toggleBottomMenu} />
                  }
                />
                <Route
                  path="/register"
                  element={
                       <Register />
                  }
                />
                <Route
                  path='/login'
                  element={
                    <Login />
                  }
                />
                <Route 
                    path="/:handle"
                    element={
                      <Profile toggleBottomMenu={toggleBottomMenu} />
                    }

                />
                <Route 
                    path="/user/:handle/followings"
                    element={
                      <Followings />
                    }
                />
                <Route 
                  path="/user/:handle/followers"
                  element={
                    <Followers />
                  }
                
                />
                <Route 
                  path="/tweet/add"
                  element={authStatus ? <AddTweet /> : <Login />}
                />
                <Route 
                  path='/editProfile'
                  element={authStatus ? <EditUser /> : <Login />}
                />
                <Route 
                  path="/tweet/:id/share"
                  element={authStatus ? <AddShare /> : <Login />}
                />
                <Route 
                  path="/notis"
                  element={authStatus && <Noti />}
                />
                <Route 
                  path="/error"
                  element={<Error />}
                />
                
            </Routes>
            {
              authStatus && (
                <Fab 
                color="info"
                sx={{
                  position:"fixed",
                  bottom:"40px",
                  right:"40px"
                }}
                onClick={()=>navigate('/tweet/add')}
              >
                <AddIcon />
              </Fab>
              )
            }
            <BottomMenu
              tweetIdOwner={tweetIdOwner}
              bottomMenuState={bottomMenuState}
              toggleBottomMenu={toggleBottomMenu}
            />
        </Box>
        <Snackbar
          anchorOrigin={{
            vertical:"top",
            horizontal:"right"
          }}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={()=>dispatch(setSnackbarOpen(false))}
        >
            <Alert severity='success'>Your post has been added</Alert>
        </Snackbar>
    </Box>
  );
}

export default App;
