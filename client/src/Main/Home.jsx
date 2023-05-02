import React, { useEffect } from 'react'
import {Box} from '@mui/material'
import MainList from './MainList'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatest } from '../features/appSlice';

function Home({toggleBottomMenu,count,page,total}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {tweets,status} = useSelector((state)=>state.app)

  useEffect(()=>{
   
        dispatch(fetchLatest({page:0}))
      
  },[navigate])

  return (
    <Box sx={{my:3,mx:{lg:20,md:5,sm:5,xs:3}}}>
      {
        status === "idle" && (
          <MainList tweets = {tweets} toggleBottomMenu = {toggleBottomMenu} 
            count={count}
            nextFetch={()=>dispatch(fetchLatest({page:page+1}))}
            page={page}
            total={total}
          />
        )
      }
      
    </Box>
  )
}

export default Home