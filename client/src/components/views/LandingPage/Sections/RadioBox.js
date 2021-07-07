import React, { useEffect, useState } from 'react';
import { Collapse, Checkbox, Radio } from 'antd';

const { Panel } = Collapse;

function RadioBox(props) {

    const [Value, setValue] = useState(0)

    const renderRadioBox = () => (
        props.list && props.list.map(value => (
            // props.list가 있다면 map을 처리
            <Radio key={value._id} value={value._id}> {value.name} </Radio>
            // Error를 제거하기 위해 key를 작성해준다.
            // index 대신 value._id | index와 같은 값
            // value와 value가 다르다.
        ))
    )

    const handleChange = (event) => {
        setValue(event.target.value)
        props.handleFilters(event.target.value)
    }

    return (
        <div>
            <Collapse defaultActiveKey={['0']} >
                <Panel header="Price" key="1">

                    <Radio.Group onChange={handleChange} value={Value}>
                        {/* 하나만 클릭을 할 수 있게 만들어준다. */}
                        {/* onChange Function으로 컨트롤을 해준다. */}
                        {renderRadioBox()}
                    </Radio.Group>

                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox;