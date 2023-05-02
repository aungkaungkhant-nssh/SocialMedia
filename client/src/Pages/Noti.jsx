import React, { useEffect, useState } from 'react'
import { Avatar, Box,Button, Card, CardActionArea, CardContent, Drawer, IconButton, Typography,ListItem,ListItemText,ListItemIcon,List,ListItemButton } from '@mui/material';
import { deleteNoti, fetchNoti, putMarkAllNotiRead, putMarkOneNotiRead } from '../apiCall';
import {useNavigate} from 'react-router-dom'
import {formatRelative,parseISO} from 'date-fns';
import {
     Comment as CommentIcon,
    Share as ShareIcon,
    Favorite as FavoriteIcon,
    MoreHoriz as MoreHorizIcon,
    Delete as DeleteIcon
} from '@mui/icons-material'
import { useSelector,useDispatch } from 'react-redux';
import { markAllNotiRead, oneNotiRead, removeNoti, setNoti } from '../features/appSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
function Noti() {
    const {notis,notiCount,notiPage,notiTotal} = useSelector((state)=>state.app);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [bottomMenuState,setBottomMeuState] = useState(false)
    const [notiId,setNotiId] = useState()

   
   
    useEffect(()=>{
        
        (async()=>{
            let res = await fetchNoti();
         
            if(!res) return navigate("/error")
            dispatch(setNoti(res))
        })()
    },[])
   const handleDeleteNoti = async()=>{
        setBottomMeuState(false)
        let res= await deleteNoti({id:notiId})
        if(!res) return navigate("/error")
        dispatch(removeNoti(res))

   }
  
  return (
    <Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 }}}>
        {
            notis.length === 0 && (
                <>
                    <Typography  variant='h4' sx={{fontWeight:"bolder"}}>
                            Nothing to see here
                    </Typography>
                    <Button
                            onClick={() => {
                                navigate("/");
                            }}>
                            Go Back
                    </Button>
                </>
            )
        }
      
        <Box  sx={{ display: "flex", mb: 2 }}> 
            <Box sx={{flex:1}}></Box>
            {
                notis.length > 0 && (
                    <Button 
                        size="small"
                        variant = "outlined"
                        sx={{borderRadius:5}}
                        onClick={()=>{
                            (async()=>{
                               let res  = await putMarkAllNotiRead();
                               if(!res) return navigate("/error")
                                dispatch(markAllNotiRead())
                            })()
                        }}
                    >
                        Mark all as read
                    </Button>
                )
            }
         
        </Box>
              {
                notis.map((noti)=>(
                <Card key={noti._id} sx={{mb:1}}>
                    <CardActionArea
                        onClick={()=>{
                            (async()=>{
                              let res =  await putMarkOneNotiRead({id:noti._id});
                              if(!res) return navigate("/error");
                              dispatch(oneNotiRead({id:noti._id}))
                            })()
                           
                        }}
                    >
                    <CardContent
                        sx={{
                            display:"flex",
                            opacity:noti.read ? 0.4 : 1,
                            alignItems:"self-start"
                        }}
                    >

                        {
                            noti.type ==="comment" ? (
                                <CommentIcon color="success" />
                            ):noti.type==="share"?(
                                <ShareIcon color="primary" />
                            ):(
                                <FavoriteIcon color="error" />
                            )
                        }
                        <Box sx={{flex:1,ml:3}}>
                            <Avatar alt="Profile" 
                                  src={noti.user[0]?.profile && noti.user[0]?.profile}
                            />
                            <Box sx={{mt:1}}>
                                <Typography
                                    component="span"
                                    sx={{mr:1}}
                                >
                                    <b>{noti.user[0].name}</b>
                                </Typography>
                                <Typography
                                    component="span"
                                    sx={{
                                        mr:1,
                                        color:"text.secondary"
                                    }}
                                >
                                    {noti.msg}
                                </Typography>
                                <Typography
                                    component="span"
                                    color="primary"
                                >
                                    <small>
                                        {
                                            formatRelative(
                                                parseISO(noti.created),
                                                new Date()
                                            )
                                        }
                                    </small>
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton onClick={(e)=>{
                            e.stopPropagation()
                            setNotiId(noti._id)
                            setBottomMeuState(true)
                        }}>
                            <MoreHorizIcon />
                        </IconButton>
                    </CardContent>
                    </CardActionArea>  
                </Card>
                ))
              }
        <Drawer
        anchor='bottom'
        open={bottomMenuState}
        onClose={()=>setBottomMeuState(false)}
        >
            <List>
                <ListItem>
                    <ListItemButton onClick={handleDeleteNoti}>
                             <ListItemIcon >
                                <DeleteIcon color="error"  />
                            </ListItemIcon>
                        <ListItemText primary="Remove Notification" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer> 
      
    </Box>
  )
}

export default Noti