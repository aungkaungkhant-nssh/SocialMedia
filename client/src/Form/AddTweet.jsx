
import React, { useRef, useState } from 'react'
import { Avatar,Box,Button, Input,Alert, IconButton, Divider,ClickAwayListener,CircularProgress, } from '@mui/material'

import { postTweet } from '../apiCall';
import {useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbarOpen } from '../features/uiSlice';
import { addTweet } from '../features/appSlice';
import {
  Collections as CollectionsIcon,
  Cancel as CancelIcon,
  Mood as MoodIcon
} from '@mui/icons-material';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import axios from 'axios';

function AddTweet() {
    const {user} = useSelector((state)=> state.auth)
    const input = useRef();
    const emojiRef = useRef();
    const fileInputRef = useRef(null);
    const [hasError,setHasError] = useState(false);
    const [showEmojiPicker,setShowEmojiPicker] = useState(false);
    const [errMsg,setErrmsg]  = useState("");
    const [previewImages,setPreviewImages] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handlePostTweet = async()=>{
        setIsLoading(true);
        let images = [];
        if(previewImages.length>0){
          const previewImagePromise =  previewImages.map(async(previewImage)=>{
            const data = new FormData();
            data.append("file",previewImage)
            data.append("upload_preset","twitterPj");
            data.append("cloud_name","dqlplxvtx");
            const result = await axios.post("https://api.cloudinary.com/v1_1/dqlplxvtx/image/upload",data);

            console.log(result.data)
            return {
              public_id:result.data.public_id,
              imageUrl : result.data.url,
              width: result.data.width,
              height: result.data.height
            }
          })
          images = await Promise.all(previewImagePromise)
        }
       
        let res = await postTweet({tweet:input.current.value,images});
        setIsLoading(false);
        if(res.status === 400) {
          setHasError(true)
          return setErrmsg(res.data.message)
        } 
        if(res.status === 500){
          return navigate("/error")
        }

        dispatch(addTweet(res))
        dispatch(setSnackbarOpen(true));
        navigate("/")
    }
   
    const handleEmojiClick = () => {
      setShowEmojiPicker((prev) => !prev);
    };
  
    const handleClickAway = () => {
      setShowEmojiPicker(false);
    };

    const handleFileChange = (event) => {
      const files = Array.from(event.target.files);
      if (files.length) {
        const fileUrls =  files.map((file)=>file)
        setPreviewImages([...previewImages,...fileUrls])
       
      }
    };
 
  return (
   <Box  sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
      {
            hasError && (
                <Alert sx={{mb:3}} severity="warning">
                    {errMsg}
                </Alert>
            )   
        }
      <Box
        sx={{
            display:"flex",
            gap:2,
            alignItems:'flex-start',
         
        }}
      >
        <Avatar alt="Profile"  sx={{width:60,height:60 }}   src={user?.profile && user?.profile}/>
        <Box sx={{width:"100%"}}>
            <Input 
                fullWidth
                inputRef={input}
                placeholder='What is happening?'
                sx={{
                  fontSize: '25px',
               
                  borderBottom: 'none',
                  '&:before': {
                    borderBottom: 'none',
                  },
                  '&:after': {
                    borderBottom: 'none',
                  },
                  '&:hover:not(.Mui-disabled):before': {
                    borderBottom: 'none',
                  },
                }}
            />
            {
              previewImages.length>0 && (
                <Box sx={{display:"flex",marginTop:4}}>
                  {
                    previewImages.map((image,index)=>(
                      <Box sx={{position:"relative",marginX:1,width:500}}>
                        <img src={URL.createObjectURL(image)} alt="" style={{width:"100%"}} />
                        <IconButton sx={{position:"absolute",top:0,right:0}} onClick={()=>{
                          const filterImages = previewImages.filter((pi,piindex)=> piindex !== index);
                          setPreviewImages(filterImages)
                        }}>
                            <CancelIcon sx={{color:"logo.color"}}/>
                        </IconButton>
                      </Box>
                    ))
                  }
                  
               </Box>
              )
            }
          
           

            <Divider sx={{marginY:2}}/>

            <Box sx={{display:"flex", justifyContent:"space-between",alignItems:"flex-start"}}>
                <Box sx={{display:"flex"}}>
                    <IconButton   color="inherit" onClick={()=>fileInputRef.current.click()}>
                        <CollectionsIcon sx={{fontSize:25}} />
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                        />
                    </IconButton>
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <Box sx={{ position: 'relative' }}>
                          <IconButton
                            sx={{ marginX: 3 }}
                            color="inherit"
                            onClick={handleEmojiClick}
                          >
                            <MoodIcon sx={{ fontSize: 25 }} />
                          </IconButton>
                          {showEmojiPicker && (
                            <Box
                              ref={emojiRef}
                              sx={{
                                position: 'absolute',
                                zIndex: 1,
                              }}
                            >
                              <Picker
                                data={data}
                                onEmojiSelect={(emj) => {
                                  input.current.value += emj.native;
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                    </ClickAwayListener>
                </Box>

                 <Button
                    size="large"
                    variant="contained"
                    color="info"
                    sx={{borderRadius:5}}
                    onClick={handlePostTweet}
                    startIcon={isLoading && <CircularProgress size={20} sx={{color:"black",width:"100%"}}/> }
                 >
                    Add Post
                 </Button> 

              
            </Box>

        </Box>

      
       
      </Box>
   </Box>
  )
}

export default AddTweet

