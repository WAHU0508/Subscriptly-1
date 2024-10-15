import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import '../App.css';
import './Navbar.css';
import { NavbarData } from './NavbarData';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

const Navbar = ({ user, onLogout }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        let timer;
        if (isExpanded) {
            timer = setTimeout(() => {
                setIsExpanded(false);
            }, 4000); // 4 seconds
        }
        return () => clearTimeout(timer); // Clear the timer if the component unmounts or if `isExpanded` changes
    }, [isExpanded]);

    const toggleNavbar = () => {
        setIsExpanded(!isExpanded);
    };

    const handleLogout = () => {
        onLogout(); // Clear the user state or perform any necessary logout logic
        navigate('/landing'); // Redirect to the LandingPage
    };

    const handleMenuItemClick = (link) => {
        if (!user) {
            // Show toast notification if the user is not logged in
            toast.info("Please login or sign up to access this page.");
        } else {
            navigate(link); // Navigate to the respective page if logged in
        }
    };

    const menuItems = [
        {
            id: 'greeting',
            icon: <WavingHandIcon />,
            title: user ? `Welcome, ${user.name}` : 'Login',
            onClick: user ? null : () => navigate('/login'), // No action when logged in
        },
        ...NavbarData,
        user && {
            id: 'logout',
            icon: <LogoutIcon />,
            title: 'Logout',
            onClick: handleLogout, // Updated onClick to handleLogout
        },
    ].filter(Boolean); // Remove null items (like logout when not logged in)

    return (
        <div className={`NavBar ${isExpanded ? "expanded" : "collapsed"}`}>
            <button onClick={toggleNavbar}>
                <MenuIcon />
            </button>
            <ul className="NavBarList">
                {menuItems.map((item, key) => (
                    <li
                        className={`row ${item.id === 'logout' ? 'logout-row' : ''}`}
                        key={key}
                        onClick={item.onClick || (() => { 
                            if (item.link) handleMenuItemClick(item.link); 
                        })}
                    >
                        <div id="icon">
                            {item.icon}
                        </div>
                        {isExpanded && (
                            <div id="title">
                                {item.title}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <ToastContainer /> {/* Add ToastContainer here */}
        </div>
    );
};

export default Navbar;
