import React, { useContext } from 'react'
import Wrapper from '../../../components/layout/Wrapper'
import { Avatar, Card, Input } from 'antd';
import './user.css';
import { ContextState } from '../../../../context/DataProvider';

const { Meta } = Card;

export default function User() {
    const state: any = useContext(ContextState);
    const [userData] = state.userApi.userInfo;

    return (
        <Wrapper>
            <div className='user_app'>
                <div className='user_app_card_user'>
                    <Card
                        style={{ width: 300 }}
                        cover={
                            <img
                                alt="example"
                                src="https://i.pinimg.com/originals/b8/2f/28/b82f28a7e9c8fcb3868d3d94652c107c.gif"
                            />
                        }
                        className='user_app_card'
                        size='small'
                        bordered
                    >
                        <Meta
                            avatar={<Avatar size={'large'}>{String(userData.name).charAt(0).toLocaleUpperCase()}</Avatar>}
                            title={userData.name.toUpperCase()}
                            description={userData.email}
                        />
                    </Card>
                </div>
                <div className='user_app_reference'>
                    <label htmlFor="">Sua referencia storage:</label>
                    <Input value={userData.user_reference} className='user_app_reference_input' />
                </div>
            </div>
        </Wrapper>
    )
}
