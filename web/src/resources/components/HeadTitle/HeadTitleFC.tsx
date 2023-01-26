import React from 'react'
import LogoLanding from '../../assets/images/logo_landing.svg';

interface Header{
    noSubtitle?: boolean
}

export default function HeadTitleFC({noSubtitle} : Header) {
    return (
        <div className='app_head_title'>
            <img src={LogoLanding} alt="" />
            {
                !noSubtitle ?  <h2>Compartilhe arquivos de forma rápida e fácil</h2> : null
            }
        </div>
    )
}
