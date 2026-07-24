import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const isAuth = !!localStorage.getItem('token');
    const location = useLocation(); // prendi il path corrente

    return isAuth ? (
        children
    ) : (
        <Navigate
            to="/login"
            replace
            state={{ from: location }}
        />
    );
};

export default PrivateRoute;
