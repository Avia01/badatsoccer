import React, {useState} from 'react';
import {useMutation, useQueryClient} from "react-query";
import '../styles/EntryFormPage.css';
import FieldSelect from "../components/FieldSelect";
import TeamScoresBoard from "../components/TeamScoresBoard";
import Scores from "../components/Scores";
import {ToastContainer} from "react-toastify";
import {showNotification} from "../App";
import {addScore} from "../service/ScoreService";
import useSelectedField from "../hooks/useSelectedField";
import {reverseTeamName} from "../components/TeamSelect";
import DatePicker from "../components/DatePicker";
import useFields from "../hooks/useFields";
import useAuth from "../hooks/useAuth";

const EntryFormPage = () => {

    const time = new Date();

    const [isOpen, setIsOpen] = useState(false)

    const [teams, setTeams] = useState([])
    const [teamA, setTeamA] = useState('')
    const [teamB, setTeamB] = useState('')
    const [teamAScore, setTeamAScore] = useState(0);
    const [teamBScore, setTeamBScore] = useState(0);
    const {auth} = useAuth();

    const {date} = useFields()

    const {selectedField} = useSelectedField()

    const queryClient = useQueryClient()

    const {mutate} = useMutation({
        mutationFn: addScore,
        onSuccess: async () => {
            await queryClient.invalidateQueries("score")
            showNotification('success', "Score added successfully!");
            resetScoreForm();
        },
        onError: () => {
            showNotification('error', "Something went wrong. Please try again later");
        }
    })
    const resetScoreForm = () => {
        setTeamAScore(0)
        setTeamBScore(0)
        setTeams([])
        setTeamA('')
        setTeamB('')
    }

    const addScoreToDatabase = async () => {
        const enteredTime = getLocalTime(time);
        let reversedTeamA = reverseTeamName(teamA);
        let reversedTeamB = reverseTeamName(teamB);

        if (teamB !== "" && teamA !== "") {
            mutate({
                "team_a": reversedTeamA,
                "score_a": teamAScore,
                "team_b": reversedTeamB,
                "score_b": teamBScore,
                "entered_by": auth?.gmail ? auth.player_name : 'Anonymous',
                "entered_date": toISODate(date),
                "entered_time": enteredTime,
                "field": selectedField
            });
        } else {
            showNotification('error',"Please select team before submitting");
        }
    }



    return <div className="entry-form-container">
        <ToastContainer/>
        <DatePicker
            title={'Select Date:'}
        />
        <FieldSelect
            teams={teams}
            teamA={teamA}
            setTeamA={setTeamA}
            teamB={teamB}
            resetFunction={resetScoreForm}
            setTeamB={setTeamB}
            setTeams={setTeams}/>

        <TeamScoresBoard
            teamA={teamA}
            teamB={teamB}
            teamAScore={teamAScore}
            teamBScore={teamBScore}
            setTeamAScore={setTeamAScore}
            setTeamBScore={setTeamBScore}
            resetFn={resetScoreForm}
            submitFn={addScoreToDatabase}
        />
        <Scores
            isModalOpen={isOpen}
            setIsModalOpen={setIsOpen}
        />
    </div>
}
export default EntryFormPage;

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    });
};
export const getLocalTime = (time = new Date()) => {
    return time.toLocaleString('he-IL', {hour: '2-digit', minute: "2-digit"});
}

export const toISODate = (date) => {
    return new Date(date).toLocaleString('fr-CA', {year: "numeric", month: '2-digit', day: '2-digit'})
}