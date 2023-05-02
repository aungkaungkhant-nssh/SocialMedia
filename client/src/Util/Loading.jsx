import React from 'react'
import { Box, CircularProgress } from '@mui/material'
function Loading() {
  return (
    <Box
        sx={{
            position:"absolute",
            top:"45%",
            left:"55%",
            zIndex:99999
        }}
    >
    
        <CircularProgress color="success" size={80} />
    </Box>
  )
}

export default Loading