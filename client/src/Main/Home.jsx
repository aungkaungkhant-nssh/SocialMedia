import React from 'react';
import { Box, useTheme } from '@mui/material';
import MainList from './MainList';
import { useDispatch, useSelector } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchTweets } from '../apiCall';
import Loading from '../Util/Loading';
import { useInView } from 'react-intersection-observer';
import { setTweets } from '../features/appSlice';
function Home({ toggleBottomMenu }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { tweets }= useSelector((state)=>state.app)
  const dispatch = useDispatch();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['tweets'],
    queryFn: async({ pageParam }) => { 
      const data=  await fetchTweets({ pageParam });
      console.log(data.tweets)
      const result = [...tweets,...data.tweets].flatMap((data) => data)
      .filter(
        (tweet, index, self) =>
          index === self.findIndex((t) => t._id === tweet._id)
      );
      delete data.tweets
      dispatch(setTweets({tweets:result,...data}))
      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    }
    
  });
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 1.0,
    onChange: (inView) => {
      if (inView && hasNextPage) {
        fetchNextPage();
      }
    },
  })
  

  if(isLoading) return <Loading />


  return (
    <Box sx={{
      marginTop:10,
      marginBottom:15,
      marginX: isMobile || isTablet ? 3 : 'auto',
      maxWidth: '900px',
    }}>
         <MainList
          tweets={tweets}
          toggleBottomMenu={toggleBottomMenu}
          isFetchingNextPage={isFetchingNextPage}
          refs={loadMoreRef}
        /> 

    </Box>
  );
}

export default Home;
