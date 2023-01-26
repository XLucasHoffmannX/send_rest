import React from 'react';
import { Layout } from 'antd';
import HeaderFC from '../Header/HeaderFC';

type Props = {
    children?: React.ReactNode
}

const { Content, Footer } = Layout;

const Wrapper: React.FC<Props> = ({ children }: any) => {

    return (
        <Layout className="layout_app">
            <HeaderFC />
            <Content className="content_app">
                {children}
            </Content>
            <Footer className='footer_app'>Victsoft | ©2023</Footer>
        </Layout>
    )
}

export default Wrapper;