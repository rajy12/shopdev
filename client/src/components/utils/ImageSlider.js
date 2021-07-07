import React from 'react';
import { Icon, Col, Card, Row, Carousel } from 'antd';

function ImageSlider(props) {
    return (
        <div>
            <Carousel autoplay >
                {/* 자동으로 플레이해준다. */}
                {props.images.map((image, index) => (
                    // map으로 하나 하나 컨트롤해줄 수 있다.
                    <div key={index}>
                        {/* key={index}를 입력하여 에러 메시지를 제거해준다. */}
                        <img style={{ width:'100%', maxHeight:'150px' }}
                            src={`http://localhost:5000/${image}`} />
                    </div>

                ))}
            </Carousel>
        </div>
    )
}

export default ImageSlider;