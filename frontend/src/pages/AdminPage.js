import React, {useEffect, useState} from 'react';
import {useQuery} from "react-query";
import {clearLog, getSheetLog} from "../service/LogService";
import LogViewer from "../components/LogViewer";
import '../styles/AdminPage.css'
import {showNotification} from "../App";
import {ToastContainer} from "react-toastify";
import {insertTeamSelectionSheetData} from "../service/SheetService";
import {updatePlayersImagesAzure} from "../service/ImagesService";
import {motion} from "framer-motion";

const AdminPage = () => {

        const [logData, setLogData] = useState('');
        const [logName, setLogName] = useState('');
        const [isDisabled, setIsDisabled] = useState(false);
        const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);

        const updatePlayersImages = async () => {
            setIsUpdateDisabled(true);
            showNotification("info", "Processing an update for players images...")
            try {
                const response = await updatePlayersImagesAzure().then(_ => {
                    setIsUpdateDisabled(false);
                })
                showNotification('success', response.data);
            } catch (e) {
                setIsUpdateDisabled(false);
                showNotification('error', e.message);
            }
        }

        useQuery({
            queryFn: getSheetLog,
            queryKey: ['sheetLog', logData, logName],
            onSuccess: (data) => {
                const logData = data.data
                setLogData(logData.log_data)
                setLogName(logData.log_name)
            },
            onError: (error) => {
                showNotification(`Error loading team_selection sheet data: ${error.message}`)
            },
            refetchInterval: 10000,
        })

        async function loadSheet() {
            setIsDisabled(true);
            if (isDisabled) {
                showNotification('error', "Please wait for 5 seconds before reloading the log file!")
            } else {
                try {
                    const response = await insertTeamSelectionSheetData().finally(() => {
                        setIsDisabled(false);
                    });
                    showNotification('success', response.data.message);
                } catch (e) {
                    showNotification('error', `Error loading sheet data: ${e.message}`)
                    setIsDisabled(false);
                    return e.message
                }
            }
        }

        async function clearLogData() {
            try {
                showNotification('success', 'Log file cleared successfully!');
                return await clearLog();
            } catch (e) {
                showNotification('error', `Error clearing log data: ${e.message}`);
                return {error: e.message, code: 500}
            }
        }


        useEffect(() => {

        }, [isUpdateDisabled]);

        const itemsArray = [
            {
                "option": isDisabled ? 'Loading...' : "Load Data",
                "fn": () => loadSheet(),
                "disabled": isDisabled,
                "id": 'load-button'
            },
            {
                "option": "Update Photos",
                "fn": () => updatePlayersImages(),
                "disabled": isUpdateDisabled,
                "id": 'update-button'
            },
            {
                "option": "Clear Log",
                "fn": () => clearLogData(),
                "disabled": "",
                "id": 'clear-button'
            }
        ];

        const handleOnOptionClick = (item) => {
            if (typeof item.fn === 'function') {
                item.fn();
            }
        }

        return (
            <div className="admin-container">
                <ToastContainer/>
                <span className='sheet-container'>
                    {itemsArray.map((item => (
                        <motion.button className="admin_button" disabled={item.disabled}
                                       onClick={() => handleOnOptionClick(item)}
                                       key={item.id}>{item.option}</motion.button>
                    )))}
            </span>
                {logData && <LogViewer logs={logData}/>}
            </div>
        );
    }
;

export default AdminPage;
