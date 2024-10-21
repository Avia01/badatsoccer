import './App.css';
import "@fortawesome/fontawesome-free"
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from "react-toastify";
import Root from "./components/Root";
import EntryFormPage from "./pages/EntryFormPage";
import {FieldsProvider} from "./context/FieldsProvider";
import {ScoresProvider} from "./context/ScoresProvider";
import {SearchProvider} from "./context/SearchProvider";
import {SelectedFieldProvider} from "./context/SelectedFieldProvider";
import AdminPage from "./pages/AdminPage";
import React from "react";
import Statistics from "./pages/Statistics";
import {PlayersProvider} from "./context/PlayersProvider";
import PlayersPage from "./pages/PlayersPage";
import {AuthProvider} from "./context/AuthProvider";
import RequireAuth from "./pages/RequireAuth";
import LoginPage from "./pages/LoginPage";

function App() {

    const ROLES = {
        Admin: 'Manager',
        User: 'player'
    }

    const router = createBrowserRouter([{
        path: '/', element: <Root/>,
        children:
            [
                {
                    path: '/', element: <EntryFormPage/>
                },
                {
                    path: 'login', element: <LoginPage/>
                },
                {
                    path: 'statistics', element: <Statistics/>
                },
                {
                    path: 'players', element: <PlayersPage/>
                },


                //     Authenticated Routes
                {
                    element: <RequireAuth allowedRoles={ROLES.Admin}/>,
                    children: [
                        {
                            path: 'admin', element: <AdminPage/>
                        }
                    ]
                }
            ]

    }])

    return (
        <SelectedFieldProvider>
            <SearchProvider>
                <AuthProvider>
                    <FieldsProvider>
                        <ScoresProvider>
                            <PlayersProvider>
                                <ToastContainer/>
                                <RouterProvider router={router}/>
                            </PlayersProvider>
                        </ScoresProvider>
                    </FieldsProvider>
                </AuthProvider>
            </SearchProvider>
        </SelectedFieldProvider>
    )
}

export default App;

const toastNotification = {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
}
export const showNotification = (type, text) => {
    switch (type) {
        case "error":
            return toast.error(text, toastNotification);
        case "success":
            return toast.success(text, toastNotification);
        case "info":
            return toast.info(text, toastNotification);
        default:
            return toast.info(text, toastNotification);
    }
}