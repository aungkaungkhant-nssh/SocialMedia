import React, { useEffect, useRef, useState } from 'react'
import {useParams,useNavigate} from 'react-router-dom'
import {Avatar, Box, Button, Card, CardContent, Input, Typography} from '@mui/material'
import { fetchTweet, postNoti, shareTweet } from '../apiCall';
import { formatRelative, parseISO } from "date-fns";
import Loading from '../Util/Loading'
import {useDispatch} from 'react-redux'
import { addNoti, addTweet } from '../features/appSlice';
import { setSnackbarOpen } from '../features/uiSlice';
import { io } from "socket.io-client";

var socket
function AddShare() {
  const {id} = useParams();
  const input = useRef();
  const [tweet,setTweet] = useState({});
  const [isLoading,setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  },[id])
  return (
    isLoading ? (<Loading />)
    :(
        <Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
            <Box
                sx={{
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"space-between"
                }}
            >
                <Avatar alt="profile" />
                <Button
                size="small"
                variant='outlined'
                color="success"
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
            <Box>
                <Input 
                    multiline
                    fullWidth
                    minRows={4}
                    inputRef={input}
                    placeholder="Enter your remark"
                    sx={{ fontSize: "16px", py: 2 }}
                />
            </Box>
            <Card sx={{ p: 2, mt: 4 }}>
                <CardContent  sx={{ display: "flex", p: 2 }}>
                    <Box sx={{mr:3}}>
                        <Avatar 
                            alt="Profile"
                            sx={{ width: 48, height: 48 }}
                        />
                    </Box>
                    <Box>
                        <Typography
                            sx={{ mr: 1 }}
                            color="text.secondary"
                            component="span"
                        >
                        {tweet.user[0].name}
                        </Typography>
                        <Typography
                                component="span"
                                sx={{ color: "text.fade", mr: 1 }}>
                                @ {tweet.handle}
                            </Typography>

                            <Typography
                                component="span"
                                variant="body2"
                                sx={{ color: "text.fade" }}>
                                
                                {formatRelative(
                                    parseISO(tweet.created),
                                    new Date(),
                                )}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.fade"
                                sx={{ fontSize: "16px" }}>
                                {tweet.body}
                            </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
  )
}

export default AddShare