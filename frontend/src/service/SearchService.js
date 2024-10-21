import axios from "../api/axios";

const SEARCH_PLAYERS_BY_NAME = '/search_players_by_name';

export const searchPlayersByName = async (data) => {
    return await axios.get(SEARCH_PLAYERS_BY_NAME, {params: {query: data.query, date: data.date}})
        .then(res => res.data);
}