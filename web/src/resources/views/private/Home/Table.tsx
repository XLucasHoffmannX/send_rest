import React from 'react'
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnsType, ColumnType, TablePaginationConfig } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { HttpAuth } from '../../../../app/config/Http';
import moment from 'moment';
import 'moment/locale/pt-br';

interface DataType {
    id: string,
    key: string;
    name: string;
    reference: string;
    created: string;
}


type DataIndex = keyof DataType;

const data: any = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
    });
}

export default function TableHome() {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
    const [searchText, setSearchText] = React.useState('');
    const [searchedColumn, setSearchedColumn] = React.useState('');
    const [tableParams, setTableParams] = React.useState<any>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const [dataSet, setDataSet] = React.useState<any[]>([]);
    const searchInput = React.useRef<InputRef>(null);


    React.useEffect(() => {
        const getAll = async () => {
            HttpAuth.get("/archives/get/all")
                .then((res) => {
                    if (res.data) {
                        //console.log(res.data);
                        let i = 0;
                        for (let doc of res.data) {
                            setDataSet(prev => {
                                i++;
                                return [...prev, { id: doc.id, key: i, name: doc.name, reference: doc.reference, created: `${moment(doc.created_at).locale('pt-br').format('ll')}` }]
                            })
                        }
                    }
                })
        }
        // getall
        getAll();
    }, [])

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Buscar ...`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Pequisar
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Limpar
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filtrar
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Fechar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    
    const columns: ColumnsType<DataType> = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Referencia',
            dataIndex: 'reference',
            key: 'reference',
            width: '40%',
            ...getColumnSearchProps('reference'),
        },
        {
            title: 'Criado em',
            dataIndex: 'created',
            key: 'created',
            ...getColumnSearchProps('created'),
        },
    ];

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    //const hasSelected = selectedRowKeys.length > 0;

    //console.log(hasSelected);

    const handleTableChange = (
        pagination: TablePaginationConfig,
      ) => {
        setTableParams({
          pagination,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setDataSet([]);
        }
      };

    return <Table rowSelection={rowSelection} scroll={{ x: 1500, y: 300 }} columns={columns} dataSource={dataSet} pagination={tableParams.pagination} onChange={handleTableChange} />;
}
