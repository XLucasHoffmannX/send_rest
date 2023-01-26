import React, { useContext } from 'react';
import Wrapper from '../../../components/layout/Wrapper';
import { AiOutlineInbox } from 'react-icons/ai';
import { Upload, UploadProps, message, Switch, Select, SelectProps, Button } from "antd";

import { Link } from 'react-router-dom';
import { UploadPrivate, UploadPublicFromAnywhere, UploadRestricted } from './service/requestUpload.service';
import { HttpAuth } from '../../../../app/config/Http';
import { ContextState } from '../../../../context/DataProvider';
import "./upload.css";

const { Dragger } = Upload;

export default function UploadIntern() {
    const state: any = useContext(ContextState);
    const [userData] = state.userApi.userInfo;

    const [idReference, setIdReference] = React.useState<string>();
    const [users, setUsers] = React.useState<[]>();
    const [switchPublic, setSwitchPublic] = React.useState<boolean>(true);
    const [dragView, setDragView] = React.useState<boolean>(false);
    const [multipleUsers, setMultipleUsers] = React.useState(false);
    const [shareHandle, setShareHandle] = React.useState<{ value: string, label: React.ReactNode }>({
        value: "",
        label: ""
    });
    const [userShare, setUsersShare] = React.useState<string[]>([]);

    const handleSelect = (select: { value: string; label: React.ReactNode }) => {
        setShareHandle({
            ...shareHandle,
            ...select
        });
    };

    React.useEffect(() => {
        const getUsers = async () => {
            HttpAuth.get("/access/user/all").then((res) => {
                if (res.data) {
                    setUsers(res.data);
                }
            }).catch((error) => {
                if (error) {
                    return message.error("Não foi possível obter os usuários!");
                }
            });
        }

        if (!switchPublic && shareHandle) {
            setDragView(!false);

            if (shareHandle.value === "PRIVATE") {
                setMultipleUsers(true)

                if (userShare) {
                    userShare.length <= 0 ? setDragView(!false) : setDragView(!true);
                }
            } else {
                setDragView(!true);
                setMultipleUsers(false)
            }

        } else if (switchPublic) {
            setDragView(!true);
        }

        getUsers();
    }, [switchPublic, shareHandle, userShare])

    const handleSwitch = (checked: boolean) => {
        setSwitchPublic(checked);
    };

    const handleChangeUserSelect = (value: string[]) => {
        setUsersShare([...value]);
    };

    const options: SelectProps['options'] = [];
    if (users) {
        users.map((user: any) => {
            if (user.id !== userData.id) {
                options.push({
                    label: user.name,
                    value: user.id,
                });
            }
        })
    }

    const handleRemoveUser = (value: string) => {
        message.error(`Usuário foi removido`);
    }

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
        }) => {
            if (switchPublic) {
                return UploadPublicFromAnywhere({
                    action,
                    data,
                    file,
                    filename,
                    headers,
                    onError,
                    onProgress,
                    onSuccess,
                    withCredentials, setIdReference
                }, userData.id);
            } else if (shareHandle) {
                if (userShare) {
                    if (userShare.length > 0) {
                        return UploadPrivate({
                            action,
                            data,
                            file,
                            filename,
                            headers,
                            onError,
                            onProgress,
                            onSuccess,
                            withCredentials, setIdReference
                        }, userData.id, userShare);
                    }
                }
                return UploadRestricted({
                    action,
                    data,
                    file,
                    filename,
                    headers,
                    onError,
                    onProgress,
                    onSuccess,
                    withCredentials, setIdReference
                }, userData.id);
            }
        },
        onChange(info: any) {
            const { status } = info.file;
            if (status === 'uploading') {
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
        <Wrapper>
            <div className='upload_app'>
                <div className='upload_app_box'>
                    <div className='upload_app_action'>
                        <div className='upload_form'>
                            <div className='upload_app_switch'>
                                <span> Compartilhar com qualquer pessoa</span>
                                <Switch defaultChecked onChange={handleSwitch} />
                            </div>
                            {
                                !switchPublic &&
                                <div className='upload_options'>
                                    <hr />
                                    <form action="" className="form_app">
                                        <div className='form_app_control'>
                                            <label htmlFor="">Forma de compartilhamento:</label>
                                            <Select
                                                labelInValue
                                                defaultValue={{ value: 'MULTIPLE', label: 'Restrito (usuários autenticados)' }}
                                                style={{ width: 120 }}
                                                onChange={handleSelect}
                                                options={[
                                                    {
                                                        value: 'MULTIPLE',
                                                        label: 'Restrito (usuários autenticados)',
                                                    },
                                                    {
                                                        value: 'PRIVATE',
                                                        label: 'Compartilhar somente com',
                                                    },
                                                ]}
                                                className='form_app_select'
                                                placeholder="teste"
                                                size='middle'
                                            />
                                        </div>
                                        {
                                            multipleUsers &&
                                            <div className="form_app_control">
                                                <label htmlFor="">Selecione os usuários:</label>
                                                <Select
                                                    mode="multiple"
                                                    style={{ width: '100%' }}
                                                    placeholder="Selecione ao menos um"
                                                    defaultValue={[]}
                                                    onChange={handleChangeUserSelect}
                                                    options={options}
                                                    onDeselect={handleRemoveUser}
                                                    className='form_app_select'
                                                    size='middle'
                                                />
                                            </div>
                                        }
                                    </form>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='sharepublic_app_box_drag'>
                        <Dragger {...props} className='sharepublic_app_box_drag_content' maxCount={1} disabled={dragView} style={{background: "var(--white)"}}>
                            <p className="ant-upload-drag-icon" style={!dragView ? { color: "var(--blue-1)" } : { color: "var(--font-2)" }}>
                                <AiOutlineInbox />
                            </p>
                            <p className="ant-upload-text">Clique ou arraste seu arquivo</p>
                            <p className="ant-upload-hint">
                                Lembrando que somente arquivos únicos, após o upload será gerado uma url de compartilhamento
                            </p>
                        </Dragger>
                    </div>
                    {
                        idReference &&
                        <div className='upload_app_submit'>
                            <Link to={switchPublic ? `/s/${idReference}` : `/share/${idReference}`}>
                                <Button type="primary" className='app_access_button app_access_button_full'>
                                    Compartilhar arquivo
                                </Button>
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </Wrapper>
    )
}
