import React from 'react'
import Wrapper from '../../../components/layout/Wrapper'
import UrlShare from '../../UrlShare/UrlShare'

export default function ShareIntern() {
    return (
        <>
            <Wrapper>
                <UrlShare noFooter={true} noWrapper={true} authorized={true} />
            </Wrapper>
        </>
    )
}
