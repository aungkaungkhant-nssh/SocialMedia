import React, { useEffect, useState } from 'react'
import { AppBar, Badge, IconButton, Toolbar, Typography } from '@mui/material'
import { useLocation,useNavigate } from 'react-router-dom'

import {
    AccountCircle as AccountCirlceIcon,
    ArrowBack as ArrowBackIcon,
    Hub as HubIcon,
    PersonSearch as PersonSearchIcon,
    Notifications as NotificationsIcon
}
from "@mui/icons-material"
import Search from './Search';
import {useSelector,useDispatch} from 'react-redux'
import { fetchNoti } from '../apiCall';
import { setNoti } from '../features/appSlice';
function Header({notis,toggleDrawer}) {
  const location = useLocation();
  const navigate =  useNavigate();
  const [searchOpen,setSearchOpen] = useState(false);
  const {authStatus} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  
  useEffect(()=>{
    (async()=>{
      if(authStatus){
     
        let res =   await fetchNoti();
        if(!res) return navigate("/error")
        dispatch(setNoti(res))
      }
    
    })()
  },[authStatus])
  return (
    <AppBar
        position='sticky'
        elevation={1}
        sx={{bgcolor:"appbar.background"}}
    >
        <Toolbar>
            {
                location.pathname === "/" ?(
                    <IconButton
                        color="inherit"
                        size="large"
                        edge="start"
                        sx={{mr:2,display:{md:"none"}}}
                        onClick={toggleDrawer(true)}
                    >
                        <AccountCirlceIcon />
                    </IconButton>
                ):(
                    <IconButton
                        color="inherit"
                        size="large"
                        edge="start"
                        onClick={()=>{
                            navigate(-1)
                        }}
                    >
                            <ArrowBackIcon />
                    </IconButton>
                )
            }
            <IconButton
                disableRipple={true}
                sx={{flexGrow:1,textAlign:"center"}}
            >
                <HubIcon sx={{color:"logo.color",fontSize:38}}/>
            </IconButton>
            <IconButton
                sx={{mr:1}}
                color="inherit"
                size="large"
                edge="start"
                onClick={()=>setSearchOpen(true)}
            >
                <PersonSearchIcon />
            </IconButton>
            {
                authStatus && (
                    <IconButton
                        color="inherit"
                        onClick={()=>navigate("/notis")}
                    >
                        {notis.filter((noti)=>!noti.read).length > 0 ?(
                            <Badge badgeContent={notis.filter((noti)=>!noti.read).length} color="error" overlap="circular">
                                 <NotificationsIcon  />
                            </Badge>
                        ):(
                            <NotificationsIcon  />
                        )}
                     
                    </IconButton>
                )
            }
        </Toolbar>
        <Search open={searchOpen} setOpen={setSearchOpen} />
    </AppBar>
  )
}

export default Header