import React, { useRef, useState } from 'react'
import {Box,InputAdornment,OutlinedInput,Typography,Button, Alert,CircularProgress} from '@mui/material'
import { userRegister } from '../apiCall';
import {useDispatch} from 'react-redux';
import { setAuthStatus, setUser } from '../features/authSlice';
import {useNavigate} from 'react-router-dom'
function Register() {
  const nameInput = useRef();
  const handleInput = useRef();
  const passwordInput = useRef();
  const [errMsg,setErrMsg] = useState("");
  const [loading,setLoading] = useState(false)
  const [hasError,setHasError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUserRegister= async(e)=>{
    e.preventDefault();
    setLoading(true)
    let name = nameInput.current.value;
    let handle = handleInput.current.value;
    let password =  passwordInput.current.value;

    const result=  await userRegister({name,handle,password})

    setLoading(false)
    if(result===402){
        setHasError(true)
        setErrMsg("Password must be greater than 8 and less than 16");
        return
    }
    dispatch(setAuthStatus(true));  
    dispatch(setUser(result.user));

    navigate("/");
  }

  return (
    <Box sx={{my:3,mx:{lg:20,md: 5, sm: 5, xs: 3 }}}>
        <Typography variant="h4" sx={{textAlign:"center",mb:3}}>
            Register
        </Typography>
        {
            hasError && (
                <Alert sx={{mb:3}} severity="warning">
                    {errMsg}
                </Alert>
            )   
        }
       
        <form
            onSubmit={handleUserRegister}
        >
                
                <OutlinedInput
					required
					inputRef={nameInput}
					placeholder="Name"
					fullWidth={true}
					sx={{ mb: 2 }}
				/>
                 <OutlinedInput
					required
					inputRef={handleInput}
					placeholder="Handle"
					fullWidth={true}
                    inputProps={{pattern:"[a-zA-Z-0-9_]+"}}
					sx={{ mb: 2 }}
                    startAdornment={
                        <InputAdornment  position="start">@</InputAdornment>
                    }
				/>
                <OutlinedInput 
                    // required
                    inputRef={passwordInput}
                    placeholder="Password"
                    fullWidth={true}
                    inputProps={{type:"password"}}
                    sx={{mb:3}}
                />
                <Button
                    color="info"
                    type="submit"
                    fullWidth={true}
                    variant="contained"
                    disabled={loading}
                >
                    {
                        loading ? <CircularProgress color='inherit' size={20} />
                        : "Register"
                    }
                </Button>
        </form>
    </Box>
  )
}

export default Register