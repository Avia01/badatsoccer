import axios from "../api/axios";


const GET_GAMES_DATES = "/get_games_dates"

export const getGamesDates = async () => {
    const response = await axios.get(GET_GAMES_DATES);
    return response.data;
}

