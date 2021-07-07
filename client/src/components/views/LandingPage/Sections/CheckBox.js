import React, { useState } from 'react';
import { Collapse, Checkbox } from 'antd';

const { Panel } = Collapse;

function CheckBox(props) {  

    const [Checked, setChecked] = useState([]);

    const handleToggle = (value) => {
        // 누른 것의 Index를 구하고
        const currentIndex = Checked.indexOf(value)
        // 전체 Checked된 State에서 현재 누른 Checkbox가 이미 있다면
        // 전체 Checked된 State
        const newChecked = [...Checked]

        // 있으면 State에 넣어준다.
        if (currentIndex === -1) {
            newChecked.push(value);
            // 빼주고
        } else {
            // 있다면
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked)
        props.handleFilters(newChecked)
    }

    const renderCheckboxLists = () => props.list && props.list.map((value, index) => (
        // props 리스트가 있으면 list.map value로 해준다.
        <React.Fragment key={index} >
            {/* <Checkbox> Checkbox </Checkbox> */}
            {/* 에러를 없애기 위해서 key={index} 값을 넣어준다. */}
            <Checkbox onChange={() => handleToggle(value._id)} 
                checked={Checked.indexOf(value._id) === -1 ? false : true} />
            {/* <Checkbox onChange={() => handleToggle(value._id)} */}
                    {/* checked={Checked.indexOf(value._id) === -1 ? false : true} /> */}
                <span>{value.name}</span>
        </React.Fragment>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['0']} >
                <Panel header="Continents" key="1">

                    {renderCheckboxLists()}
                    
                </Panel>
            </Collapse>
        </div>

    )
}

export default CheckBox;