
import React, { useRef, useState } from 'react'
import { Avatar,Box,Button, Input,Alert } from '@mui/material'
import { postTweet } from '../apiCall';
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setSnackbarOpen } from '../features/uiSlice';
import { addTweet } from '../features/appSlice';
function AddTweet() {
    const input = useRef();
    const [hasError,setHasError] = useState(false);
    const [errMsg,setErrmsg]  = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handlePostTweet = async()=>{
        let res = await postTweet({tweet:input.current.value});
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
            justifyContent:"space-between",
            mb:2
        }}
      >
        <Avatar alt="Profile" />
        <Button
            size="small"
            variant="contained"
            color="success"
            sx={{borderRadius:5}}
            onClick={handlePostTweet}
        >
            Add Post
        </Button>
      </Box>
      <Box>
        <Input 
            inputRef={input}
            placeholder='Enter your tweet'
            multiline
            fullWidth
            minRows={4}
            sx={{fontSize:"16px",py:2}}
        />
      </Box>
   </Box>
  )
}

export default AddTweet