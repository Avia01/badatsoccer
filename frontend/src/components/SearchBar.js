import React from 'react';
import '../styles/SearchBar.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {useQuery} from "react-query";
import {searchPlayersByName} from "../service/SearchService";
import usePlayers from "../hooks/usePlayers";
import useSelectedField from "../hooks/useSelectedField";
import useFields from "../hooks/useFields";
import {formatDate} from "../pages/EntryFormPage";
import {motion} from "framer-motion";
import useSearch from "../hooks/useSearch";

const SearchBar = () => {

    const {setPlayerId, setPlayer, setPlayerTeam} = usePlayers()
    const {setSelectedField} = useSelectedField();
    const {results, setResults, input, setInput, isSearchOpen, setIsSearchOpen} = useSearch()
    const {date} = useFields()


    const formatedDate = (date) => formatDate(date);

    useQuery({
        queryKey: ['query', input, formatedDate],
        queryFn: () => searchPlayersByName({query: input, date: formatedDate(date)}),
        onSuccess: setResults,
        enabled: input.length >= 2
    })
    const handleInputChange = (value) => {
        if (value.length < 2) {
            setPlayerId(null);
            setResults([]);
        }
        setInput(value);
    }

    const handleOnPlayerClick = (value) => {
        setInput(value.player_name);
        setPlayerId(value.player_name);
        setSelectedField(value.field_auto);
        setPlayerTeam(value.team_to_pick);
    }

    const cleanInput = () => {
        setIsSearchOpen(false);
        setPlayerId(null);
        setInput('');
        setResults([]);
        setPlayer([]);
    }
    const searchStyle = {
        color: "white",
        borderRadius: "50%",
        backgroundColor: "#1BE874",
        padding: "0.7em"

    };

    const screenWidth = document.body.clientWidth;
    const searchBarWidth = (screenWidth / 1.4);
    const remainingSpace = (screenWidth - searchBarWidth);
    const xPosition = (remainingSpace) / 2;

    return (
        <motion.div className='search-container'
                    initial={{
                        x: 0
                    }}
                    animate={{
                        x: isSearchOpen ? -(searchBarWidth) : 0,
                    }}
        >
            <motion.span
                initial={{
                    left: 0,
                    width: 0,
                    x: 0,
                    backgroundColor: isSearchOpen ? '#1be874' : 'rgb(27,232,116)'
                }}
                animate={{
                    width: isSearchOpen ? (searchBarWidth) : 0,
                    x: isSearchOpen ? (xPosition) : 0,
                    backgroundColor: isSearchOpen ? '#1be874' : '#1be874'
                }}
            >
                <FontAwesomeIcon icon={faMagnifyingGlass} style={isSearchOpen ? null : searchStyle}
                                 onClick={() => setIsSearchOpen(!isSearchOpen)}/>
                {isSearchOpen ? <motion.input type="text"
                                              value={input}
                                              onChange={(e) => handleInputChange(e.target.value)}
                                              placeholder="Search for players"/>
                    : null}
                {input.length >= 1 && <FontAwesomeIcon icon={faClose} onClick={() => cleanInput()}/>}
                {isSearchOpen ? <motion.div
                    className={`search-results ${(input.length <= 1 || results.find(player => input === player.player_name)) ? 'hidden' : ''}`}
                    style={{height: results.length > 5 ? '10em' : "fit-content"}}
                >
                    {results && results.length > 0 ? results.map((player, i) => (
                        <motion.div key={i}><h5 onClick={() => handleOnPlayerClick(player)}>{player.player_name}</h5>
                        </motion.div>
                    )) : <h5>No results found</h5>}
                </motion.div> : null}
            </motion.span>
        </motion.div>
    );
};

export default SearchBar;
