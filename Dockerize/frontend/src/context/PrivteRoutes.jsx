import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';



const PrivteRoutes = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default PrivteRoutes;