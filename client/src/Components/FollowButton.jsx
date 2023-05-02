import { Button } from '@mui/material'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { putFollow } from '../apiCall'
import { setFollow, setUser } from '../features/authSlice'
import { useNavigate } from 'react-router-dom'
function FollowButton({fUser}) {
  const user= useSelector((state)=>state.auth.user);
  const dispatch =useDispatch();
  const navigate = useNavigate()
  return  user.followings.includes(fUser._id) ?(
    <Button
      size="small"
      edge="end"
      variant='outlined'
      sx={{borderRadius:5}}
      onClick={()=>{
        (async () => {
					let result = await putFollow({targetId:fUser._id});
					if (!result) navigate("/error");

					dispatch(setFollow(result.followings))
				})();
      }}
    >
      Followed
    </Button>
  ):(
    <Button
    size="small"
    edge="end"
    variant='outlined'
    sx={{borderRadius:5}}
    onClick={()=>{
      (async()=>{
        let result = await putFollow({targetId:fUser._id});
        if (!result) navigate("/error")
        dispatch(setFollow(result.followings))
      })()
    }}
  >
    Following
  </Button>
  )
}

export default FollowButton