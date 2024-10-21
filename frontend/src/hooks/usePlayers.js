import {useContext} from "react";
import PlayersContext from "../context/PlayersProvider";

const usePlayers = () => {

    return useContext(PlayersContext);
}
export default usePlayers;