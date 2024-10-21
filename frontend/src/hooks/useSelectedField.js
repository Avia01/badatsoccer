import {useContext} from "react";
import SelectedFieldContext from "../context/SelectedFieldProvider";

const useSelectedField = () => {

    return useContext(SelectedFieldContext);
}
export default useSelectedField;