import React, { useEffect, useState } from 'react'
import {Avatar, Box,List, ListItem, ListItemAvatar, ListItemText} from '@mui/material'
import {Link, useParams} from 'react-router-dom'
import { fetchUserByHandle } from '../apiCall'
import FollowButton from '../Components/FollowButton';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
function Followings() {
    const {handle}= useParams();
    const [followingUsers,setFollowingUsers] = useState([]);
    const navigate = useNavigate();
    const {authStatus} = useSelector((state)=>state.auth)
    useEffect(()=>{
        (async()=>{
            if(!authStatus) return navigate("/login");
           let res =  await fetchUserByHandle({handle});
           if(!res) return navigate("/error")
            setFollowingUsers(res.following_users)
        })()
    },[handle])

  return (
   <Box sx={{my:3,mx:{lg:20,md:5,sm:5,xs:3}}}>
        {
            followingUsers.length > 0 && (
                <List>
                {
                        followingUsers?.map((f)=>(
                            <ListItem key={f._id}
                                secondaryAction={
                                    <FollowButton
                                        fUser = {f}
                                    />
                                }
                            >
                                <ListItemAvatar>
                                    <Link to="/">
                                        <Avatar alt="Profile" />
                                    </Link>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={f.name+"@"+f.handle}
                                    secondary=""
                                />
                            </ListItem>
                        ))
                    }
                
            </List>
            )
        }
       
   </Box>
  )
}

export default Followings