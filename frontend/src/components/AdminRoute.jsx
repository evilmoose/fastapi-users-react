import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
    const { currentUser, isAdmin } = useAuth();

    if (!currentUser || !isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute; 