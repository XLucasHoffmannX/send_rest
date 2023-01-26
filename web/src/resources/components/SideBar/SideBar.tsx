import React from 'react'
import { Dock } from 'react-dock'

import './sidebar.css';
import HeadTitleFC from '../HeadTitle/HeadTitleFC';
import { Link, NavLink } from 'react-router-dom';

export default function SideBar() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        window.addEventListener('openSide', () => { setOpen(true) })
    })

    return (
        <Dock
            isVisible={open}
            onVisibleChange={(visible: boolean) => {
                setOpen(visible)
            }}
            position="left"
            fluid={true}
            size={0.6}
        >
            <div className='sidebar_app'>
                <div className='sidebar_app_title'>
                    <HeadTitleFC noSubtitle={true} />
                </div>
                <div className='sidebar_app_list'>
                    <div className='sidebar_app_list_control'>
                        <NavLink to="/home" activeClassName='activeNavLink'>Home</NavLink>
                    </div>
                </div>
                <div className='sidebar_app_list'>
                    <div className='sidebar_app_list_control'>
                        <NavLink to="/upload" activeClassName='activeNavLink'>Compartilhar</NavLink>
                    </div>
                </div>

                <div className='sidebar_app_list'>
                    <div className='sidebar_app_list_control'>
                        <NavLink to="/arquivos" activeClassName='activeNavLink'>Arquivos</NavLink>
                    </div>
                </div>
                <div className='sidebar_app_list'>
                    <div className='sidebar_app_list_control'>
                        <NavLink to="/perfil" activeClassName='activeNavLink'>Perfil</NavLink>
                    </div>
                </div>
                <div className='sidebar_app_list'>
                    <div className='sidebar_app_list_control'>
                        <NavLink to="/compartilhar" activeClassName='activeNavLink'>Compartilhar público</NavLink>
                    </div>
                </div>
            </div>
        </Dock>
    )
}
