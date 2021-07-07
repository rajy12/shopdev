import React, { useState } from 'react';
import { Typography, Button, Form, Input } from 'antd';
import FileUpload from '../../utils/FileUpload';
import axios from 'axios';
// import Axios from 'Axios';
// const { Title } = Typography;
const { TextArea } = Input;

// 나라
const Continents = [
    { key: 1, value: "Africa" },
    { key: 2, value: "Europe" },
    { key: 3, value: "Asia" },
    { key: 4, value: "North America" },
    { key: 5, value: "South America" },
    { key: 6, value: "Australia" },
    { key: 7, value: "Antarctica" },
];
// 정의된 Continent를 하나만 둔다.

function UploadProductPage(props) {
    // props를 입력해주면 UploadProductPage 자식 컴포넌트가 되는 것이다.
    const [Title, setTitle ] = useState("");
    const [Description, setDescription] = useState("");
    const [Price, setPrice] = useState(0);
    const [Continent, setContinent] = useState(1); // initialValue=1로 준다.
    const [Images, setImages] = useState([]); // array로 해준다.

    const titleChangeHandler = (event) => {
        // 다이나믹하게 해준다. stateName을 Title
        // Title이라는 StateName을 입력한다. Function을 작동해서
        // 타이핑을 할 때 마다 이벤트를 가져온다.
        setTitle(event.currentTarget.value);
    }

    const descriptionChangeHandler = (event) => {
        setDescription(event.currentTarget.value);
        // setDescription으로 event가 일어날 때마다 discriptionState을 바꾸어준다.
    }

    const priceChangeHandler = (event) => {
        // event를 파라미터로 입력해준다.
        setPrice(event.currentTarget.value);
    }

    const continentChangeHandler = (event) => {
        setContinent(event.currentTarget.value);
    }

    const updateImages = (newImages) => {
        setImages(newImages);
    }
    // Image를 제거하거나 업로드할 때 부모 컴포넌트에서 변화들이 전달되어
    // 파일 업로드의 Images와 같게 된다.
    // 서버쪽으로 보내야 되는 모든 것들을 보내주게 된다.

    const submitHandler = (event) => {
        event.preventDefault();
        // 확인 버튼을 누를 때 자동적으로 페이지가 리프레시되지 않는다.

        // 모든 State가 (비워 있으면)채워지지 않으면 Submit할 수 없게 한다.
        if(!Title || !Description || !Price || !Continent || !Images) {
        // if(!Title || !Description || !Price || !Continent || Images.length === 0) {
            return alert(" 모든 값을 넣어주셔야 합니다.")
        }

        // 서버에 채운 값들을 Request로 보낸다.

        const body = {
            writer: props.user.userData._id,
            title: Title,
            description: Description,
            price: Price,
            images: Images,
            continents: Continent,
        }

        // const body = {
        //     // 로그인 된 사람의 ID를 말한다.
        //     writer: props.user.userData._id,
        //     title: Title,
        //     description: Description,
        //     price: Price,
        //     images: Images,
        //     continents: Continent
        //     // Back-End로 보내준다.
        // }

        axios.post("/api/product", body)
        // End-Point
            .then(response => {
                if (response.data.success) {
                    alert("상품 업로드에 성공 했습니다.");
                    // props을 가지고 온다.
                    props.history.push('/');
                    // 데이터베이스에 저장이 된 것을 '/', 랜딩페이지로 가져온다.
                } else {
                    alert("상품 업로드에 실패 했습니다.");
                }
            });
    }

    const fs = require('fs');
    const gm = require('gm');

    gm('/path/to/my/img.jpg')
        .resize(240, 240)
        .noProfile()
        .write('/path/to/resize.png', function (err) {
            if (!err) console.log('done!');
        });

    return(
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2> 여행 상품 업로드 </h2>
            </div>

            {/* 이벤트가 발생할 때 onSubmit에서 submitHandler */}
            <Form onSubmit={submitHandler}>
                {/* DropZone */}

                <FileUpload refreshFunction={updateImages} />
                {/* FileUpload 컴포넌트를 입력한다. */}
                {/* Image를 업로드하는 것이므로 updateImages로 Name을 정의해준다. */}

                <br />
                <br />
                <label>이름</label>
                <Input onChange={titleChangeHandler} value={Title} />
                {/* value="thankyou"를 {Title}로 해주면 입력이 가능 */}
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={descriptionChangeHandler} value={Description} />
                <br />
                <br />
                <label>가격($)</label>
                <Input type="number" onChange={priceChangeHandler} value={Price} />
                {/* Input의 경우, 타이핑을 할 때 Value가 바뀌게 해준다. */}
                <br />
                <br />
                <select onChange={continentChangeHandler}>
                    {Continents.map(item => (
                        <option key={item.key} value={Continent}> {item.value} </option>
                        // option의 value가 바뀔 수 있게 해준다.
                        // value={item.key}
                    ))};

                    {/* <option>1</option>
                    <option>2</option>
                    <option>3</option> */}
                </select>
                <br />
                <br />
                <Button type="submit" onClick={submitHandler}>
                    확인
                </Button>

            </Form>

            {/* <div>
                UploadProductPage 안녕하세요.
            </div> */}

        </div>
    );
};

export default UploadProductPage;