import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import '../styles/NavigationMenu.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLineChart, faUserTie} from "@fortawesome/free-solid-svg-icons";
import {faFutbol} from "@fortawesome/free-regular-svg-icons/faFutbol";
import Logo from "../assets/Logo";
import useSelectedField from "../hooks/useSelectedField";
import usePageTitle from "../hooks/usePageTitle";
import FootballFieldIcon from "../assets/FootballFieldIcon";
import usePlayers from "../hooks/usePlayers";
import useAuth from "../hooks/useAuth";
import {showNotification} from "../App";
import PlayersNavigationManu from "./PlayersNavigationManu";
import SecondaryNavigationMenu from "./SecondaryNavigationMenu";
import {motion} from "framer-motion";


const NavigationMenu = () => {

    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation()
    const navigate = useNavigate()
    const from = location.state?.from?.pathname || '/';
    const {setSelectedField} = useSelectedField()
    const headerTitle = usePageTitle();
    const {setPlayerId} = usePlayers();
    const {auth, setAuth} = useAuth();

    const navigationPages = [
        {
            path: '/',
            title: 'Games',
            icon: faFutbol
        }, {
            path: '/statistics',
            title: 'Statistics',
            icon: faLineChart
        }, {
            path: '/players',
            title: 'Players',
        },
        {
            path: '/admin',
            title: 'Admin',
            icon: faUserTie
        }
    ];

    const handleFieldChange = (field) => {
        setSelectedField(field);
        setPlayerId(null);
    };

    const handleSignOut = () => {
        showNotification('success', 'Successfully signed out')
        setAuth({})
        localStorage.removeItem('JWT')
        navigate(from, {replace: true});
        setIsOpen(false);
    }

    const navigationLinkPresent = {
        padding: '1em',
        backgroundColor: "#16a34a",
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const renderNavigationMenu = () => {
        return (
            <div className="nav-menu">
                <div className={`menu ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                <div className="page-title">
                    <h1 id="header-title">{headerTitle}</h1>
                </div>
                <div className="secondary-nav-menu"
                     style={{display: location.pathname === '/statistics' ? "block" : "none"}}></div>

                <motion.div className={`side-menu ${isOpen ? 'open' : ''}`}>
                    <div className='authentication'>
                        {auth?.gmail ? <h4 onClick={() => {
                            handleSignOut()
                        }}>sign-out</h4> : <Link
                            to='login'><h4>login</h4></Link>}
                    </div>
                    <ul>{
                        navigationPages.map((item) => (<motion.span className={`list-item`}>
                            <li style={location.pathname === item.path ? navigationLinkPresent : {}}>{item.title === 'Players' ?
                                <FootballFieldIcon width={30} height={40} strokeColor="white" fillColor="none"
                                                   strokeWidth={5}
                                                   style={{margin: '0 0.25em 0 0', alignSelf: 'center'}}/> :
                                <FontAwesomeIcon fill={"white"} icon={item.icon}/>}<Link
                                onClick={() => setIsOpen(false)}
                                to={item.path}>{item.title}</Link></li>
                        </motion.span>))
                    }
                    </ul>
                </motion.div>
                <Link to={"/"}><Logo height={50}/></Link>
                <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}/>
            </div>
        )
    }

    switch (location.pathname) {
        case '/':
            return <SecondaryNavigationMenu setIsOpen={setIsOpen} isOpen={isOpen} location={location}
                                            title={headerTitle} handleSignOut={handleSignOut} pages={navigationPages}
                                            handleFieldChange={handleFieldChange}/>
        case '/statistics':
            return <SecondaryNavigationMenu setIsOpen={setIsOpen} isOpen={isOpen} location={location}
                                            title={headerTitle} handleSignOut={handleSignOut} pages={navigationPages}
                                            handleFieldChange={handleFieldChange}/>
        case '/players':
            return <PlayersNavigationManu
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                location={location}
                pages={navigationPages}
                title={headerTitle}
                handleSignOut={handleSignOut}
                handleFieldChange={handleFieldChange}
            />
        case '/admin':
            return renderNavigationMenu()
        default:
            return <SecondaryNavigationMenu setIsOpen={setIsOpen} isOpen={isOpen} location={location}
                                            title={headerTitle} handleSignOut={handleSignOut} pages={navigationPages}
                                            handleFieldChange={handleFieldChange}/>
    }
};

export default NavigationMenu;
