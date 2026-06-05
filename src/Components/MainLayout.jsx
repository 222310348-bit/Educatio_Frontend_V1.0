import { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => setCollapsed(!collapsed);

    return (
        <div className="d-flex">
            {/* Pasamos el estado al Sidebar */}
            <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

            {/* El margen izquierdo cambia dinámicamente */}
            <main className="flex-grow-1" style={{ 
                marginLeft: collapsed ? '80px' : '250px', 
                transition: 'margin 0.3s',
                padding: '20px', 
                backgroundColor: '#f0f2f5', 
                minHeight: '100vh' 
            }}>
                <div className="container-fluid">
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};

export default MainLayout;