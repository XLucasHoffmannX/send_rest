import React, { lazy, Suspense, useContext } from 'react';
import { BrowserRouter as RouterApp, Route, Switch } from 'react-router-dom';
//import { ContextState } from '../context/DataProvider';
import PrivateRoute from '../app/hooks/PrivateRoute';
import LoaderAppFC from '../resources/components/LoaderApp/LoaderAppFC';
import { NotAuthorized, NotFound } from '../resources/components/Exception/Exception';
import { ContextState } from '../context/DataProvider';
import SideBar from '../resources/components/SideBar/SideBar';

const Landing = lazy(() => import('../resources/views/Landing/Landing'));
const SharePublic = lazy(() => import('../resources/views/SharePublic/Share'));
const UrlShare = lazy(() => import('../resources/views/UrlShare/UrlShare'));
const Home = lazy(() => import('../resources/views/private/Home/Home'));
const Upload = lazy(() => import('../resources/views/private/Upload/UploadIntern'));
const ShareIntern = lazy(() => import('../resources/views/private/Share/ShareIntern'));
const Archives = lazy(() => import('../resources/views/private/Archives/Archives'));
const ArchivesList = lazy(() => import('../resources/views/private/ArchivesList/ArchivesList'));
const User = lazy(() => import('../resources/views/private/User/User'));

export default function RouteBrowser() {
    const state: any = useContext(ContextState);
    React.useEffect(() => {
        //console.log(state.userApi);
    }, [state]);
    return (
        <>
            <RouterApp>
                <Suspense fallback={<LoaderAppFC />}>
                    <SideBar />
                    <Switch>
                        <Route exact path="/" component={Landing} />
                        <Route exact path="/compartilhar" component={SharePublic} />
                        <Route exact path="/s/:id" component={UrlShare} />

                        <Route exact path="/401" component={NotAuthorized} />

                        <PrivateRoute path="/home"> <Home /> </PrivateRoute>
                        <PrivateRoute path="/upload"> <Upload /> </PrivateRoute>
                        <PrivateRoute path="/arquivos"> <Archives /> </PrivateRoute>
                        <PrivateRoute path="/a/:id"> <ArchivesList /> </PrivateRoute>
                        <PrivateRoute path="/share/:id"> <ShareIntern /> </PrivateRoute>
                        <PrivateRoute path="/perfil"> <User /> </PrivateRoute>

                        <Route exact path="*" component={NotFound} />
                    </Switch>
                </Suspense>
            </RouterApp>
        </>
    )
}
