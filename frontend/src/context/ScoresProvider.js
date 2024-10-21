import {createContext, useState} from "react";

const ScoresContext = createContext({})

export const ScoresProvider = ({children}) => {
    const [scores, setScores] = useState([]);

    return (
        <ScoresContext.Provider value={{scores, setScores}}>
            {children}
        </ScoresContext.Provider>
    )
}

export default ScoresContext