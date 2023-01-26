import React, { useContext } from 'react'
import Wrapper from '../../../components/layout/Wrapper'
import './archives.css';
import { Card } from 'antd';
import { FcFolder } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { HttpAuth } from '../../../../app/config/Http';
import { ContextState } from '../../../../context/DataProvider';


export default function Archives() {
    const state: any = useContext(ContextState);
    const [userData] = state.userApi.userInfo;

    const [users, setUsers] = React.useState<[]>([]);

    React.useEffect(() => {
        const getUser = async () => {
            HttpAuth.get("/access/user/all")
                .then((res) => {
                    if (res.data) {
                        setUsers(res.data);
                    }
                });
        }
        getUser();
    }, [])

    return (
        <Wrapper>
            <div className='archive_app'>
                <div className='archive_app_area'>
                    <div className='archive_app_title'>
                        <h2>Compartilhados</h2>
                    </div>
                    <div className='archive_app_cards'>
                        <Link to="/a/public" className='link_folder null'>
                            <Card bordered={false} className='card_folder'>
                                <div className='card_folder_content'>
                                    <FcFolder />
                                    <div className='card_folder_info'>
                                        <h2>Públicos</h2>
                                        <span>42 arquivos</span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                        <Link to="/a/restricted" className='link_folder null'>
                            <Card bordered={false} className='card_folder'>
                                <div className='card_folder_content'>
                                    <FcFolder />
                                    <div className='card_folder_info'>
                                        <h2>Restritos</h2>
                                        <span>12 arquivos</span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </div>
                </div>
                <div className='archive_app_area'>
                    <div className='archive_app_title'>
                        <h2>Compartilhados com você</h2>
                    </div>
                    <div className='archive_app_cards'>
                        {
                            users.map((user: any) => (
                                <Link to={`/a/${user.id}`} className='link_folder null' key={user.id}>
                                    <Card bordered={false} className='card_folder'>
                                        <div className='card_folder_content'>
                                            <FcFolder />
                                            <div className='card_folder_info'>
                                                <h2>{user.name === userData.name ? "Você" : user.name}</h2>
                                                <span>{user.email}</span>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}
