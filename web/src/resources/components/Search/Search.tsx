import React from 'react'
import { Select, message } from 'antd';
import type { SelectProps } from 'antd';
import {AiOutlineSearch} from 'react-icons/ai'; 

interface SearchBarInterface {
    classNameInsert?: string
}

export default function Search({ classNameInsert }: SearchBarInterface) {
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

    const handleRemove = () => {
        message.error("removido");
        console.log('aqui');
    }
    return (
        <Select
            placeholder="Buscar..."
            defaultValue={[]}
            onChange={handleChange}
            options={options}
            onDeselect={handleRemove}
            className={classNameInsert}
            showSearch
            suffixIcon={<AiOutlineSearch />}
        />
    )
}
