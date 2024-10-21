import {Link} from "react-router-dom";
import FootballFieldIcon from "../assets/FootballFieldIcon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Logo from "../assets/Logo";
import {motion} from "framer-motion";
import React, {useEffect} from "react";
import useFields from "../hooks/useFields";
import useSelectedField from "../hooks/useSelectedField";
import useAuth from "../hooks/useAuth";
import SearchBar from "./SearchBar";
import DatePicker from "./DatePicker";
import '../styles/PlayersNavigationManu.css'
import useSearch from "../hooks/useSearch";

const PlayersNavigationManu = ({pages, location, isOpen, setIsOpen, title, handleSignOut, handleFieldChange}) => {

    const {fields} = useFields();
    const {selectedField} = useSelectedField()
    const {isSearchOpen} = useSearch()
    const {auth} = useAuth()

    const navigationLinkPresent = {
        padding: '0.25em 0.5em',
        backgroundColor: "#1d9449",
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

    return (
        <div className="nav-menu">
            <div className={`menu ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
            <div className="page-title">
                <h1 id="header-title">{title}</h1>
            </div>
            <motion.div
                className="secondary-nav-menu players-navigation-menu">
                <motion.span
                    initial={{
                        x: 0
                    }}
                    animate={{
                        x: isSearchOpen ? -(document.body.clientWidth) : 0,
                    }}
                ><select
                    className="secondary-nav-titles"
                    style={{justifyContent: fields.length < 4 ? "space-evenly" : "space-between"}}
                    onChange={(e) => handleFieldChange(e.target.value)}
                >
                    {
                        fields && fields.map((field, index) => {
                            let fieldTitle = field.field;
                            return (
                                <option defaultValue={selectedField} className={fieldTitle === selectedField ? 'selected-field' : ''}
                                        value={fieldTitle} key={index}>{fieldTitle}</option>
                            )
                        })
                    }
                </select>
                    <DatePicker/>
                </motion.span>
                <SearchBar/>
            </motion.div>

            <div className={`side-menu ${isOpen ? 'open' : ''}`}>
                <div className='authentication'>
                    {auth?.gmail ? <h4 onClick={() => handleSignOut()}>sign-out</h4> : <Link
                        to='login'><h4>login</h4></Link>}
                </div>
                <ul>{
                    pages.map((item) => (<span className="list-item">
                            <li style={location.pathname === item.path ? navigationLinkPresent : {}}>{item.title === 'Players' ?
                                <FootballFieldIcon width={30} height={40} strokeColor="white" fillColor="none"
                                                   strokeWidth={5}
                                                   style={{margin: '0 0.5em 0 0', alignSelf: 'center'}}/> :
                                <FontAwesomeIcon fill={"white"} icon={item.icon}/>}<Link
                                onClick={() => setIsOpen(false)}
                                to={item.path}>{item.title}</Link></li>
                        </span>))
                }
                </ul>
            </div>
            <Link to={"/"}><Logo height={50}/></Link>
            <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}/>
        </div>
    );

}

export default PlayersNavigationManu;