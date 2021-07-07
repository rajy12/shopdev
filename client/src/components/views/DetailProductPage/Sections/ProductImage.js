import React, { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';
// import { continents, price } from './Sections/Datas';

function ProductImage(props) {

    const [Images, setImages] = useState([]);

    useEffect(() => {
        
        if(props.detail.images && props.detail.images.length > 0) {
            // props.detail.images가 있으면 props.detail.images.length가
            // 한 개 이상 있으면
            let images = []
            // images 안에 있는 [] array 안에 

            props.detail.images.map(item => {
                images.push({
                    // 다이나믹하게 처리해주는 게 맞다.
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                });
            });
            setImages(images)
        }

    }, [props.detail]);

    // const images = [
    //     {
    //         original: 'https://picsum.photos/id/1018/100/600/',
    //         thumbnail: 'https://picsum.photos/id/1018/250/150/',
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1015/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1015/250/150/',
    //     },
    //     {
    //         original: 'https://picsum.photos/id/1019/1000/600/',
    //         thumbnail: 'https://picsum.photos/id/1019/250/150/',
    //     },
    // ];


    return (
        <div>
            <ImageGallery items={Images} />
            ProductImage
        </div>
    )
}

export default ProductImage;