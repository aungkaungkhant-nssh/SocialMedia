import React, { useState } from 'react';
import {
  Card, Box, IconButton, CardActionArea, CardContent, Avatar,
  Typography, ButtonGroup, Button, Divider
} from '@mui/material';
import {
  MoreVert as MoreVertIcon, Share as ShareIcon, ChatBubble as ChatBubbleIcon,
  Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { green } from '@mui/material/colors';
import { formatRelative, parseISO } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLike } from '../features/appSlice';
import { useNavigate } from 'react-router-dom';
import Images from '../Components/Images';
import ImageModal from '../Components/ImageModal';

function MainList({ tweets, toggleBottomMenu,refs,isFetchingNextPage }) {
  const { user, authStatus } = useSelector((state) => state.auth);
  const [previewImages,setPreviewImages] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      {tweets?.map((tweet) => (
        <Card sx={{ mb: 3 }} variant="outlined" key={tweet._id} ref={refs}>
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
          {tweet.type === "share" && (
            <Box sx={{ mt: 2, ml: 3, display: "flex", fontSize: "16px", color: "text.fade" }}>
              <ShareIcon sx={{ fontSize: "18px", p: 0, mr: 2 }} />
              <div style={{ marginTop: -2 }}>share</div>
            </Box>
          )}
          <CardActionArea onClick={() => navigate(`/tweet/${tweet._id}`)}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ mr: 3 }}>
                  <div>
                    <Avatar
                      alt="Profile Picture"
                      src={tweet.user[0]?.profile && tweet.user[0].profile}
                      sx={{ width: 64, height: 64, bgcolor: green[500] }}
                    />
                  </div>
                </Box>
                <Box>
                  <Typography sx={{ mr: 1, fontSize: 18 }} component="span">
                    <b>{tweet.user[0].name}</b>
                  </Typography>
                  <Typography component="span" sx={{ color: "text.fade" }}>
                    @ {tweet.user[0].handle}
                  </Typography>
                  <Typography component="h3">
                    <small>
                      {formatRelative(parseISO(tweet.created), new Date())}
                    </small>
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ marginY: 2 }}>
                <Typography variant='span' color="text.secondary" sx={{ fontSize: 20 }}>
                  {tweet.body}
                </Typography>
                {
                  tweet?.images && (
                    <Box sx={{ marginTop: 2, width: "100%" }} onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImages(tweet.images);
                    }}>
                      { tweet.images.length > 0 && (
                        <Images images={tweet.images} />
                      )}
                    </Box>
                  )
                }
               
              </Box>
            </CardContent>
          </CardActionArea>
          <Divider sx={{ my: 1 }} />
          {tweet.origin_tweet && tweet.origin_tweet[0] && (
            <Card sx={{ p: 2, mx: 3, my: 2, bgcolor: "banner.background" }}>
              <CardActionArea onClick={()=>navigate(`/tweet/${tweet.origin_tweet[0]._id}`)}>
                <CardContent>
                  <Box sx={{ mr: 3, display: "flex", gap: 2 }}>
                    <Avatar
                      alt="Profile"
                      src={tweet.origin_tweet[0].user[0].profile}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                      <Box>
                        <Typography component="span" color="text.secondary" sx={{ mr: 1, fontSize: 18 }}>
                          <b>{tweet.origin_tweet[0].user[0].name}</b>
                        </Typography>
                        <Typography component="span" sx={{ color: "text.fade", mr: 1 }}>
                          @ {tweet.origin_tweet[0].user[0].handle}
                        </Typography>
                      </Box>
                      <Typography variant="body2" component="span" sx={{ color: "text.fade" }}>
                        {formatRelative(parseISO(tweet.origin_tweet[0].created), new Date())}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ marginY: 2 }}>
                    <Typography color="text.fade" variant="subtitle1" sx={{ fontSize: "16px" }}>
                      {tweet.origin_tweet[0].body}
                    </Typography>
                    <Box sx={{ marginTop: 2 }}>
                      {tweet.origin_tweet[0].images && tweet.origin_tweet[0].images.length > 0 && (
                         <Box sx={{ marginTop: 2, width: "100%" }} onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImages(tweet.origin_tweet[0].images);
                        }}>
                            <Images images={tweet.origin_tweet[0].images} />
                        </Box>
                    
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          )}
          {tweet.origin && !tweet.origin_tweet[0] && (
            <Card>
              <CardContent sx={{ p: 2, mx: 3, my: 2, bgcolor: "banner.background" }} elevation={0}>
                <Typography sx={{ color: "text.fade", fontSize: "16px" }}>
                  [ deleted post ]
                </Typography>
              </CardContent>
            </Card>
          )}
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
            <ButtonGroup variant='text'>
              <IconButton
                size='small'
                disableRipple={true}
                sx={{ fontSize: "25px", color: "text.fade" }}
                onClick={() => {
                
                  if (authStatus) {
                  
                    dispatch(toggleLike({ actor: user._id, target: tweet._id }))
                    return
                  }
                  navigate("/login")
                }}
              >
                {tweet.likes && tweet.likes.includes(user?._id) ? (
                  <FavoriteIcon color="error" sx={{ fontSize: "25px" }} />
                ) : tweet.likes && tweet.likes.length ? (
                  <FavoriteBorderIcon sx={{ fontSize: "25px" }} color="error" />
                ) : (
                  <FavoriteBorderIcon sx={{ fontSize: "25px" }} color="text.fade" />
                )}
              </IconButton>
              <Button
                onClick={() => {
                  if (tweet.likes.length > 0) {
                    navigate(`/tweet/${tweet._id}/likes`)
                  }
                }}
                size="small"
                sx={{ color: "text.fade", "&:hover": { backgroundColor: "transparent" } }}
              >
                {tweet.likes && tweet.likes.length || 0}
              </Button>
            </ButtonGroup>
            <ButtonGroup variant='text'>
              <IconButton
                size='small'
                disableRipple={true}
                sx={{ fontSize: "25px", color: "text.fade" }}
                onClick={() => {
                  if (authStatus) {
                    return navigate(`/tweet/${tweet._id}/share`)
                  }
                  navigate("/login")
                }}
              >
                <ShareIcon color="primary" sx={{ fontSize: "25px" }} />
              </IconButton>
              <Button
                onClick={() => {
                  if (tweet.shares.length > 0) {
                    navigate(`/tweet/${tweet._id}/shares`)
                  }
                }}
                size="small"
                sx={{ color: "text.fade", "&:hover": { backgroundColor: "transparent" } }}
              >
                {tweet?.shares && tweet.shares.length || 0}
              </Button>
            </ButtonGroup>
            <ButtonGroup variant='text'>
              <IconButton
                size='small'
                disableRipple={true}
                sx={{ fontSize: "25px", color: "text.fade" }}
                onClick={() => navigate(`/tweet/${tweet._id}#comment`)}
              >
                <ChatBubbleIcon color="primary" sx={{ fontSize: "25px" }} />
              </IconButton>
              <Button
                size="small"
                sx={{ color: "text.fade", "&:hover": { backgroundColor: "transparent" } }}
              >
                {tweet.comments && tweet.comments.length || 0}
              </Button>
            </ButtonGroup>
          </Box>
        </Card>
      ))}
      {
        previewImages && <ImageModal open={!!previewImages} handleClose={()=>setPreviewImages(null)} previewImages={previewImages}/>
      }
      {isFetchingNextPage && <Box sx={{textAlign:"center"}}>Loading more...</Box>}
      <div style={{marginTop:"100px"}}  ref={refs}></div>
    </>
  );
}

export default MainList;
