import axios from "../api/axios";

const GET_TEAMS_BY_FIELD_AND_DATE = '/get_teams_by_field_and_date';
const GET_TEAM = '/get_team';
const GET_ALL_PLAYERS = '/get_all_players';

export const getTeamsByFieldAndDate = async (data) => {
    return await axios.get(GET_TEAMS_BY_FIELD_AND_DATE, {
        params: {
            field_auto: data.field,
            date: data.date
        }
    }).then(res => res.data);
}

export const getTeamsByPlayerName = async (data) => {
    return await axios.get(GET_TEAM, {
        params: {
            team_to_pick: data.team_to_pick,
            field_auto: data.field_auto,
            date: data.date
        }}).then(res => res.data);
}

export const getAllPlayers = async (data) => {
    return await axios.get(GET_ALL_PLAYERS, {
        params: {
            date: data.date,
            field: data.field
        }}).then(res => res.data);
}

