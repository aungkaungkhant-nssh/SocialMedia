import React,{useState} from 'react'
import {
        Dialog,
        Slide,
        AppBar,
        Toolbar,
        IconButton,
        Box
      } 
from '@mui/material';

import {
  Close as CloseIcon,
  Download as DownLoadIcon,
} from "@mui/icons-material";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import useDownloader from 'react-use-downloader';
const Transition = React.forwardRef(function Transition(
  props,
  ref,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const ImageModal = ({open,handleClose,previewImages}) => {
  const [currentImageUrl, setCurrentImageUrl] = useState(previewImages[0].imageUrl);
  const { download } = useDownloader();

  const handleSlideChange = (swiper) => {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const imgElement = activeSlide.querySelector('img');
    if (imgElement) {
      setCurrentImageUrl(imgElement.src);
    }
  };

  
  return (
    <Dialog
    fullScreen
    open={open}
    onClose={handleClose}
    TransitionComponent={Transition}
  >
    <AppBar sx={{ position: 'relative' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'end' }}>
        <IconButton
          edge="end"
          color="inherit"
          onClick={()=>{
            const splitArray = currentImageUrl.split("/")
            const fileName = splitArray[splitArray.length-1]
            download(currentImageUrl, fileName)
          }}
          aria-label="download"
        >
          <DownLoadIcon sx={{ fontSize: '35px' }} />
        </IconButton>
        <IconButton
         sx={{marginX:6}}
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon sx={{ fontSize: '35px' }} />
        </IconButton>
      </Toolbar>
    </AppBar>
    <Box sx={{width:"50%" ,marginY: 3, position: 'relative' ,marginX:"auto"}}>
      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        onSlideChange={handleSlideChange}
      >
        {previewImages.map((image, index) => (
          <SwiperSlide key={index}>
            <Box sx={{ width: '100%', marginX: 'auto' }}>
              <img src={image.imageUrl} alt="" style={{ width: '100%', marginBottom: '5px',objectFit:"cover" }} />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  </Dialog>
  )
}

export default ImageModal