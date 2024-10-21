import {useContext} from "react";
import FieldsContext from "../context/FieldsProvider";

const useFields = () => {

    return useContext(FieldsContext);
}
export default useFields;