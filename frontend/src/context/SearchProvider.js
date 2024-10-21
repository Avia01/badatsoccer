import {createContext, useState} from "react";
import useFields from "../hooks/useFields";
import {formatDate} from "../pages/EntryFormPage";
import {useQuery} from "react-query";
import {searchPlayersByName} from "../service/SearchService";

const SearchContext = createContext({})

export const SearchProvider = ({children}) => {

    const [results, setResults] = useState([]);
    const [input, setInput] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const {date} = useFields()


    const formatedDate = (date) => formatDate(date);

    useQuery({
        queryKey: ['query', input, formatedDate],
        queryFn: () => searchPlayersByName({query: input, date: formatedDate(date)}),
        onSuccess: setResults,
        enabled: input.length >= 2
    })

    return (
        <SearchContext.Provider value={{results, setResults, input, setInput, isSearchOpen, setIsSearchOpen}}>
            {children}
        </SearchContext.Provider>
    )
}

export default SearchContext