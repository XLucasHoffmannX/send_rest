import { Divider, Space, Avatar, Popover } from 'antd';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../../assets/images/logo.svg';
import { AiOutlineMenu } from 'react-icons/ai'
import { RiLogoutBoxRLine, RiUserLine } from 'react-icons/ri';
import './header.fc.css';
import Cookies from 'js-cookie';
import { HttpAuth } from '../../../app/config/Http';
import { useContext } from 'react';
import { ContextState } from '../../../context/DataProvider';
import Search from '../Search/Search';

export default function HeaderFC() {
	const state: any = useContext(ContextState);
	const [userData] = state.userApi.userInfo;
	
	const OpenDock = () => {
        const event = new CustomEvent('openSide')
        window.dispatchEvent(event)
    }

	const handleLogout = async () => {
		Cookies.remove('access-token', { path: "/", domain: "localhost" });
		localStorage.removeItem("primaryLogin");
		await HttpAuth.get("/access/user/logout").then(res => {
			if (res.status === 200) window.location.href = '/'
		}).then((res:any)=>{
			if(res.status){
				window.location.href = "/"
			}
		});
	}

	const content = (
		<div className='header_app_user_ct'>
			<Link to="/perfil">
				<RiUserLine />
				Ver perfil
			</Link>
			<Link to="#" onClick={handleLogout}>
				<RiLogoutBoxRLine />
				Sair
			</Link>
		</div>
	);

	return (
		<div className='header_app'>
			<div className='header_app_split'>
				<div className='header_app_logo_area'>
					<AiOutlineMenu className='header_app_menu' onClick={OpenDock}/>
					<Link to="/home" className='header_app_logo'><img src={Logo} alt='envia ai' /></Link>
				</div>
				<div className='header_app_nav'>
					<Space split={<Divider type="vertical" />} >
						<NavLink to="/arquivos" activeClassName='activeNav'>Arquivos</NavLink>
						<NavLink to="/upload" activeClassName='activeNav'>Compartilhar</NavLink>
					</Space>
				</div>
			</div>
			{/* <Search className='header_app_search' placeholder="Buscar..." /> */}
			<Search classNameInsert="header_app_search" />
			<div className='header_app_user'>
				<Popover placement="bottomLeft" title={userData ? String(userData.name).toUpperCase() : ""} content={content} className='header_app_user_pop' >
					<Avatar>
						{userData ? String(userData.name).charAt(0).toLocaleUpperCase() : ""}
					</Avatar>
				</Popover>
			</div>
		</div>
	)
}
