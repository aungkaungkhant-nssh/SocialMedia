import { Card, Box,IconButton, CardActionArea, CardContent, Avatar, Typography, ButtonGroup,Button } from '@mui/material'
import React, { useEffect } from 'react'
import {
    MoreVert as MoreVertIcon,
    Share as ShareIcon,
    ChatBubble as ChatBubbleIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material'
import { green } from '@mui/material/colors';
import {formatRelative,parseISO} from 'date-fns';
import {useSelector,useDispatch} from 'react-redux'
import { fetchLatest, toggleLike } from '../features/appSlice';
import {useNavigate} from "react-router-dom"
import InfiniteScroll from 'react-infinite-scroll-component';

function MainList({tweets,toggleBottomMenu,count,total,nextFetch}) {

    const {user,authStatus} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const navigate= useNavigate();
   
   
    
  return (
    <div  
    
    >
        <InfiniteScroll 
            dataLength={count}
            loader={"see more..."}
            hasMore={tweets.length < total-1}
            next={nextFetch}
        >
             {
                tweets?.map((tweet)=>(
                    
                    <Card sx={{mb:1}} variant="outlined" key={tweet._id}>
                        <Box sx={{float:"right"}}>
                            <IconButton
                                onClick={
                                
                                    toggleBottomMenu(true,{
                                        _id: tweet._id,
                                        owner: tweet.owner,
                                    })
                                    
                                }


                            >
                                <MoreVertIcon 
                                    sx={{
                                        fontSize:"24px",
                                        color:"text.fade"
                                    }}
                                />
                            </IconButton>
                        </Box>
                        {
                            tweet.type==="share" && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        ml: 3,
                                        display: "flex",
                                        fontSize: "16px",
                                        color: "text.fade",
                                    }}>
                        
                                    <ShareIcon sx={{fontSize:"18px",p:0,mr:2}} />
                                    <div style={{marginTop:-2}}>share</div>
                                </Box>
                            )
                        }
                        {/* {
                            tweet.type ==="comment" && (
                                <Box
                                sx={{
                                    mt: 2,
                                    ml: 3,
                                    display: "flex",
                                    fontSize: "16px",
                                    color: "text.fade",
                                }}>

                                <ChatBubbleIcon sx={{fontSize:"18px",p:0,mr:2}} />
                                <div style={{marginTop:-2}}>comment</div>
                            </Box>
                            )
                        } */}
                        
                        <CardActionArea
                            onClick={()=>navigate(`/tweet/${tweet._id}`)}
                        >
                            <CardContent sx={{display:"flex",p:2}}>
                                <Box sx={{mr:3}}>
                                    <div>
                                        <Avatar 
                                        alt="Profile Picture"
                                        src={tweet.user[0]?.profile && tweet.user[0].profile }
                                        sx={{width:64,height:64,bgcolor:green[500]}}/>
                                    </div>
                                </Box>
                                <Box>
                                    <Typography sx={{mr:1}} component="span">
                                        <b>{tweet.user[0].name}</b>
                                    </Typography>
                                    <Typography
                                        component="span"
                                        sx={{color:"text.fade"}}
                                    >
                                        @ {tweet.user[0].handle}
                                    </Typography>
                                    <Typography component="span" sx={{ml:1}}>
                                            <small>
                                                {formatRelative(
                                                    parseISO(tweet.created),
                                                    new Date(),
                                                )}
                                            </small>
                                    </Typography>
                                    <Typography
                                        variant='subtitle1'
                                        color="text.secondary"
                                    >
                                        {tweet.body}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </CardActionArea>
                        
                        {/* share for origin tweet */}
                        {
                            tweet.origin_tweet && tweet.origin_tweet[0] && (
                                <Card
                                    sx={{
                                        p: 2,
                                        mx: 3,
                                        my: 2,
                                        bgcolor: "banner.background",
                                    }}
                                >
                                        <CardActionArea>
                                            <CardContent
                                                sx={{display:"flex",p:2}}
                                            >
                                                <Box sx={{mr:3}}>
                                                    <Avatar 
                                                    alt="Profile"
                                                    src={tweet.origin_tweet[0].profile}
                                                    sx={{ width: 48, height: 48 }}/>
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        component="span"
                                                        color="text.secondary"
                                                        sx={{mr:1}}
                                                    >
                                                        <b>{tweet.origin_tweet[0].user[0].name}</b>
                                                    </Typography>
                                                    <Typography
                                                        component="span"
                                                        sx={{color:"text.fade",mr:1}}
                                                    >
                                                        @ {tweet.origin_tweet[0].user[0].handle}
                                                    </Typography>

                                                    <Typography
                                                    variant="body2"
                                                    component="span"
                                                    sx={{ color: "text.fade" }}>
                                                    {formatRelative(
                                                        parseISO(
                                                            tweet.origin_tweet[0]
                                                                .created,
                                                        ),
                                                        new Date(),
                                                    )}
                                                    </Typography>
                                                    <Typography
                                                        color="text.fade"
                                                        variant="subtitle1"
                                                        sx={{ fontSize: "16px" }}>
                                                        {tweet.origin_tweet[0].body}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                </Card>
                            )
                        }
        
                        {
                            tweet.origin && !tweet.origin_tweet[0] && (
                                <Card>
                                        <CardContent
                                            sx={{
                                                p: 2,
                                                mx: 3,
                                                my: 2,
                                                bgcolor: "banner.background",
                                            }}
                                            elevation={0}
                                        >
                                            <Typography
                                                sx={{
                                                    color: "text.fade",
                                                    fontSize: "16px",
                                                }}>
                                                [ deleted post ]
                                            </Typography>
                                        </CardContent>
                                </Card>
                            )
                        }
                        <Box
                            sx={{
                                mb:2,
                                display:"flex",
                                alignItems:"center",
                                justifyContent:"space-around"
                            }}
                        >
                        
                            <ButtonGroup variant='text'>
                                <IconButton
                                    size='small'
                                    disableRipple={true}
                                    sx={{
                                        fontSize:"20px",
                                        color:"text.fade"
                                    }}
                                    onClick={()=>{
                                        
                                        if(authStatus){
                                            
                                            return dispatch(toggleLike({actor:user._id,target:tweet._id}))
                                        }
                                        navigate("/login")
                                    }}
                                >
                                    {
                                    
                                        tweet.likes && 
                                        tweet.likes.includes(user?._id) ?(
                                            <FavoriteIcon
                                            color="error"
                                            sx={{fontSize:"20px"}}
                                        />
                                        ):
                                        tweet.likes && tweet.likes.length ?
                                        (
                                            <FavoriteBorderIcon 
                                                sx={{fontSize:"20px"}}
                                                color="error"
                                            />
                                        ):
                                        (
                                            <FavoriteBorderIcon 
                                                sx={{fontSize:"20px"}}
                                                color="text.fade"
                                            />
                                        )
                                    }
                                    
                                </IconButton>
                                <Button
                                    onClick={()=>{
                                        if(tweet.likes.length > 0){
                                            navigate(`/tweet/${tweet._id}/likes`)
                                        }
                                    }}
                                    size="small"
                                    sx={{
                                        color: "text.fade",
                                        "&:hover": {
                                            backgroundColor: "transparent",
                                        },
                                    }}>
                                    {tweet.likes && tweet.likes.length || 0}
                                </Button>
                            </ButtonGroup>
            
                            <ButtonGroup variant='text'>
                                <IconButton
                                    size='small'
                                    disableRipple={true}
                                    sx={{
                                        fontSize:"20px",
                                        color:"text.fade"
                                    }}
                                    onClick={()=>{
                                        if(authStatus){
                                           return navigate(`/tweet/${tweet._id}/share`)
                                        }
                                        navigate("/login")
                                    }}
                                >
                                    <ShareIcon
                                        color="primary"
                                        sx={{fontSize:"20px"}}
                                    />
                                </IconButton>
                                <Button
                                    onClick={()=>{
                                      if(tweet.shares.length>0){
                                        navigate(`/tweet/${tweet._id}/shares`)
                                      }
                                    }}
                                    size="small"
                                    sx={{
                                        color: "text.fade",
                                        "&:hover": {
                                            backgroundColor: "transparent",
                                        },
                                    }}>
                                    {tweet?.shares && tweet.shares.length ||  0 }
                                </Button>
                            </ButtonGroup>
            
                            <ButtonGroup variant='text'>
                                <IconButton
                                    size='small'
                                    disableRipple={true}
                                    sx={{
                                        fontSize:"20px",
                                        color:"text.fade"
                                    }}
                                    onClick={()=>navigate(`/tweet/${tweet._id}#comment`)}
                                >
                                    <ChatBubbleIcon
                                        color="primary"
                                        sx={{fontSize:"20px"}}
                                    />
                                </IconButton>
                                <Button
                                    
                                    size="small"
                                    sx={{
                                        color: "text.fade",
                                        "&:hover": {
                                            backgroundColor: "transparent",
                                        },
                                    }}>
                                    {tweet.comments && tweet.comments.length || 0}
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Card>
                ))
             }
        </InfiniteScroll>
       
    </div>
  )
}

export default MainList