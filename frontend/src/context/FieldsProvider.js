import {createContext, useState} from "react";
import {useQuery} from "react-query";
import {getAllFieldsByDate} from "../service/FieldService";
import {formatDate} from "../pages/EntryFormPage";
import useSelectedField from "../hooks/useSelectedField";

const FieldsContext = createContext({})

export const FieldsProvider = ({children}) => {

    const [fields, setFields] = useState([]);
    const [date, setDate] = useState(localStorage.getItem('selectedDate'));
    const {selectedField, setSelectedField} = useSelectedField();


    const handleFieldNotExist = (data) => {
        setFields(data);

        const fieldInData = data.find(item => item.field === selectedField) || data[0];

        setSelectedField(fieldInData.field);
    };



    useQuery(['fields', date, fields, selectedField], () => getAllFieldsByDate(formatDate(date)), {
        onSuccess: (data) => handleFieldNotExist(data),
    });

    return (
        <FieldsContext.Provider value={{fields, setFields, date, setDate}}>
            {children}
        </FieldsContext.Provider>
    )
}

export default FieldsContext