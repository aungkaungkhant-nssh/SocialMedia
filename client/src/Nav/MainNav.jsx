import React, { useContext } from 'react'
import { IconButton, Drawer, Box, Avatar, Divider, Typography, List, ListItemButton,ListItem, ListItemText, ListItemIcon } from '@mui/material'
import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material'
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from '../ThemedApp';
import { pink } from '@mui/material/colors';
import { Link, useNavigate } from "react-router-dom";
import {
        Feed as FeedIcon,
        PersonAddAlt as PersonAddAltIcon,
        Login as LoginIcon,
        Person as PersonIcon,
        Logout as LogoutIcon,
        SwitchAccount as SwitchAccountIcon
} from "@mui/icons-material"
import {useSelector,useDispatch} from 'react-redux';
import { setAuthStatus, setUser } from '../features/authSlice';
function MenuList({ toggleDrawer,authStatus,user }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <Box
            sx={{ width: 280 }}
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Box
                sx={{
                    p: 3,
                    mb: 2,
                    minHeight: 150,
                    bgcolor: "banner.background"
                }}
            >
                {
                    authStatus && (
                        <>
                            <Avatar
                                alt="Profile"
                                src={user?.profile && user?.profile}
                                sx={{
                                    mb: 3,
                                    width: 64,
                                    height: 64,
                                    bgcolor: pink[500]
                                }}
                            />
                            <Typography>
                                <b>{user.name}</b>
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{ color: "text.fade",mb:2 }}
                            >
                                @ {user.handle}
                            </Typography>
                            <Typography
                                component="span"
                                sx={{fontSize:14,color:"text.fade",mr:3}}
                            >
                                <Link
                                    to={`user/${user.handle}/followings`}
                                    style={{
                                        color:pink[400],
                                        textDecoration:"none"
                                    }}
                                >
                                    {user?.followings && user.followings.length  } 
                                    {" "}Followings
                                </Link>
                            </Typography>
                            <Typography
                                component="span"
                            >
                                <Link
                                    to={`user/${user.handle}/followers`}
                                    style={{
                                        color:pink[400],
                                        textDecoration:"none"
                                    }}
                                >
                                    {user?.followers && user.followers.length  } 
                                    {" "}
                                     Followers
                                </Link>
                            </Typography>
                        </>
                    )
                }
              
            </Box>
            <List>
                <ListItem>
                    <ListItemButton
                        onClick={()=>{
                            navigate("/")
                        }}
                    >
                        <ListItemIcon>
                            <FeedIcon />
                        </ListItemIcon>
                        <ListItemText primary="News Feed" />
                    </ListItemButton>
                </ListItem>
                {
                    !authStatus && (
                        <>
                            <ListItem>
                                <ListItemButton
                                    onClick={()=>navigate("/register")}
                                >
                                        <ListItemIcon>
                                            <PersonAddAltIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Register" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton
                                    onClick={()=>navigate("/login")}
                                >
                                        <ListItemIcon>
                                            <LoginIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Login" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    ) 
                }
           
                
                {
                    authStatus && (
                        <>
                             <ListItem>
                                <ListItemButton onClick={()=>navigate("/register")}>
                                    <ListItemIcon>
                                        <PersonAddAltIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Add Account" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton onClick={()=>navigate("/login")}>
                                    <ListItemIcon>
                                        <SwitchAccountIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Switch Account" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton
                                    onClick={()=>navigate(`/${user.handle}`) }
                                   
                                   
                                >
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Profile" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton 
                                    onClick={()=>{
                                        localStorage.removeItem("token");
                                        dispatch(setAuthStatus(false));
                                        dispatch(setUser({}))
                                        navigate("/")
                                    }}
                                >
                                    <ListItemIcon>
                                        <LogoutIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )
                }
               
            </List>
        </Box>
    )
}


function MainNav({ drawerState, toggleDrawer }) {
    const theme = useTheme();
    let colorMode = useContext(ColorModeContext);
    const {authStatus,user} = useSelector((state)=>state.auth);
 

    return (
        <>
              <Drawer
                    anchor="left"
                    open={true}
                    onClose={toggleDrawer(false)}
                    variant="persistent"
                    sx={{
                        display:{
                               sm:"none",
                                xs:"none",
                                md:"block"
                        }
                    }}
                >
                    <MenuList 
                        toggleDrawer={toggleDrawer}
                        authStatus={authStatus}
                        user={user} 
                    />
                    <Divider />
                    <IconButton
                        color="inherit"
                        disableRipple={true}
                        sx={{ ml: 1, mt: 2 }}
                        onClick={colorMode.toggleColorMode}
                    >
                        {
                            theme.palette.mode === "dark" ?
                                (<DarkModeIcon />)
                                : (<LightModeIcon />)
                        }

                    </IconButton>
            </Drawer>
            <Drawer
                anchor="left"
                open={drawerState}
                onClose={toggleDrawer(false)}
              
                sx={{
                  display:{
                    sm:"block",
                    xs:"block",
                    md:"none"
                  }
                }}
            >
                    <MenuList 
                         toggleDrawer={toggleDrawer}
                        authStatus={authStatus}
                        user={user} 
                    />
                    <Divider />
                    <IconButton
                        color="inherit"
                        disableRipple={true}
                        sx={{ ml: 1, mt: 2 }}
                        onClick={colorMode.toggleColorMode}
                    >
                        {
                            theme.palette.mode === "dark" ?
                                (<DarkModeIcon />)
                                : (<LightModeIcon />)
                        }

                    </IconButton>
            </Drawer>
        </>
      
    )
}

export default MainNav