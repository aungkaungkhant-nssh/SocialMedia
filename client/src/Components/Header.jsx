import React, { useEffect, useState } from 'react'
import { AppBar, Badge, IconButton, Toolbar, Typography } from '@mui/material'
import { useLocation,useNavigate } from 'react-router-dom'
import { lightBlue, pink } from '@mui/material/colors'
import {
    AccountCircle as AccountCirlceIcon,
    ArrowBack as ArrowBackIcon,
    Hub as HubIcon,
    PersonSearch as PersonSearchIcon,
    Notifications as NotificationsIcon,
    WbTwilight as WbTwilightIcon,
    PostAdd as PostAddIcon
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
                        <AccountCirlceIcon  sx={{fontSize:30}} />
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
                            <ArrowBackIcon  sx={{fontSize:30}} />
                    </IconButton>
                )
            }
            
            <IconButton
                disableRipple={true}
                sx={{flexGrow:1,textAlign:"center"}}
            >
                <PostAddIcon sx={{color:"logo.color",fontSize:38}}/>
                <Typography sx={{fontSize:25,marginLeft:2,fontWeight:"bolder"}}>InstaPost</Typography>
            </IconButton>
            <IconButton
                sx={{mr:1}}
                color="inherit"
                edge="start"
                onClick={()=>setSearchOpen(true)}
          
            >
                <PersonSearchIcon sx={{fontSize:30}}/>
            </IconButton>
            {
                authStatus && (
                    <IconButton
                        color="inherit"
                        onClick={()=>navigate("/notis")}
                    >
                        {notis.filter((noti)=>!noti.read).length > 0 ?(
                            <Badge badgeContent={notis.filter((noti)=>!noti.read).length} color="error" overlap="circular">
                                 <NotificationsIcon   sx={{fontSize:30}}/>
                            </Badge>
                        ):(
                            <NotificationsIcon  sx={{fontSize:30}} />
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