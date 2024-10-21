import axios from "../api/axios";

const INSERT_TEAM_SELECTION_SHEET_DATA = '/insert_team_selection_sheet_data'
const INSERT_PLAYERS_SHEET_DATA = '/insert_players_sheet_data'

export const insertTeamSelectionSheetData = async () => {
    return await axios.get(INSERT_TEAM_SELECTION_SHEET_DATA);
}
export const insertPlayersSheetData = async () => {
    return axios.get(INSERT_PLAYERS_SHEET_DATA)
}