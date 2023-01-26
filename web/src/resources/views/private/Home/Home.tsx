import React from 'react'
import Wrapper from '../../../components/layout/Wrapper'
import { Card, Popover } from 'antd';
import { AiOutlineUser, AiOutlinePlus, AiOutlineGroup, AiOutlineSetting, AiOutlineEllipsis } from 'react-icons/ai';
import './home.css';
import { Link } from 'react-router-dom';
import TableHome from './Table';

const { Meta } = Card;

export default function Home() {

    return (
        <Wrapper>
            <div className="home_app">
                <div className='home_app_card_actions'>
                    <Card
                        size="small"
                        actions={[
                            <Link to="#"><AiOutlineSetting key="setting" /></Link>,
                            <Link to="/perfil"><AiOutlineUser key="setting" /></Link>,
                            <Popover placement="bottom" content={"Sair"} title="" trigger="click"><AiOutlineEllipsis key="quit" /></Popover>,
                        ]}
                        className="home_app_card_actions_card"
                        style={{ border: "1px solid var(--grey-1)" }}
                    >
                        <Meta
                            title="Ações"
                            className='home_app_card_actions_meta'
                        />
                        <Link to="/upload" className='home_app_btn_card' >
                            <Card.Grid className='home_app_btn_card_grid'>
                                <AiOutlinePlus />
                                Compartilhar
                            </Card.Grid>
                        </Link>
                        <Link to="/arquivos" className='home_app_btn_card'>
                            <Card.Grid className='home_app_btn_card_grid purple'>
                                <AiOutlineGroup />
                                Ver arquivos
                            </Card.Grid>
                        </Link>
                    </Card>
                </div>

                <div className='home_app_card_table'>
                    <TableHome />
                </div>
            </div>
        </Wrapper>
    )
}
