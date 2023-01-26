import React, { useContext } from 'react'
import Wrapper from '../../../components/layout/Wrapper';
import { Link, useParams } from 'react-router-dom';
import { FcDocument, FcShare } from 'react-icons/fc';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BiChevronLeft } from 'react-icons/bi';
import { Card, Empty, Popover } from 'antd';
import '../Archives/archives.css';
import { HttpAuth } from '../../../../app/config/Http';
import moment from 'moment';
import 'moment/locale/pt-br';
import Delayed from '../../../../app/hooks/Delayed';
import { ContextState } from '../../../../context/DataProvider';


export default function ArchivesList() {
    const state: any = useContext(ContextState);
    const [userData] = state.userApi.userInfo;
    const paramRoute: any = useParams();
    const idReference = paramRoute.id;
    const [documents, setDocuments] = React.useState<any []>([]);
    const [userRef, setUserRef] = React.useState<string>();
    const [persist, setPersist] = React.useState<boolean>(true);

    React.useEffect(() => {
        const getDocuments = async () => {
            if (idReference === 'public') {
                return await HttpAuth.get("/archives/get")
                    .then((res) => {
                        if (res.data) {
                            setDocuments(res.data);
                        }
                    });
            }

            if (idReference === "restricted") {
                return await HttpAuth.get("/archives/get/restricted")
                    .then((res) => {
                        if (res.data) {
                            setDocuments(res.data);
                        }
                    });
            }

            if (idReference !== "restricted" && idReference !== "public") {
                return await HttpAuth.get(`/spreads/shared/${idReference}`)
                    .then(async (res) => {
                        if (res.data) {
                            await HttpAuth.get(`/access/user/get/${idReference}`)
                                .then((res) => {
                                    if (res.data) {
                                        setUserRef(res.data.user_reference);
                                    }
                                })
                            let persistence: boolean = false;
                            let data = [];
                            console.log(res.data);
                            for (let spread of res.data) {
                                for (let spreadDoc of spread.Spread) {
                                    //console.log("SPREAD => ", spreadDoc);
                                    //console.log("MEU ID => ", userData.id);
                                    if (spreadDoc.user_id === userData.id) {
                                        data.push(spread);
                                        persistence = true;
                                    } 
                                }
                            }
                            console.log(data);
                            console.log(persist);
                            persistence ? setDocuments(data) : setDocuments([]);
                        }
                    });
            }
        }
        getDocuments();
    }, [idReference])

    const handleUrl = (id: string, referenceDoc: string) => {
        if (idReference === "public") {
            return document.location.href = `/s/${id}`;
        }
        if (idReference === "restricted") {
            return document.location.href = `/share/${id}`;
        }

        return document.location.href = `${process.env.REACT_APP_URL_ROOT}/archives/down/${userRef}/${referenceDoc}`;
    }

    const content = (id: string, referenceDoc: string) => (
        <div className='archive_app_pop_content'>
            <div className='archive_app_pop_share' onClick={() => handleUrl(id, referenceDoc)}>
                <Link to={"#"}>
                    <FcShare />
                    {idReference !== "restricted" && idReference !== "public" ? "Baixar" : "Compartilhar"}
                </Link>
            </div>
            <div className='archive_app_pop_delete'>
                {
                    idReference !== "restricted" && idReference !== "public" ? null :
                        <Link to="/">
                            <AiTwotoneDelete />
                            Apagar
                        </Link>
                }
            </div>
        </div>
    )


    return (
        <Wrapper>
            <div className='archive_app'>
                <div className='archive_app_area'>
                    <div className='archive_app_title'>
                        <Link to="/arquivos"><h2> <BiChevronLeft /> Compartilhados</h2></Link>
                        <span>
                            {idReference === "public" && "Qualquer pessoa com o link (público)"}
                            {idReference === "restricted" && "Qualquer pessoa com o link (público)"}
                            {idReference !== "public" && "restricted" && "Arquivos compartilhados com você"}
                        </span>
                    </div>
                    <div className='archive_app_cards'>
                        {
                            documents.length > 0 ?
                                documents.map((doc: any) => (
                                    <Delayed key={doc.id}>
                                        <Popover placement="bottom" title={"Opções"} content={() => content(`${doc.id}`, doc.reference)} className='archive_app_pop' trigger="click">
                                            <Link to="/a/public" className='link_folder null'>
                                                <Card bordered={false} className='card_folder'>
                                                    <div className='card_folder_content'>
                                                        <FcDocument />
                                                        <div className='card_folder_info'>
                                                            <h2>{doc.name}</h2>
                                                            <span>Criado em {moment(doc.created_at).locale('pt-br').format('LL')}</span>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        </Popover>

                                    </Delayed>
                                ))
                                :
                                <Delayed>
                                    <div className='empty'>
                                        <Empty description="Sem arquivos compartilhados" />
                                    </div>
                                </Delayed>
                        }
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}
