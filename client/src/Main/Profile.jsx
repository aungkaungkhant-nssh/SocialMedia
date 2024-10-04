import React, { useEffect, useState } from 'react'
import {Avatar, Box, Button, Tabs,Tab, Typography, MenuList} from '@mui/material'
import { lightBlue, pink } from '@mui/material/colors'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchCommentByHandle, fetchTweetByHandle, fetchUserByHandle,putFollow ,fetchLikeByHandle} from '../apiCall'
import { useDispatch } from 'react-redux'
import { setFollow } from '../features/authSlice'
import MainList from './MainList'

function Profile({toggleBottomMenu}) {
  const {user,authStatus} = useSelector((state)=>state.auth);
  const navigate = useNavigate();
  const [tab,setTab] = useState(0);
  const [handleSearchUser,setHandleSearchUser] = useState({});
  const [tweets,setTweets] = useState({
                                      tweet:[],
                                      count:0,
                                      page:0,
                                      total:0
                              });
  const [comments,setComments] = useState({
                      comment:[],
                      count:0,
                      page:0,
                      total:0
  });
  const [likes,setLikes] = useState({
                    like:[],
                    count:0,
                    page:0,
                    total:0
  })
  const dispatch = useDispatch();
  const [hoverText,setHoverText]  = useState(false);
  const tabChange=(event,switchTab)=>{
    setTab(switchTab)
  }
  const {handle}= useParams();

  const handleFetchTweet = async(pg)=>{
    
    let {tweet,count,page,total}= await fetchTweetByHandle({handle,page:pg});
    if(!tweet) return navigate("/error");
    setTweets({tweet:[...tweets.tweet,...tweet],count,page,total})
  }
  const handleFetchComment = async(pg)=>{
      let {comment,count,page,total} = await fetchCommentByHandle({handle,page:pg});
      if(!comment) return navigate("/error");
       setComments({comment:[...comments.comment,...comment],count,page,total})
  }

  const handleFetchLike = async(pg)=>{
    let {like,count,page,total} = await fetchLikeByHandle({handle,page:pg});
   
    if(!like) return navigate("/error");
    setLikes({like:[...likes.like,...like],count,page,total})
  }
  useEffect(()=>{
    (async()=>{
      let res  = await fetchUserByHandle({handle});
      if(!res)  return navigate("/error")
      setHandleSearchUser(res)

      await  handleFetchTweet(0);
      await handleFetchComment(0)
      await handleFetchLike(0);

     
    })()
   
  },[handle,navigate]); 
  

  return (
    <Box sx={{my:3,mx:{lg:20,md:5,sm:5,xs:3}}}>
        <Box>
          <Box 
            sx={{
              height:"140px",
              bgcolor:lightBlue[500]
            }}
          />
          <Box
            sx={{display:"flex",justifyContent:"space-between"}}
          >
              <Box sx={{mt:"-50px",ml:"20px"}}>
                <Avatar
                  alt="Profile"
                  src={handleSearchUser?.profile && handleSearchUser?.profile}
                  sx={{
                    mb:1,
                    width:96,
                    height:96,
                    bgcolor:pink[500]
                  }}
                />
                <Box>
                  <Typography
                    sx={{fontSize:"1.2em",mb:"-5px"}}
                  >
                    <b>{handleSearchUser && handleSearchUser.name}</b>
                  </Typography>
                  <Typography
                    sx={{color:"text.fade",mb:1}}
                  >
                   @ {handleSearchUser && handleSearchUser.handle}
                  </Typography>
                  <>
                    <Typography
                      component="span"
                      sx={{mr:3,fontSize:14,color:"text.fade"}}
                    >
                      <Link to={`/user/${handleSearchUser.handle}/followings`}>
                        {
                          handleSearchUser.followings ? handleSearchUser.followings.length  : 0
                        }
                        {" "}
                       Following
                      </Link>
                    </Typography>
                    <Typography
                      component="span"
                      sx={{mr:3,fontSize:14,color:"text.fade"}}
                    >
                      <Link to={`/user/${handleSearchUser.handle}/followers`}>
                        {
                          handleSearchUser.followers ? handleSearchUser.followers.length  : 0
                        }
                        {" "}
                        Followers
                      </Link>
                    </Typography>
                  </>
                </Box>
              </Box>
              <Box sx={{pt:2}}>
                {
                  user?.handle===handle? (
                    <Button
                    size='small'
                    color="info"
                    variant="outlined"
                    sx={{borderRadius:5}}
                    onClick={()=>navigate("/editProfile")}
                    >
                    Edit Profile
                    </Button>
                  ):handleSearchUser.followers &&
                  handleSearchUser.followers.includes(user._id)
                  ?(
                    <Button
                      size="small"
                      color="info"
                      variant='outlined'
                      sx={{borderRadius:5}}
                      onMouseEnter={()=>setHoverText(true)}
                      onMouseLeave={()=>setHoverText(false)}
                      onClick={()=>{
                        (async()=>{
                          if(!authStatus)  return  navigate("/login");
                          let res  = await putFollow({targetId:handleSearchUser._id});
                          if(!res) return navigate("/error")
                          dispatch(setFollow(res.followings))
                          let followers = handleSearchUser.followers.filter((f)=>f!=user._id)
                          setHandleSearchUser({...handleSearchUser,followers})
                        })()
                      }}
                    >
                    {hoverText ? 'UnFollow' :"Following"}
                    </Button>
                  ):(
                    <Button
                      size="small"
                      color="info"
                      variant='outlined'
                      sx={{borderRadius:5}}
                      onClick={()=>{
                        (async()=>{
                          if(!authStatus) return navigate("/login");
                          let res  = await putFollow({targetId:handleSearchUser._id});
                          if(!res) return navigate("/error")
                          dispatch(setFollow(res.followings))
                          let followers = [...handleSearchUser.followers,user._id];
                          setHandleSearchUser({...handleSearchUser,followers})
                        })()
                      }}
                    >
                      Follow
                    </Button>
                  )
                }
                
              </Box>
          </Box>

          <Box sx={{borderBottom:1,borderColor:"divider"}}>
            <Tabs
             value={tab}
             onChange={tabChange}
             variant= "fullWidth"
             TabIndicatorProps={{style:{background:lightBlue[500]}}}
            >
              <Tab label="Posts" />
              <Tab label="Comments" />
              <Tab label="Likes" />
            </Tabs>
          </Box>
          <Box hidden={tab!== 0} sx={{py:4}}>
                <MainList 
                  tweets={tweets?.tweet ||0}
                  toggleBottomMenu={toggleBottomMenu}
                  count={tweets?.count || 0}
                  page={tweets?.page || 0}
                  total={tweets?.total || 0}
                  nextFetch={()=>handleFetchTweet(tweets?.page+1)}
                  
                />
          </Box>
          <Box hidden={tab!== 1} sx={{py:4}}>
                <MainList 
                  tweets={comments?.comment || 0}
                  toggleBottomMenu={toggleBottomMenu}
                  count={comments?.count || 0}
                  page={comments?.page || 0}
                  total={comments?.total || 0}
                  nextFetch={()=>handleFetchComment(comments?.page+1)}
                />
          </Box>
          <Box hidden={tab!==2} sx={{py:4}}>
                <MainList 
                  tweets={likes?.like || 0}
                  toggleBottomMenu={toggleBottomMenu}
                  count={likes?.count || 0}
                  page={likes?.page || 0}
                  total={likes?.total || 0}
                  nextFetch={()=>handleFetchLike(likes?.page+1)}
                />
          </Box>
        </Box>

    </Box>
  )
}

export default Profile