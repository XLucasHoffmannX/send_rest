import React from 'react'
import { Layout, Spin } from 'antd';

const { Content } = Layout;

export default function LoaderAppFC() {
    return (
        <Layout className="layout_app">
            <Content className='spin_app'>
                <Spin size="large" />
            </Content>
        </Layout>
    )
}
