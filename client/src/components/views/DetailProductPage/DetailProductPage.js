import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import { Row, Col } from 'antd';

function DetailProductPage(props) {

    // URL의 유니크한 값을 가져온다.
    const productId = props.match.params.productId;

    const [Product, setProduct] = useState({});

    useEffect(() => {

        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
        // aixos.get Method
        // 가져오는 것으로 axios.get을 입력한다. id=${productId} 쿼리를 준다.
        // 백틱으로 해주고 타입은 Single로 한다. 하나만 가져온다. 아이디를 Back-End 서버에 보내준다.
        // URL의 Unique 값을 가져온다.
            .then(response => {
                // response 값이 들어간다.
                if(response.data.success) {
                    // 성공한 경우
                    console.log('response.data = ', response.data);
                    setProduct(response.data.product[0])
                } else {
                    // 실패한 경우
                    alert('상세 정보 가져오기를 실패했습니다.');
                }
                // setProduct(response.data[0]);
            })
            .catch(err => alert(err))
    }, []);

    return (
        <div style={{ width: '100%', padding: '3rem 4rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>{Product.title}</h1>
            </div>
        
        <br />

        <Row gutter={[16, 16]} >
            <Col lg={12} sm={24}>

                {/* ProductImage */}
                <ProductImage detail={Product}/>

            </Col>
            <Col lg={12} sm={24}>

                {/* ProductInfo */}
                <ProductInfo detail={Product}/>

            </Col>
        </Row>

        </div>
    )
}

export default DetailProductPage;