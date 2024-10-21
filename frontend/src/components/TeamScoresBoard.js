import React from 'react';
import OutlineShirtSvg from "../assets/OutlineShirtSvg";
import ShirtSvg from "../assets/ShirtSvg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import '../styles/TeamScoreBoard.css'
import {getTeamColor} from "./TeamSelect";

const TeamScoresBoard = ({teamA, teamB, teamAScore, teamBScore,setTeamAScore, setTeamBScore, resetFn, submitFn}) => {

    return (
        (teamA || teamB) && <div className="teams-section">
            <div className="teams">
            <span className="team">
                {teamA.includes("White") ? <OutlineShirtSvg width={65}/> :
                    <ShirtSvg fill={getTeamColor(teamA)} width={65}/>}
                <h4>{teamA}</h4>
            </span>
                <span><h5>vs</h5></span>
                <span className="team">
                    {teamB.includes("White") ? <OutlineShirtSvg width={65}/> :
                        <ShirtSvg fill={getTeamColor(teamB)} width={65}/>}
                    <h4>{teamB}</h4>
            </span>
            </div>
            <div className="scores">
                <span id="score">
                    <button className="scores-button" id="minus-button_team-one" disabled={teamAScore <= 0}
                            onClick={() => setTeamAScore(teamAScore - 1)}>
                        <FontAwesomeIcon icon={faMinus}/>
                    </button>

                <p className="team-score" id="score-one">{teamAScore}</p>
                <button className="scores-button" id="plus-button_team-one" disabled={teamAScore >= 5}
                        onClick={() => setTeamAScore(teamAScore + 1)}>
                    <FontAwesomeIcon icon={faPlus}/>
                </button>
                </span>

                <h6>Goals</h6>
                <span id="score">
                <button className="scores-button" id="minus-button_team-two" disabled={teamBScore <= 0}
                        onClick={() => setTeamBScore(teamBScore - 1)}>
                    <FontAwesomeIcon icon={faMinus}/>
                </button>
                <p className="team-score" id="score-two">{teamBScore}</p>
                <button className="scores-button" id="plus-button_team-two" disabled={teamBScore >= 5}
                        onClick={() => setTeamBScore(teamBScore + 1)}>
                    <FontAwesomeIcon icon={faPlus}/>
                </button>
                </span>
            </div>
            <div className="save-clear-section">
                <button id="clear" onClick={() => resetFn()} className="save-clear-button">Clear</button>
                <button id="save" onClick={() => {
                    submitFn();
                }} className="save-clear-button">Save
                </button>
            </div>
        </div>
    );
};

export default TeamScoresBoard;
