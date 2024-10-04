import React, { useEffect,useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import { addComment, fetchSingle, toggleLike } from '../features/appSlice';
import { useParams } from 'react-router-dom';
import {Box, Card, CardContent,Avatar,Typography,IconButton,ButtonGroup,Button, FormControl, Input, InputAdornment, CardActionArea, Divider, Grid,useTheme} from '@mui/material';
import {
	Send as SendIcon,
	Share as ShareIcon,
	MoreVert as MoreVertIcon,
	Favorite as FavoriteIcon,
	ChatBubble as ChatBubbleIcon,
	FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { green } from '@mui/material/colors';
import { formatRelative, parseISO } from "date-fns";
import { addNewReply } from '../apiCall';
import Images from '../Components/Images';
import useMediaQuery from '@mui/material/useMediaQuery';

function Tweet({toggleBottomMenu}) {
    const theme = useTheme()
    const dispatch = useDispatch();
    const {id} = useParams();
    const tweet = useSelector((state)=>state.app?.tweets?.find((t)=>t._id === id));
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Mobile devices
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); 
    const navigate = useNavigate();
    const {authStatus,user} = useSelector((state)=>state.auth);
    useEffect(()=>{
        dispatch(fetchSingle({id}))
    },[id,navigate])
    const input = useRef();
  
  
  return (

    tweet?.user && (
        <Box sx={{my:3,marginX: isMobile || isTablet ? 3 : 'auto',maxWidth:"1200px"}}>
            <Card variant='outlined' key={id} sx={{mb:3}}>
                <CardContent sx={{display:"flex"}}>
                    <Box sx={{flex:1}}>
                        {tweet.type === "share" && (
								<Box
									sx={{
										mb: 2,
										ml: 1,
										display: "flex",
										fontSize: "16px",
										color: "text.fade",
									}}>
									<ShareIcon
										sx={{ fontSize: "18px", p: 0, mr: 2 }}
									/>
									<div style={{ marginTop: -2 }}>share</div>
								</Box>
							)}

							{tweet.type === "comment" && (
								<Box
									sx={{
										mb: 2,
										ml: 1,
										display: "flex",
										fontSize: "16px",
										color: "text.fade",
									}}>
									<ChatBubbleIcon
										sx={{ fontSize: "18px", p: 0, mr: 2 }}
									/>
									<div style={{ marginTop: -2 }}>comment</div>
								</Box>
							)}
                            <Box sx={{ display: "flex" }}>
								<Box sx={{ mr: 3, display: "flex" }}>
									<div
										onClick={e => {
											navigate(
												"/@" + tweet.user[0].handle,
											);
											e.stopPropagation();
										}}>
										<Avatar
											alt="Profile Picture"
                                            src={tweet.user[0]?.profile && tweet.user[0]?.profile}
											sx={{
												width: 64,
												height: 64,
												bgcolor: green[500],
											}}
										/>
									</div>
								</Box>

								<Box>
									<Typography variant="span">
										{tweet.user[0].name}
									</Typography>

									<Typography
										variant="span"
										sx={{ color: "text.fade" }}>
										@{tweet.user[0].handle}
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
                            
                    </Box>
                    <Box>
                        <IconButton
								edge="end"
								onClick={toggleBottomMenu(true, {
									_id: tweet._id,
									owner: tweet.owner,
								})}>
								<MoreVertIcon color="text.fade" />
							</IconButton>
                    </Box>

                </CardContent>
                <CardContent>
						<Typography variant="subtitle1" sx={{ mb: 2,fontSize:20 }}>
							{tweet.body}
						</Typography>

                        <Box sx={{marginTop:2}}>   
                            {          
                                tweet?.images && tweet.images.length> 0 &&(
                                    <Images images={tweet.images} />
                                )
                            }
                        </Box>  
				</CardContent>

                {/* origin post tweet action */}
                <CardContent>
                    <Box
                            sx={{
                                
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
                                          return  dispatch(toggleLike({actor:user._id,target:tweet._id}))
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
                            {
                                tweet.type !== "comment" && (
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
                                            
                                            size="small"
                                            sx={{
                                                color: "text.fade",
                                                "&:hover": {
                                                    backgroundColor: "transparent",
                                                },
                                            }}>
                                            {tweet?.shares && tweet.shares.length || 0}
                                        </Button>
                                     </ButtonGroup>
                                )
                            }
                          

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
                                            return navigate(`/tweet/${tweet._id}#comment`)
                                        }
                                        navigate("/login")
                                    }}
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
                </CardContent>
                    {
                    authStatus && (
                        <Box
                            sx={{
                                p:2,
                                mx:3,
                                pb:3,
                                my:2,
                                bottom:0,
                                position:"sticky",
                                bgcolor:"banner.background"
                            }}
                        >
                            <FormControl fullWidth>
                                <Input
                                    required
                                    inputRef={input}
                                    sx={{fontSize:"16px",py:2}}
                                    placeholder='Your reply'
                                    multiline
                                    fullWidth
                                    variant="standard"
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton onClick={async()=>{
                                                const reply = input.current.value;
                                                
                                                let res =  await addNewReply({reply,id})
                                                if(!res) return navigate("/error")
                                                dispatch(addComment({id,res}))
                                                input.current.value = ""
                                            }}
                                            >
                                                <SendIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Box>
                    )
                    }

                    {/* share for origin_tweet */}
                    {
                        tweet.origin_tweet[0] && (
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
                                                <Avatar alt="Profile"
                                                src={tweet.origin_tweet[0].user[0]?.profile || tweet.origin_tweet[0].user[0]?.profile}
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
                                                    sx={{ fontSize: "20px" }}>
                                                    {tweet.origin_tweet[0].body}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                            </Card>
                        )
                    }
            
            </Card>
            {
                /* Display comment list */
                tweet.comments && (
                    <Card variant='outlined'>
                    <CardContent>
                        {
                            tweet.comments.map((t)=>(
                                    <Box     key={t._id}>
                                        <Card
                                            sx={{
                                            
                                                my:2,
                                                bgcolor:"banner.background"
                                            }}
                                            elevation={0}
                                        
                                        >
                                            <CardActionArea onClick={()=>navigate(`/tweet/${t._id}`)}>
                                                <CardContent sx={{display:"flex",p:2}}>
                                                    <Box sx={{mr:3}}>
                                                        <div>
                                                            <Avatar alt="Profile Picture" 
                                                            src={t.user[0]?.profile || t.user[0]?.profile}
                                                            sx={{width:48,height:48}}/>
                                                        </div>
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            sx={{mr:1}}
                                                            component="span"
                                                            color="text.secondary"
                                                        >
                                                            <b>
                                                                {
                                                                    t.user[0].name
                                                                }
                                                            </b>
                                                        </Typography>
                                                        <Typography
                                                            sx={{mr:1}}
                                                            component="span"
                                                            color="text.fade"
                                                        >
                                                    
                                                            @ {
                                                                    t.user[0].handle
                                                                }
                                                        
                                                        </Typography>
                                                        <Typography
                                                            sx={{mr:1}}
                                                            variant='body2'
                                                            component="span"
                                                            color="text.fade"
                                                        >
                                                    
                                                            {formatRelative(
                                                                parseISO(t.created),
                                                                new Date(),
                                                            )}
                                                        
                                                        </Typography>
                                                        <Typography
                                                            sx={{fontSize:"20px"}}
                                                            variant='subtitle1'
                                                            color="text.fade"
                                                        >
                                                    
                                                            {t.body}
                                                        
                                                        </Typography>
                
                                                        <Box >
                                                            <Typography
                                                                sx={{mr:1}}
                                                                component="span"
                                                                color="text.secondary"
                                                            >
                                                                <b>
                                                                    Replying To
                                                                </b>
                                                            </Typography>
                                                            <Typography
                                                                sx={{mr:1}}
                                                                component="span"
                                                                color="text.fade"
                                                            >
                                                    
                                                            @ {
                                                                    tweet.user[0].handle
                                                                }
                                                        
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </CardActionArea> 
                                        </Card>
                                        {/* comment reaction */}
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
        
                                                        dispatch(toggleLike({actor:user._id,target:t._id}))
                                                    }
                                                }}
                                            >
                                                    {
                                                
                                                    t.likes && 
                                                    t.likes.includes(user?._id) ?(
                                                        <FavoriteIcon
                                                        color="error"
                                                        sx={{fontSize:"20px"}}
                                                        />
                                                    ):
                                                    t.likes && t.likes.length ?
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
                                                
                                                size="small"
                                                sx={{
                                                    color: "text.fade",
                                                    "&:hover": {
                                                        backgroundColor: "transparent",
                                                    },
                                                }}>
                                                {t.likes && t.likes.length || 0}
                                            </Button>
                                        </ButtonGroup>
        
                                        {/* <ButtonGroup variant='text'>
                                            <IconButton
                                                size='small'
                                                disableRipple={true}
                                                sx={{
                                                    fontSize:"20px",
                                                    color:"text.fade"
                                                }}
                                                onClick={()=>{
                                                    if(authStatus){
                                                        navigate(`/tweet/${t._id}/share`)
                                                    }
                                                }}
                                            >
                                                <ShareIcon
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
                                                0
                                            </Button>
                                        </ButtonGroup> */}
        
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
                                                        navigate(`/tweet/${t._id}#comment`)
                                                    }
                                                }}
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
                                                 {t.comments && t.comments.length || 0}
                                            </Button>
                                        </ButtonGroup>
                                        </Box>
                                        <Divider />
                                    </Box>
                            ))
                        }
                            
                     
                    </CardContent>
                     </Card>
                )
            }
           
        </Box>
    )
  )
}

export default Tweet