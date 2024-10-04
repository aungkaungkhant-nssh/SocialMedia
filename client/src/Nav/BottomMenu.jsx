import React from 'react'
import {Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material'
import {
    Flag as FlagIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useSelector,useDispatch } from 'react-redux';
import { destroyTweet } from '../apiCall';
import {useNavigate,useLocation} from 'react-router-dom'
import { removeTweet } from '../features/appSlice';
import axios from 'axios';
import CryptoJS from 'crypto-js'
function MenuList ({tweetIdOwner,toggleBottomMenu}){ 
    const navigate =useNavigate();
    const dispatch = useDispatch();
    const location =  useLocation();
    const {user} = useSelector((state)=>state.auth);
    const handleDeleteTweet = async()=>{
         let res = await destroyTweet({id:tweetIdOwner._id});

        if(!res) return;
        if(res.images.length>0){
            res.images.map(async(image)=>{
                const formData = new FormData();
                const timestamp = Math.floor(Date.now() / 1000);
                const cryptoData = `public_id=${image.public_id}&timestamp=${timestamp}GTc1rDOnTJNvuGhFOet8mQqyXR4`
                const signature = CryptoJS.SHA1(cryptoData).toString();
                
                formData.append('public_id', image.public_id)
                formData.append('signature', signature)
                formData.append('api_key', "155384521176819")
                formData.append('timestamp', timestamp.toString())
                
                await axios.post(`https://api.cloudinary.com/v1_1/dqlplxvtx/image/destroy`,formData)
            })
        }
        dispatch(removeTweet({_id:res._id}))
        if(location.pathname!=="/") navigate(-1)
       
        return toggleBottomMenu(false)
       
    
    }
    return(
        <Box
            onClick={toggleBottomMenu(false)}
        >
            <List>
                <ListItem>
                    <ListItemButton>
                        <ListItemIcon>
                            <FlagIcon />
                        </ListItemIcon>
                        <ListItemText primary="report" />
                    </ListItemButton>
                </ListItem>
                {
                   tweetIdOwner && user._id===tweetIdOwner.owner && (
                    <ListItem>
                        <ListItemButton onClick={handleDeleteTweet}>
                            <ListItemIcon>
                                <DeleteIcon color="error" />
                            </ListItemIcon>
                            <ListItemText primary="Delete Tweet" />
                        </ListItemButton>
                    </ListItem>
                   )
                }
            </List>
        </Box>
    )
}
function BottomMenu({tweetIdOwner,toggleBottomMenu,bottomMenuState}) {
  return (
   <>
        <Drawer
            anchor='bottom'
            open={bottomMenuState}
            onClose={toggleBottomMenu(false)}
        >
            <MenuList  tweetIdOwner={tweetIdOwner} toggleBottomMenu={toggleBottomMenu}/>
        </Drawer>
   </>
  )
}

export default BottomMenu