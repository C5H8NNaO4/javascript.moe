import { AboutPage } from '@/pages/AboutPage';
import { LandingPage } from '@/pages/LandingPage';
import { Route, Routes } from 'react-router';
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import i18n from "i18next";


export const RedirectToLanguage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/' + i18n.language)
    }, [])

    return null;
}
export const routes = <Routes>
    <Route path="/" Component={RedirectToLanguage} />,
    <Route path="/:language" Component={LandingPage}>
    </Route>
    <Route path="/:language/about" Component={AboutPage} />
</Routes>