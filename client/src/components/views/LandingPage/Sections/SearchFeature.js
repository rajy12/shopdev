import React, { useState } from 'react';
import { Input } from 'antd';
import { AduioOutlined } from '@ant-design/icons';

const { Search } = Input;

function SearchFeature(props) {

    const [SearchTerm, setSearchTerm] = useState("");
    // State의 Name, --> 빈 스트링

    const searchHandler = (event) => {
        setSearchTerm(event.currentTarget.value);
        // value의 값이 달라진다.
        props.refreshFunction(event.currentTarget.value);
    }

    return (
        <div>
            <Search
                placeholder="input search text"
                onChange={searchHandler}
                style={{ width: 200 }}
                value={SearchTerm}
            />
            {/* SearchFeature */}
        </div>
    )
}

export default SearchFeature;