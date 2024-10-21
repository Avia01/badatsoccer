import axios from "../api/axios";

const GET_STATISTICS = '/get_games_statistics_by_team_and_date'

export const getStatisticsByFieldNameDate = async (data) => {
    return await axios.get(GET_STATISTICS, {
        params: {
            field: data.field,
            entered_date: data.date
        }
    }).then(res => res.data);
}