import React,{useCallback} from 'react'
import Gallery from 'react-photo-gallery';
import SelectedImage from './SelectedImages';



const Images = ({images}) => {
    const photos = images.map((image)=>{
        return {
            src: image.imageUrl,
            width:image?.width,
            height:image?.height
        }
      })
     
    const imageRenderer = useCallback(
        ({ index, left, top, key, photo }) => (
          <SelectedImage
            totalImage = {images.length}
            selected={false}
            key={key}
            margin={"2px"}
            index={index}
            photo={photo}
            left={left}
            top={top}
          />
        ),
        []
    );

  return (
    <Gallery photos={photos} renderImage={ imageRenderer} />
  )
}

export default Images