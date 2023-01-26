import React from 'react'
import { Select, message } from 'antd';
import type { SelectProps } from 'antd';

export default function SelectMultiple() {

    const options: SelectProps['options'] = [];
    for (let i = 10; i < 36; i++) {
        options.push({
            label: i.toString(36) + i,
            value: i.toString(36) + i,
        });
    }

    const handleChange = (value: string[]) => {
        //console.log(`selected ${value}`);
    };

    const handleRemove = ()=>{
        message.error("removido");
        console.log('aqui');
    }

    return (
        <>
            <Select
                style={{ width: '100%' }}
                placeholder="Please select"
                defaultValue={['a10', 'c12']}
                onChange={handleChange}
                options={options}
                onDeselect={handleRemove}
            />
            <br />
        </>
    )
}
