import React from 'react';
import {formatDate, toISODate} from "../pages/EntryFormPage";
import {useQuery} from "react-query";
import {getGamesDates} from "../service/GamesService";
import '../styles/DatePicker.css'
import useFields from "../hooks/useFields";

const DatePicker = ({style, title}) => {

    const {setDate} = useFields()
    const selectedDate = localStorage.getItem("selectedDate");
    const {data} = useQuery({
        queryFn: getGamesDates,
        queryKey: ["dates"]
    })

    const findClosestDate = (dates) => {
        const today = new Date();
        let closest = dates[0];
        let smallestDiff = Math.abs(new Date(dates[0]) - today);

        for (let i = 1; i < dates.length; i++) {
            const currentDiff = Math.abs(new Date(dates[i]) - today);
            if (currentDiff < smallestDiff) {
                closest = dates[i];
                smallestDiff = currentDiff;
            }
        }
        localStorage.setItem("selectedDate", closest);
        return closest;
    };
    
    const handleDateChange = async (value) => {
        setDate(value);
        localStorage.setItem("selectedDate", value);
    }

    const dates = data?.map(date => {
        return toISODate(date.date)
    })
    
    return (
        <span id="games-date" style={style}>
            <label>{title}</label>
            <select className="selection" onChange={(e) => handleDateChange(e.target.value)}>
                    <option value="" selected disabled>Select date</option>
                {dates && dates?.map((date, i) => <option key={i} selected={!selectedDate ? findClosestDate(dates) : selectedDate === date} value={date}>{formatDate(date)}</option>)}
            </select>
        </span>
    );
};

export default DatePicker;
