import React from 'react';
import TeamSelect from "./TeamSelect";
import '../styles/FieldSelect.css'
import {showNotification} from "../App";
import useFields from "../hooks/useFields";
import useSelectedField from "../hooks/useSelectedField";

const FieldSelect = (
    {
        teams,
        setTeams,
        teamA,
        setTeamA,
        teamB,
        setTeamB,
        resetFunction
    }) => {

    const {fields} = useFields();
    const {selectedField, setSelectedField} = useSelectedField()

    const handleOnFieldChange = (e, field) => {
        setSelectedField(e.target.value);
        setTeams([]);
        setTeamA("");
        setTeamB("");
        resetFunction();
        showNotification(`You choose ${field.field}`)
    }

    return (
        <>{
            <div className="select-section">
            <span id="fields"><label htmlFor="fields">Choose field:</label>
                {fields && fields?.map((field, index) => (
                    <span className="field-select" key={index}>
                    <label className="fw-bold">{field.field}</label>
                    <input name='fields' type={"radio"} onChange={(e) => handleOnFieldChange(e, field)}
                           checked={selectedField === field.field} value={field.field}/>
                    </span>
                ))}
            </span>

                {fields ? <TeamSelect
                    teams={teams}
                    setTeams={setTeams}
                    selectedField={selectedField}
                    setTeamA={setTeamA}
                    teamA={teamA}
                    teamB={teamB}
                    setTeamB={setTeamB}
                /> : null}
            </div>
        }
        </>
    );
};

export default FieldSelect;