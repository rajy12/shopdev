import React, { useEffect, useState } from 'react';
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row, Carousel, Collapse, Radio } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import Checkbox from './Sections/CheckBox';
import Radiobox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import { continents, price } from './Sections/Datas';


// ImageSlider 컴포넌트를 가져온다.

function LandingPage() {

    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    // ([]) Array로 해준다.
    const [Limit, setLimit] = useState(8);
    // initialState --> 8
    const [PostSize, setPostSize] = useState(0);
    const [Filters, setFilters] = useState({
        continents: [],
        // continents: [1, 2, 3],
        price: [],
        // initial State라고 한다.
    });
    const [SearchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // 처음에 페이지에 왔을 때
        let body = {
            skip: Skip,
            // Property Name: skip
            limit: Limit,
        }
        // 

        getProducts(body);
        // 트리거를 해준다.
    }, []);

    const getProducts = (body) => {
        // parameter - body
        axios.post('/api/product/products', body)
        // products 안에 있는 모든 데이터 가져온다.
        // End-Point를 준다.
        // Limit은 똑같지만 skip은 달라진다.
        // ex. skip은 0에서 8이 된다.
        // 렌더링을 할 때 작동을 한다.
        // 이 부분을 가지고 request를 보낸다. 더보기 버튼을 눌렀을 때 똑같이 사용한다.
            .then(response => {
                if (response.data.success) {
                    console.log("response.data = ", response.data);
                    if(body.loadMore) {
                        // 더보기 버튼을 눌렀을 때
                        setProducts([...Products, ...response.data.productInfo])
                        // setProducts(response.data.productInfo)
                        
                    } else {
                    // 받아온 정보를 메인 페이지로 가져온다.
                        setProducts(response.data.productInfo);
                    }
                    // 더보기 버튼이 없는 것은 PostSize를 지정해주지 않아서 그렇다.
                    // PostSize를 지정해준다.
                    setPostSize(response.data.postSize);
                } else {
                    alert(" 상품들을 가져오는데 실패 했습니다. ");
                }
            })
    }

    const renderCards = Products.map((product, index) => {

        console.log("product = ", product);
        return <Col lg={6} md={8} xs={24} key={index}>
            {/* Col = Column */}
            {/* lg={6} 사이즈, md={8} 사이즈, 8x3=24, xs={24} */}
            <Card
                // key={index}
                cover={<a href={`/product/${product._id}`} ><ImageSlider images={product.images} /></a>}
                    // unique ID 정보가 들어가 있다. product._id
                    // <img style={{ width: '100%', maxHeight:'150px' }} src={`http://localhost:5000/${product.images[0]}`} />
                    // 이미지를 넣어준다.
                    // 첫번 째 이미지를 입력한다. 
            >
                <Meta 
                    title={product.title}
                    description={`${product.price}`}
                />
            </Card>
        </Col>
    });

    // 정의를 해준다.
    const showFilteredResults = (filters) => {

        // DB에서 처음 데이터를 가지고 오므로 0이 온다.
        let body = {
            skip: 0,
            limit: Limit,
            filters: filters,
        }

        getProducts(body)
        setSkip(0)

    }

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for (let key in data) {
            // key는 0 ~ ... 값이 들어간다.
            if (data[key]._id === parseInt(value, 10)) {
                // 숫자로 변환을 해주어서 같다면
                array = data[key].array;
            }
        }
        return array;
    }

    const handleFilters = (filters, category) => {
        // array가 filters안에 담겨져 있다.
        const newFilters = { ...Filters }

        newFilters[category] = filters
        // newFilters[category] = [1, 2, 3];

        console.log('filters : ', filters);

        if (category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
            // newFilters["price"] = [200, 249]
        }
        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerm = (newSearchTerm) => {
        setSearchTerm(newSearchTerm)
        // 부모 컴포넌트의 SearchTerm 업데이트

        let body = {
            skip: 0, // DB에서 처음부터 가져와준다.
            limit: Limit, // Limit = 8
            filters: Filters, // body부분에 들어와준다.
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }

    const loadMoreHandler = () => {
        // 중복해서 입력해주지 않아도 된다.

        let skip = Skip + Limit
        // skip을 다시 재정의해준다. 
                // 처음 누를 때 0 + 8 = 8
                // 두 번째 누를 때 8 + 8 = 16
        let body = {
            skip: skip,
            // 처음 더보기를 눌렀을 때
            // 더보기 버튼을 눌렀을 때 갖는 Skip이다.
            limit: Limit,
            loadMore: true,
            // 더보기 버튼을 누를 때 가는 request 정보를 확인한다.
        }

        getProducts(body);
        // 8 
        setSkip(skip);
        // setLimit(Limit);
    }

    return (
        
        <div style={{ width: "75%", margin: '3rem auto' }}>

            <div style={{ textAlign: 'center' }}>
                <h2>Let's Travel Anywhere <Icon type="rocket" /> </h2>
            </div>

            {/* Filter */}

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    <Checkbox list={continents} handleFilters={filters => handleFilters(filters, "continents")} />
                    {/* <Checkbox list={continents} handleFilters={filters => handleFilters(filters => handleFilters(filters, "continents"))} /> */}
                    {/* Continents 컴포넌트에 내려준다. */}
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <Radiobox list={price} handleFilters={filters => handleFilters(filters, "price")} />
                </Col>
            </Row>


            {/* Search */}

            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
                <SearchFeature 
                    refreshFunction={updateSearchTerm}
                />
            </div>

            {/* Cards */}

            <Row gutter={[16, 16]}>
                {/* 여백을 넣어준다. */}
                {renderCards}
                {/* renderCards Method */}
            </Row>

            <br />

            {PostSize >= Limit &&
                // PostSize가 Limit보다 크거나 같으면
                // 더보기 버튼을 보여준다.
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={loadMoreHandler}>더보기</button>
                    {/* onClick 이벤트를 준다. 버튼을 누를 때 무슨 이벤트를 실행할 지 작성해준다. */}
                </div>
            }

            Landing Page
        </div>
        
        // <>
        //     <div className="app">
        //         <FaCode style={{ fontSize: '4rem' }} /><br />
        //         <span style={{ fontSize: '2rem' }}>Let's Start Coding!</span>
        //     </div>
        //     <div style={{ float: 'right' }}>Thanks For Using This Boiler Plate by John Ahn</div>
        // </>
    )
}

export default LandingPage;
