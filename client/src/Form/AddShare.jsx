import React, { useEffect, useRef, useState } from 'react'
import {useParams,useNavigate} from 'react-router-dom'
import {Avatar, Box, Button, Card, CardContent, Grid, Input, Typography, ClickAwayListener,IconButton,useTheme} from '@mui/material'
import { fetchTweet, postNoti, shareTweet } from '../apiCall';
import { formatRelative, parseISO } from "date-fns";
import Loading from '../Util/Loading'
import {useDispatch, useSelector} from 'react-redux'
import { addNoti, addTweet } from '../features/appSlice';
import { setSnackbarOpen } from '../features/uiSlice';
import { io } from "socket.io-client";
import { green ,pink} from '@mui/material/colors';
import data from '@emoji-mart/data'
import {
    Collections as CollectionsIcon,
    Cancel as CancelIcon,
    Mood as MoodIcon
  } from '@mui/icons-material';
import Picker from '@emoji-mart/react'
import Images from '../Components/Images';
import useMediaQuery from '@mui/material/useMediaQuery';
var socket
function AddShare() {
  const theme = useTheme()
  const {user} = useSelector((state)=>state.auth);
  const {id} = useParams();
  const input = useRef();
  const [tweet,setTweet] = useState({});
  const [isLoading,setIsLoading] = useState(true);
  const [showEmojiPicker,setShowEmojiPicker] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emojiRef = useRef();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Mobile devices
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); //
  useEffect(()=>{
    socket = io("http://localhost:8000")
  },[])
  useEffect(()=>{
    (async()=>{
      let res=   await fetchTweet(id);

      if(!res) return;
      setIsLoading(false)
      setTweet(res)
    })()
  },[id]);

  const handleEmojiClick = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleClickAway = () => {
    setShowEmojiPicker(false);
  };

  return (
    isLoading ? (<Loading />)
    :(
        <Box sx={{my:3,marginX: isMobile || isTablet ? 3 : 'auto',maxWidth:"1200px"}}>
            <Box
                sx={{
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"space-between"
                }}
            >
                <Box sx={{display:"flex",gap:2,alignItems:"center"}}>
                    <Avatar
                        alt="Profile Picture"
                        src={user?.profile}
                        sx={{
                            width: 64,
                            height: 64,
                            bgcolor: pink[500],
                        }}
                    />
                     <Typography sx={{mr:1,fontSize:18}} component="span">
                            <b>{user.name}</b>
                    </Typography>

                </Box>
               
                <Button
                size="large"
                variant="outlined"
                color="info"
                sx={{borderRadius:5}}
                onClick={()=>{
                    const body = input.current.value;
                    (async()=>{
                        let res =  await shareTweet({body,id});
                 
                        if(!res) return navigate("/error");
                        let noti = await postNoti({target:res.origin_tweet[0]._id,type:"share"});
                        if(!noti) return navigate("/error")
                     
                        socket.emit("sendNoti",noti)
                        dispatch(addTweet(res))
                        dispatch(setSnackbarOpen(true))
                        navigate("/")
                    })()
                }}
                >
                    Share
                </Button>
            </Box>
            <Box sx={{display:"flex", my: 4}}>
                 <Input 
                    multiline
                    fullWidth
                    inputRef={input}
                    placeholder="Enter your remark"
                    sx={{ fontSize: "20px", py: 2 }}
                />
                  <ClickAwayListener onClickAway={handleClickAway}>
                        <Box sx={{ position: 'relative' }}>
                          <IconButton
                            sx={{ marginX: 3 }}
                            color="inherit"
                            onClick={handleEmojiClick}
                          >
                            <MoodIcon sx={{ fontSize: 30 }} />
                          </IconButton>
                          {showEmojiPicker && (
                            <Box
                              ref={emojiRef}
                              sx={{
                                position: 'absolute',
                                zIndex: 1,
                                right:30
                              }}
                            >
                              <Picker
                                data={data}
                                onEmojiSelect={(emj) => {
                                  input.current.value += emj.native;
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                    </ClickAwayListener>
            </Box>
            <Card sx={{ p: 2, }}>
                <CardContent sx={{p:2}}>
                                <Box sx={{display:"flex",}}>
                                    <Box sx={{mr:3}}>
                                        <div>
                                            <Avatar 
                                            alt="Profile Picture"
                                            src={tweet.user[0]?.profile && tweet.user[0].profile }
                                            sx={{width:64,height:64,bgcolor:green[500]}}/>
                                        </div>
                                    </Box>
                                    <Box>
                                        <Typography sx={{mr:1,fontSize:18}} component="span">
                                            <b>{tweet.user[0].name}</b>
                                        </Typography>
                                        <Typography
                                            component="span"
                                            sx={{color:"text.fade"}}
                                        >
                                            @ {tweet.user[0].handle}
                                        </Typography>
                                        <Typography component="h3" >
                                                <small>
                                                    {formatRelative(
                                                        parseISO(tweet.created),
                                                        new Date(),
                                                    )}
                                                </small>
                                        </Typography>
                                                    
                                      
                                    </Box>
                                </Box>
                                
                                <Box  sx={{marginY:2}}>
                                            <Typography
                                                variant='span'
                                                color="text.secondary"
                                                sx={{fontSize:20}}
                                            >
                                                {tweet.body}
                                            </Typography>
                                            <Box sx={{marginTop:2}}>   
                                              {
                                                  tweet?.images && tweet.images.length> 0 &&(
                                                    <Images images={tweet.images} />
                                                )
                                              }
                                            </Box>  
                                          
                                           
                                </Box>

                                
                </CardContent>
            </Card>
        </Box>
    )
  )
}

export default AddShare