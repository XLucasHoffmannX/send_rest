import HeadTitleFC from '../../components/HeadTitle/HeadTitleFC';
import {
    Button,
    Input,
    Tooltip,
    Layout,
    QRCode,
    Alert
} from 'antd';
import { AiOutlineCopy } from 'react-icons/ai';
import { Link, useParams } from 'react-router-dom';
import React, { useContext } from 'react';
import { Http, HttpAuth } from '../../../app/config/Http';
import { message } from "antd";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import "../SharePublic/share.css";
import { ContextState } from '../../../context/DataProvider';
import LoaderAppFC from '../../components/LoaderApp/LoaderAppFC';
import { RWebShare } from "react-web-share";
const { Content, Footer } = Layout;

interface ShareInteface {
    noFooter?: boolean
    noWrapper?: boolean
    authorized?: boolean
}

export default function UrlShare({ noFooter, noWrapper, authorized }: ShareInteface) {
    const state: any = useContext(ContextState);
    const [userData] = state.userApi.userInfo;

    const [reference, setReference] = React.useState<string>();
    const [verify, setVerify] = React.useState<boolean>(true);
    const [origin, setOrigin] = React.useState<string>("temp");
    const [error, setError] = React.useState<boolean>(false);
    const paramRoute: any = useParams();
    const idReference = paramRoute.id;

    const [copy, setCopy] = React.useState({
        value: "",
        copied: false,
    });

    React.useEffect(() => {
        const getRerenceFromId = async () => {
            setError(false);
            Http.get(`/archives/verify/${idReference}`)
                .then((res) => {
                    if (res.data) {
                        if (res.data.public === "multiple" && !authorized) {
                            //return window.location.href = "/401"
                        }

                        if (res.data.type === "PRIVATE" && !authorized) {
                            //return window.location.href = "/401"
                        }

                        if (res.data.public === "multiple") {
                            setOrigin("multiple");
                        }

                        if (res.data.type === "PRIVATE") {
                            console.log("entrei");
                            setVerify(false)
                            HttpAuth.get(`/spreads/guard/${idReference}`)
                                .then((res) => {
                                    if (!res.data) {
                                        return window.location.href = "/401"
                                    }
                                    setVerify(true);
                                });

                            setOrigin(userData.user_reference);
                        }

                        setReference(res.data.reference);
                        setCopy({ ...copy, value: document.location.href });
                    }
                }).catch((error) => {
                    if (error.response.status === 500) {
                        message.error("Arquivo expirado!");
                        setError(true);
                    }
                });
        }
        getRerenceFromId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idReference, authorized, userData.user_reference]);

    const handleRedirect = () => {
        return document.location.href = `${process.env.REACT_APP_URL_ROOT}/archives/down/${origin}/${reference}`;
    }

    return (
        <>
            {
                verify ?
                    <Layout className={!noWrapper ? "layout_app" : "layout_app no_wrapper"}>
                        <Content className='sharepublic_app'>
                            <div className='sharepublic_app_box'>
                                <HeadTitleFC />
                                <div className='sharepublic_app_box_link_area'>
                                    <Input.Group compact className='sharepublic_app_box_link_area_input_group'>
                                        {
                                            reference ?
                                                <>
                                                    <Input
                                                        style={{ width: 'calc(min(100%, 450px) - 42px)' }}
                                                        defaultValue={document.location.href}
                                                    />
                                                    <Tooltip title="Clique para copiar e compartilhar">
                                                        <CopyToClipboard text={copy.value}
                                                            onCopy={() => setCopy({ ...copy, copied: true })}>
                                                            <RWebShare
                                                                data={{
                                                                    text: "envia ai - compartilhamento facilitado",
                                                                    url: `${document.location.href}`,
                                                                    title: "envia ai",
                                                                }}
                                                                closeText='Fechar'
                                                                sites={["whatsapp", "telegram", "mail", "copy"]}
                                                                onClick={()=> {return }}
                                                            >
                                                                <Button icon={<AiOutlineCopy />} className='sharepublic_app_box_link_area_tool' />
                                                            </RWebShare>
                                                        </CopyToClipboard>
                                                    </Tooltip>

                                                </>
                                                : null
                                        }
                                    </Input.Group>
                                </div>

                                {
                                    reference ?
                                        <div className='sharepublic_app_box_qrcode_area'>
                                            <QRCode
                                                errorLevel="H"
                                                value={document.location.href}
                                                icon="https://i.pinimg.com/736x/8e/e9/89/8ee989250f90578d44d8888286aaa2c0.jpg"
                                                bordered={false}
                                                size={240}
                                            />
                                        </div>
                                        :
                                        null
                                }
                                {
                                    error &&
                                    <div className='sharepublic_app_box_link_area'>
                                        <Alert
                                            message="Arquivo expirado ou inexistente"
                                            description="Esse arquivo pode ter ser sido excluido pelo remetente"
                                            type="error"
                                            showIcon
                                            className='alert_share'
                                        />
                                    </div>
                                }
                                <div className='landing_app_box_actions'>
                                    {
                                        reference ?
                                            <>
                                                <Link to="#" onClick={handleRedirect}>
                                                    <Button type="primary" className='app_access_button'>
                                                        Download
                                                    </Button>
                                                </Link>
                                                <Link to={authorized ? "/upload" : "/compartilhar"} className='landing_app_box_actions_share'>Compartilhar agora</Link>
                                            </>
                                            :
                                            <Link to="/compartilhar">
                                                <Button type="primary" className='app_access_button'>
                                                    Compartilhar arquivo
                                                </Button>
                                            </Link>
                                    }
                                </div>
                            </div>
                        </Content>
                        {
                            !noFooter ? <Footer className='footer_app'>Victsoft | ©2023</Footer> : null
                        }
                    </Layout>
                    :
                    <LoaderAppFC />
            }
        </>
    )
}
