import { Typography,Button,Box } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
function Error() {
    const navigate = useNavigate()
  return (
    <Box sx={{my:3,mx: { lg: 20, md: 5, sm: 5, xs: 3 }}}>
        <Typography sx={{mb:2}} variant='h3' >
             Oops!
        </Typography>
        Something went wrong.See console for more information
        <Button
				sx={{ ml: 2 }}
				onClick={() => {
					navigate("/");
				}}>
				Go Back
			</Button>
    </Box>
  )
}

export default Error