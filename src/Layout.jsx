import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
} 