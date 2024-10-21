import React, {useState} from 'react';
import '../styles/CardsAccordion.css';
import OutlineShirtSvg from "../assets/OutlineShirtSvg";
import ShirtSvg from "../assets/ShirtSvg";
import {formatDate} from "../pages/EntryFormPage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {showNotification} from "../App";
import {deleteScore} from "../service/ScoreService";
import {getTeamColor} from "./TeamSelect";
import {Spinner} from "react-bootstrap";

const CardsAccordion = ({data, selectedScore, toggleExpand, refetch, handleScoreSelect}) => {

    const score = data;
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="cards-container">
            <ul
                className={`scores-card ${selectedScore === score.score_id ? 'open' : ''}`}>
                <div className="score-teams" onClick={() => toggleExpand(score.score_id)}>
                            <span className="card-teams-header">{score.team_a.includes("white") ?
                                <OutlineShirtSvg height={40}/> :
                                <ShirtSvg fill={getTeamColor(score.team_a)} width={40}/>}
                                <span className="score">
                                <p style={{fontWeight: score.score_a > score.score_b ? 900 : 500}}>{score.score_a}</p>
                                <p>-</p>
                                <p style={{fontWeight: score.score_b > score.score_a ? 900 : 500}}>{score.score_b}</p>
                            </span>
                                {score.team_b.includes("white") ? <OutlineShirtSvg height={40}/> :
                                    <ShirtSvg fill={getTeamColor(score.team_b)} width={40}/>}</span>
                    <FontAwesomeIcon id={selectedScore === score.score_id ? "plus" : "x-mark"}
                                     icon={faPlus}/>
                </div>
                <div className="content">
                    <div className="score-details">
                        <h5>{score.entered_time}</h5>
                        <h5>{formatDate(score.entered_date)}</h5>
                        <h5>{score.entered_by}</h5>
                        <h5>{score.field}</h5>
                    </div>
                    <div className="options">
                        <button id="delete-button" disabled={isLoading} onClick={async () => {
                            setIsLoading(true);
                            deleteScore(score.score_id).then(_ => {
                                showNotification('success', "Score deleted successfully!");
                                refetch().then(_ => setIsLoading(false));
                            })
                        }}>{isLoading ? <Spinner size={'sm'} style={{color: '#3CB371'}}  animation={"border"}/> : 'Delete'}
                        </button>
                        <button id="edit-button" onClick={() => handleScoreSelect(score.score_id)}>Edit</button>
                    </div>
                </div>

            </ul>
        </div>
    );
};

export default CardsAccordion;
