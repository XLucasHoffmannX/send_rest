import React from 'react'
import {
    Button,
    Layout,
} from 'antd';
import Error401 from '../../assets/animations/lock_anim.json';
import Error404 from '../../assets/animations/error_anim.json';
import Lottie from 'react-lottie';
import AnimationLottie from '../../../app/hooks/AnimationLottie';
import './exception.css';
import { Link } from 'react-router-dom';


const { Content, Footer } = Layout;


export const NotAuthorized = () => {
    const defaultOptions = AnimationLottie(Error401);

    return (
        <Layout className='layout_app'>
            <Content className='expection_app'>
                <div className='expection_app_box'>
                    <div className='expection_app_box_animation'>
                        <div className='expection_app_box_animation_control'>
                            <Lottie
                                options={defaultOptions}
                            />
                        </div>
                    </div>
                    <div className='expection_app_box_info'>
                        <p>Acesso não autorizado ao conteúdo</p>
                        <span>
                            Esse conteúdo não pode ser acessado, você não possui permissão de visualização
                        </span>
                    </div>
                    <div style={{marginTop: "4rem", padding: "0 1.5rem"}}>
                        <Link to="/">
                            <Button className='app_access_button app_access_button_full app_access_button_blank_blue'>
                                Voltar e compartilhar
                            </Button>
                        </Link>
                    </div>
                </div>
            </Content>
            <Footer className='footer_app'>Victsoft | ©2023</Footer>
        </Layout>
    )
}

export const NotFound = () => {
    const defaultOptions = AnimationLottie(Error404);

    return (
        <Layout className='layout_app'>
            <Content className='expection_app'>
                <div className='expection_app_box'>
                    <div className='expection_app_box_animation'>
                        <div className='expection_app_box_animation_control error404'>
                            <Lottie
                                options={defaultOptions}
                            />
                        </div>
                    </div>
                    <div className='expection_app_box_info'>
                        <p>Página não encontrada</p>
                        <span style={{width: "425px"}}>
                            O link que você seguiu pode estar quebrado ou a página foi removida
                        </span>
                    </div>
                    <div style={{marginTop: "4rem", padding: "0 1.5rem"}}>
                        <Link to="/">
                            <Button className='app_access_button app_access_button_full app_access_button_blank_blue'>
                                Voltar e compartilhar
                            </Button>
                        </Link>
                    </div>
                </div>
            </Content>
            <Footer className='footer_app'>Victsoft | ©2023</Footer>
        </Layout>
    )
}
