import ScoresContext from "../context/ScoresProvider";
import {useContext} from "react";

const useScores = () => {

    return useContext(ScoresContext);
}
export default useScores;