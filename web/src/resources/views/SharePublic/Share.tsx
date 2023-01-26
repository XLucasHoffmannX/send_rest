import React from 'react'
import { Layout } from 'antd';
import HeadTitleFC from '../../components/HeadTitle/HeadTitleFC';
import { AiOutlineInbox } from 'react-icons/ai';
import { message, Upload, UploadProps, Button } from "antd";
import { Link } from 'react-router-dom';
import { Http } from '../../../app/config/Http';
import './share.css';

const { Content, Footer } = Layout;
const { Dragger } = Upload;

export default function SharePublic() {
    const [idReference, setIdReference] = React.useState<string>();
    const props: UploadProps = {
        name: 'file',
        multiple: false,
        listType: "picture",
        customRequest: ({
            action,
            data,
            file,
            filename,
            headers,
            onError,
            onProgress,
            onSuccess,
            withCredentials,
        }: any) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("public", "temp");
            console.log(formData);
            Http.post("/archives/up", formData, {
                onUploadProgress: (event: any) => {
                    onProgress({ percent: Math.round((event.loaded / event.total) * 100).toFixed(2) }, file);
                },
            })
                .then(({ data: response }) => {
                    setIdReference(response);
                    onSuccess(response, file);
                })
                .catch(onError);
            return {
                abort() {
                    console.log('upload progress is aborted.');
                },
            };
        },
        onChange(info: any) {
            const { status } = info.file;
            if (status === 'uploading') {
                console.log(info.event);
            }
            if (status === 'done') {
                message.success(`${info.file.name} upload com successo !`);
            } else if (status === 'error') {
                message.error(`${info.file.name} upload do arquivo falhou !`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    return (
        <Layout className="layout_app">
            <Content className='sharepublic_app'>
                <div className='sharepublic_app_box'>
                    <HeadTitleFC />
                    <div className='sharepublic_app_box_drag'>
                        <Dragger {...props} className='sharepublic_app_box_drag_content' maxCount={1} >
                            <p className="ant-upload-drag-icon">
                                <AiOutlineInbox />
                            </p>
                            <p className="ant-upload-text">Clique ou arraste seu arquivo</p>
                            <p className="ant-upload-hint">
                                Lembrando que somente arquivos únicos, após o upload será gerado uma url de compartilhamento
                            </p>
                        </Dragger>
                    </div>
                    <div className='landing_app_box_actions'>
                        {
                            idReference &&
                            <Link to={`/s/${idReference}`}>
                                <Button type="primary" className='app_access_button app_access_button_full'>
                                    Compartilhar
                                </Button>
                            </Link>
                        }
                        <Link to="/" className='landing_app_box_actions_share'>Acessar e compartilhar arquivos privados</Link>
                    </div>
                </div>
            </Content>
            <Footer className='footer_app'>Victsoft | ©2023</Footer>
        </Layout>
    )
}
