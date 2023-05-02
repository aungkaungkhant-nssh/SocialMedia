import React, { useEffect, useState } from 'react'
import {Avatar, Box, List, ListItem, ListItemAvatar,ListItemText} from '@mui/material'
import {Link,useParams,useNavigate} from 'react-router-dom'
import { fetchLikes } from '../apiCall';
import FollowButton from '../Components/FollowButton';
function Likes() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [likes,setLikes] = useState([])
    useEffect(()=>{
        (async()=>{
            let res = await fetchLikes({id});
            
            if(!res)return  navigate("/error")
            setLikes(res)
        })()
    },[])
   
  return (
    <Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
        <List>
            
            {
               likes.length > 0 && likes.map((like)=>(
                    <ListItem
                    key={like._id}
                    secondaryAction={
                        <FollowButton fUser={like}/>
                    }
                    >
                        <ListItemAvatar>
                            <Link to={`/${like.handle}`}>
                                <Avatar alt="Profile"
                                src={like?.profile && like?.profile}
                                ></Avatar>
                            </Link>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${like.name} @ ${like.handle}`}
                           
                        />
                    </ListItem>
               ))
            }
        
        </List>
    </Box>
  )
}

export default Likes