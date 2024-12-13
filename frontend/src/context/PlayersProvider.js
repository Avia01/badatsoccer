import {createContext, useState} from "react";
import {getAllPlayers, getTeamsByPlayerName} from "../service/TeamsService";
import {useQuery} from "react-query";
import useFields from "../hooks/useFields";
import {formatDate, toISODate} from "../pages/EntryFormPage";
import useSelectedField from "../hooks/useSelectedField";

const PlayersContext = createContext({});

export const PlayersProvider = ({children}) => {
    const [players, setPlayers] = useState([]);
    const [playerId, setPlayerId] = useState(null)
    const [player, setPlayer] = useState([]);
    const [playerTeam, setPlayerTeam] = useState('')
    const {date} = useFields()
    const {selectedField} = useSelectedField()

    // const localDate = formatDate(date)

    const {isFetching} = useQuery({
        queryKey: ['players', date, selectedField],
        queryFn: () => getAllPlayers({date: toISODate(date), field: selectedField}),
        onSuccess: setPlayers,
    });

    useQuery({
        queryKey: ['player', playerId, date, playerTeam, selectedField],
        queryFn: () => getTeamsByPlayerName(

            {team_to_pick: playerTeam, date: toISODate(date), field_auto: selectedField}),
        onSuccess: setPlayer,
        enabled: playerId !== null
    });

    return (
        <PlayersContext.Provider value={{players, setPlayers, playerId, setPlayerId, player, setPlayer, isFetching, playerTeam, setPlayerTeam}}>
            {children}
        </PlayersContext.Provider>
    )
}

export default PlayersContext