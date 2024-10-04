import React, { useEffect, useRef, useState } from 'react'
import {Box,InputAdornment,OutlinedInput,Typography,Button, Alert, CircularProgress} from '@mui/material'
import { userLogin } from '../apiCall';
import {useDispatch} from 'react-redux';
import { checkAuth, setAuthStatus, setUser } from '../features/authSlice';
import {useNavigate,useSearchParams} from 'react-router-dom'
import {Google as GoogleIcon } from '@mui/icons-material'

function Login() {
  const handleInput = useRef();
  const passwordInput = useRef();
  const [errMsg,setErrMsg] = useState("");
  const [hasError,setHasError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    let id=searchParams.get("id")
    let token = searchParams.get("token");
  
    if(id && token){
        localStorage.setItem("token",token);
        dispatch(checkAuth({}))
        navigate("/")
    }
  },[])
  const handleUserLogin= async(e)=>{
    e.preventDefault();
    setLoading(true)
    let handle = handleInput.current.value;
    let password =  passwordInput.current.value;

    const result=  await userLogin({handle,password})
    setLoading(false)
    if(result===403){
        setHasError(true)
        setErrMsg("Handle or password incorrect");
        return
    }
    
    dispatch(setAuthStatus(true));
    dispatch(setUser(result.user));
   
    navigate("/");
  }

  return (
    <Box sx={{my:3,mx:{lg:20,md: 5, sm: 5, xs: 3 }}}>
        <Typography variant="h4" sx={{textAlign:"center",mb:3}}>
            Login
        </Typography>
        {
            hasError && (
                <Alert sx={{mb:3}} severity="warning">
                    {errMsg}
                </Alert>
            )   
        }
       
        <form
            onSubmit={handleUserLogin}
        >
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
                    style={{padding:10,fontSize:17}}
                >
                   {
                    loading ? <CircularProgress color='inherit' size={20} />
                    : "Login"
                   }
                </Button>
                <form action="http://localhost:8000/google"
                >
                    <Button 
                        startIcon={<GoogleIcon />} fullWidth sx={{mt:2}}
                        type='submit'
                        style={{padding:10,fontSize:17}}
                    >
                    Login With Google
                </Button>
                </form>
                
                {/* <GoogleLogin 
                    clientId='397013075049-1lerubd5s9hrhqg7i62s4lq9v2c7p1j9.apps.googleusercontent.com'
                    buttonText='login'
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={"single_host_origin"}
                    isSignedIn = {true}
                /> */}
        </form>
    </Box>
  )
}

export default Login