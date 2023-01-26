import React, { SyntheticEvent, useContext } from 'react';
import { Layout, Button, Input, Tooltip, message } from 'antd';
import Lottie from 'react-lottie';
import AnimateHome from '../../assets/animations/home_anim.json';
import AnimationLottie from '../../../app/hooks/AnimationLottie';
import { Link, Redirect } from 'react-router-dom';
import { AiOutlineUser, AiOutlineInfoCircle, AiOutlineLock } from 'react-icons/ai';
import { UserAccessDTO } from '../../../types/UserDTO';
import changeInputRecursive from '../../../app/hooks/ChangeInputRecursive';
import { Http } from '../../../app/config/Http';
import Message from '../../../app/hooks/Messages';
import Cookies from 'js-cookie';
import HeadTitleFC from '../../components/HeadTitle/HeadTitleFC';
import './landing.css';
import { ContextState } from '../../../context/DataProvider';

const { Content, Footer } = Layout;

export default function Landing() {
    const state: any = useContext(ContextState);
    const [token, setToken] = state.token;
    const defaultOptions = AnimationLottie(AnimateHome);
    const [messageApi, contextHolder] = message.useMessage();
    const [status, setStatus] = React.useState<boolean>(false);
    const [success, setSuccess] = React.useState<boolean>(false);
    const [access, setAccess] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<UserAccessDTO>({
        name: "",
        password: ""
    });

    const changeInput = (e: SyntheticEvent) => changeInputRecursive(e, user, setUser);

    const handleSubmit = async () => {
        if(Cookies.get("access-token") && localStorage.getItem("primaryLogin")) {
            return window.location.href = "/home"
        }
        if (!access) setAccess(true)
        else {
            if (!user.name || !user.password) {
                return setStatus(true);
            }

            await Http.post("/access/user", { ...user })
                .then((res) => {
                    if (res.data) {
                        setToken(res.data);
                        Cookies.set('access-token', res.data.accessToken);
                        localStorage.setItem('primaryLogin', 'true')
                    };
                    if (res.status === 201 || res.status === 200) {
                        setSuccess(true);
                        return Message(messageApi, "Autenticado!", "success");
                    }
                })
                .catch((error) => {
                    setStatus(true);
                    if (error.response) {
                        return Message(messageApi, error.response.data.message, "error");
                    }
                    return Message(messageApi, "ERROR 500 - erro de acesso, tente mais tarde!", "error");
                })
        }
    }

    return (
        <>
            <Layout className="layout_app">
                {contextHolder}
                <Content className='landing_app'>
                    <div className='landing_app_box' >
                        <HeadTitleFC />
                        {
                            !access ?
                                <div className='landing_app_box_animation'>
                                    <Lottie
                                        options={defaultOptions}
                                    />
                                </div>
                                :
                                <div className='landing_app_box_form'>
                                    <div className='landing_app_box_form_control'>
                                        <Input
                                            placeholder="Usuário"
                                            prefix={<AiOutlineUser className="input_user_ico" />}
                                            suffix={
                                                <Tooltip title="Nome de usuário fornecido pelo Gestor" arrowPointAtCenter autoAdjustOverflow>
                                                    <AiOutlineInfoCircle style={{ color: 'rgba(0,0,0,.45)' }} />
                                                </Tooltip>
                                            }
                                            className='input_user'
                                            name='name'
                                            value={user.name}
                                            status={status ? "error" : ""}
                                            onChange={changeInput}
                                        />
                                    </div>
                                    <div className='landing_app_box_form_control'>
                                        <Input.Password
                                            placeholder="Senha de usuário"
                                            prefix={<AiOutlineLock className="input_user_ico" />}
                                            className='input_user'
                                            name='password'
                                            value={user.password}
                                            status={status ? "error" : ""}
                                            onChange={changeInput}
                                        />
                                    </div>
                                </div>
                        }
                        <div className="landing_app_box_actions">
                            <Link to="#">
                                <Button className='app_access_button app_access_button_blank_blue'
                                    onClick={handleSubmit}
                                >
                                    Acessar
                                </Button>
                            </Link>
                            {
                                !access ?
                                    <Link to="/compartilhar">
                                        <Button type="primary" className='app_access_button' >
                                            Compartilhar
                                        </Button>
                                    </Link>
                                    :
                                    <Link to="/compartilhar" className='landing_app_box_actions_share'>Compartilhar arquivos públicos</Link>
                            }
                        </div>
                    </div>
                </Content>
                <Footer className='footer_app'>Victsoft | ©2023</Footer>
            </Layout>
            {success && <Redirect to='/home' />}
        </>
    )
}
