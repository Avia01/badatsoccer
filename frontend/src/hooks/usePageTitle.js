import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

const usePageTitle = () => {

    const location = useLocation();
    const [headerTitle, setHeaderTitle] = useState('')

    useEffect(() => {
        headerTitleHandler(location.pathname);
    }, [headerTitle, location.pathname]);
    const headerTitleHandler = (pathname) => {
        switch (pathname) {
            case '/':
                setHeaderTitle('Games');
                break;
            case '/statistics':
                setHeaderTitle('Statistics');
                break;
            case '/admin':
                setHeaderTitle('Admin');
                break;
            case '/players':
                setHeaderTitle('Players');
                break;
            default:
        }
    }

    return headerTitle;
}

export default usePageTitle;