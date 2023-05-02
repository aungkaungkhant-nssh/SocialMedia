import React, { useState } from 'react'
import {Avatar, Box,Button,IconButton,OutlinedInput,Typography,CircularProgress} from '@mui/material'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../apiCall';
import { setUser } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import {
    PhotoCamera as PhotoCameraIcon, TrainRounded
} from "@mui/icons-material"
import { grey, pink } from '@mui/material/colors';
import axios from 'axios';

function EditUser() {
    const nameInput  = useRef();
    const [loading,setLoading] = useState(false)
    const passwordInput = useRef();
    const {user} = useSelector((state)=> state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [imageUrl,setImageUrl] = useState("");
    const [userProfile,setUserProfile] = useState("");
  return (
    <Box
        sx={{my:3,mx:{lg:20,md:5,sm:5,xs:3}}}
    >
        <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
				Edit Profile
		</Typography>
        {
            Object.keys(user).length >0 && (
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    setLoading(TrainRounded)
                    const name = nameInput.current.value;
                    const password = passwordInput.current.value;
                 
                    (async()=>{
                        let photo;
                       
                        if(userProfile){
                            const data = new FormData();
                            data.append("file",userProfile)
                            data.append("upload_preset","twitterPj");
                            data.append("cloud_name","dqlplxvtx");
                            photo = await axios.post("https://api.cloudinary.com/v1_1/dqlplxvtx/image/upload",data)
                           
                        }
                     
                        let res = await updateProfile({name,password,id:user._id,profile:photo?.data.url || ""});
                        setLoading(false)
                        if(!res) return navigate("/error")
                        dispatch(setUser(res));
                        navigate(`/${res.handle}`)
                        
                        
                      
                    })()
                }}>
                        <Box
                          sx={{
                            position:"relative",
                            width:"120px",
                            height:"120px",
                            mb:3
                          }}
                        >

                            <Avatar 
                                 alt="Profile"
                                 src={imageUrl ? imageUrl  : user.profile }
                                 sx={{
                                     mb: 3,
                                     width: "100%",
                                     height:"100%",
                                     bgcolor: pink[500],
                                     opacity:0.3
                                 }}
                            />
                            <input type="file"
                            style={{display:"none"}}
                            id="chooseImage"
                            onChange={(e)=>{
                              setUserProfile(e.target.files[0])
                              setImageUrl(URL.createObjectURL(e.target.files[0]))
                            }}
                            />
                
                            <label htmlFor="chooseImage" >   
                                <PhotoCameraIcon 
                                        sx={{
                                        position:"absolute",
                                        top:"35%",
                                        left:"35%",
                                        fontSize:"35px",
                                        cursor:"pointer"
                                        
                                    }}
                                />
                            </label>
                           
                        </Box>
                        <OutlinedInput 
                            required
                            inputRef={nameInput}
                            placeholder='Name'
                            fullWidth={true}
                            sx={{mb:2}}
                            defaultValue={user.name}
                        />
                    
                        <OutlinedInput 
                          
                            inputRef={passwordInput}
                            placeholder="Password (leave blank to unchange)"
                            fullWidth={true}
                            sx={{mb:3}}
                            inputProps={{type:"password"}}
                        />
                        <Button
                            color="info"
                            type="submit"
                            fullWidth={true}
                            variant='contained'
                        >
                            {
                                loading ? <CircularProgress color="inherit" size={20} />
                                : "Update"
                            }
                        </Button>
                </form>
            )
        }
      
    </Box>
  )
}

export default EditUser