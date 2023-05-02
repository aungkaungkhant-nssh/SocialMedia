import React, { useEffect, useState } from 'react'
import { useParams ,useNavigate,Link} from 'react-router-dom'
import { fetchShares } from '../apiCall';
import {Avatar, List, ListItem, ListItemAvatar, ListItemText,Box} from '@mui/material'
import FollowButton from '../Components/FollowButton';
function Shares() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [shares,setShares] = useState([])
  useEffect(()=>{
    (async()=>{
      let res = await fetchShares({id})
      if(!res) return navigate("/error")
      setShares(res)
    })()
  },[])
  return (
    <Box sx={{my:3,mx:{lg:20,md:5,sm:5,xs:3}}}>
        <List>
            {
              shares.map((share)=>{
                return(
                  <ListItem key={share._id}
                    secondaryAction={
                      <FollowButton 
                        fUser={share.user[0]}
                      />
                    }
                  >
                      <ListItemAvatar>
                          <Link
                            to={`/${share.user[0].handle}`}
                          >
                              <Avatar alt="Profile"
                                src={share?.user[0].profile && share?.user[0].profile}
                                ></Avatar>
                          </Link>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          share.user[0].name+
                          " @"+
                          share.user[0].handle
                        }
                        secondary={share.body}
                      >

                      </ListItemText>
                  </ListItem>
                )
              })
            }
        </List>
    </Box>
  )
}

export default Shares