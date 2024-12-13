import React from 'react';
import {getField} from "../service/FieldService";
import '../styles/TeamSelect.css'
import useFields from "../hooks/useFields";
import {useQuery} from "react-query";
import {formatDate, toISODate} from "../pages/EntryFormPage";
import {showNotification} from "../App";

const TeamSelect = ({selectedField, teams, setTeams, teamA, setTeamA, teamB, setTeamB}) => {

    const {date} = useFields();

    useQuery({
        queryFn: () => getField({field_auto: selectedField, date: toISODate(date)}),
        queryKey: ["field", selectedField, date, setTeams, teamA, teamB],
        onSuccess: setTeams,
        onError: (err) => {
            showNotification('error', err)
        }
    })

    const handleTeamAChange = e => {
        setTeamA(e.target.value)
        if (e.target.value === teamB) {
            setTeamB("")
        }
    }
    const handleTeamBChange = e => {
        setTeamB(e.target.value);
    }

    return (
        <span className="team-selection">

            <label htmlFor="teams">Host Team:</label>
            {teams && <select name="teams" id="teams" className="selection" onChange={(e) => handleTeamAChange(e)}>
                <option value="" selected disabled={true}>Choose Host Team</option>
                {teams.map((team, i) => extractTeamName(team.team_to_pick) !== extractTeamName(teamB) && (
                    <option key={i} value={extractTeamName(team.team_to_pick)}>
                        {extractTeamName(team.team_to_pick)}</option>))
                }
            </select>}
            {teamA && <label htmlFor="teams">Guest Team:</label>}
            {teamA && <select name="teams" id="teams" className="selection" onChange={(e) => handleTeamBChange(e)}>
                <option value="" selected disabled={true}>Choose Guest Team</option>
                {teams.map((team, i) => extractTeamName(team.team_to_pick) !== extractTeamName(teamA) && (
                    <option key={i} value={extractTeamName(team.team_to_pick)}>
                        {extractTeamName(team.team_to_pick)}</option>))
                }
            </select>}
        </span>
    );
};

export default TeamSelect;

export const reverseTeamName = (team) => {
    if (team === "Blue Metal") {
        return "metal";
    }
    return team.toLowerCase();
}

export const extractTeamName = (team) => {
    if (team.includes('Team')) {
        return team.split(' Team')[0];
    }
    return team.charAt(0).toUpperCase() + team.slice(1);
};

export const getTeamColor = (team) => {

    const colors = {
        "bluemetal": "#38BDF8FF",
        "blue": "#2563EBFF",
        "purple": "#9333EAFF",
        "pink": "#FCA5A5FF",
        "red": "#EF4444FF",
        "orange": "#FB923CFF",
        "green": "#22C55EFF",
        "lightGreen": "#A3E635FF",
        "gold": "#dcb20b",
        "yellow": "#FCD34DFF",
        "white": "#fff"
    }
    switch (team) {

        // Blue Metal Team
        case "BlueMetal Team":
            return colors.bluemetal;
        case "BlueMetal":
            return colors.bluemetal;
        case "Blue Metal Team":
            return colors.bluemetal;
        case "bluemetal":
            return colors.bluemetal;
        case "bluemetal Team":
            return colors.bluemetal;

        //     Purple Team
        case 'purple Team':
            return colors.purple;
        case 'purple':
            return colors.purple;
        case 'Purple':
            return colors.purple;
        case 'Purple Team':
            return colors.purple;

        //     Pink Team
        case 'pink Team':
            return colors.pink;
        case 'pink':
            return colors.pink;
        case 'Pink Team':
            return colors.pink;
        case 'Pink':
            return colors.pink;

        //     Red Team
        case "red":
            return colors.red;
        case "red Team":
            return colors.red;
        case "Red":
            return colors.red;
        case "Red Team":
            return colors.red;

        //     Orange Team
        case 'orange Team':
            return colors.orange;
        case 'orange':
            return colors.orange;
        case 'Orange':
            return colors.orange;
        case 'Orange Team':
            return colors.orange;
        //     Green Team
        case "Green":
            return colors.green;
        case "Green Team":
            return colors.green;
        case "green":
            return colors.green;
        case "green Team":
            return colors.green;

        //     Gold Team
        case "gold Team":
            return colors.gold;
        case "gold":
            return colors.gold;
        case "Gold Team":
            return colors.gold;
        case "Gold":
            return colors.gold;

        //     White Team
        case "white Team":
            return colors.white
        case "white":
            return colors.white
        case "White Team":
            return colors.white
        case "White":
            return colors.white
        default:
            return "#0F172AFF";
    }
}
