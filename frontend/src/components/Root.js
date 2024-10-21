import React from 'react';
import NavigationMenu from "./NavigationMenu";
import {Outlet} from "react-router-dom";

const Root = () => {
    return (
        <>
            <NavigationMenu/>
            <main>
                <Outlet/>
            </main>
        </>
    );
};

export default Root;
