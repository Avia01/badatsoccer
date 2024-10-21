import {createContext, useEffect, useState} from "react";

const SelectedFieldContext = createContext({})

export const SelectedFieldProvider = ({children}) => {
    const [selectedField, setSelectedField] = useState(localStorage.getItem("selectedField") || '');

    useEffect(() => {
        localStorage.setItem("selectedField", selectedField);
    }, [selectedField]);


    return (
        <SelectedFieldContext.Provider value={{selectedField, setSelectedField}}>
            {children}
        </SelectedFieldContext.Provider>
    )
}

export default SelectedFieldContext