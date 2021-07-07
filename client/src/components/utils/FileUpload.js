import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Icon } from 'antd';
import axios from 'axios';

function FileUpload(props) {
    const [Images, setImages] = useState([]);
    // Array안에 String이 들어갈 수 있게 만든다.
    // 여러 가지 넣을 수 있게 만들어준다.
    // ImageName을 ([ ]) 안에 입력을 한다.

    const dropHandler = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0]);

        axios.post('/api/product/image', formData, config)
        // config를 같이 넣어주지 않으면 파일을 보낼 때 에러가 발생한다.
        // form 데이터 안에 파일 정보를 들어간다. --> header 어떤 파일인지 컨텐츠 타입을 정의한다.
        // 에러가 없이 보내주어야 한다. request 정보를 backend로 보내준다.
            .then(response => {
                if(response.data.success) {
                    console.log("response.data : ",response.data);

                    setImages([ ...Images, response.data.filePath ]);
                    props.refreshFunction([ ...Images, response.data.filePath ])

                } else {
                    alert('파일을 저장하는데 실패하였습니다.')
                }
            })
            // 프론트엔드에서 할 것을 처리해준다.
    }

    // deleteHandler를 만들어준다.
    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image)
        console.log("currentIndex : ", currentIndex);
        // Index0, Index1, Index2 ... 에 대한 인덱스를 파악한다.
        let newImages = [...Images]
        // 새로운 Images를 새로 복사해준다.
        newImages.splice(currentIndex, 1);
        // splics가 currentIndex를 0부터 하나의 아이템을 newImages라는 Array에서 제거해준다.
        setImages(newImages);
        props.refreshFunction(newImages);

    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}></Dropzone> */}
            <Dropzone onDrop={dropHandler}>
                {/* function을 만들어서 onDrop 이벤트 발생할 때 어떤 일을 할 것인지 코딩 */}
                {({ getRootProps, getInputProps }) => (
                    <div
                        style= {{
                            width: 300, height: 240, border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        }}
                            {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize: '3rem' }} />
                            {/* <p>Thank you</p> */}
                    </div>
                )}
            </Dropzone>

            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>

                {Images.map((image, index) => (
                    // index를 갖기 위해서 deleteHandler() 안에 image를 넣어준다.
                    <div onClick={() => deleteHandler(image)} key={index}>
                        <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                            src={`http://localhost:5000/${image}`}
                            // src={`http://localhost:5000/${image.filePath}`}
                        />
                    </div>
                ))}
                {/* map Method를 사용하여 하나씩 컨트롤을 해준다. */}


            </div>


        </div>
        // <div>
        //     FileUpload
        // </div>
    );
};

export default FileUpload;