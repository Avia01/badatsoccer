import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Button, Spinner} from "react-bootstrap";
import {useMutation, useQuery} from "react-query";
import {getScoreById, updateScoreById} from "../service/ScoreService";
import '../styles/MyModal.css'
import {showNotification} from "../App";
import {getLocalTime} from "../pages/EntryFormPage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";

const EditScoreModal = (props) => {

    const scoreId = props.selectedScore;

    const time = new Date()

    const [scoreA, setScoreA] = useState(null)
    const [scoreB, setScoreB] = useState(null)

    const {data: score} = useQuery({
        queryFn: () => getScoreById(scoreId).then(res => {
            setScoreA(res[0].score_a)
            setScoreB(res[0].score_b)
            return res
        }),
        queryKey: ["score", scoreId]
    });

    const {mutate} = useMutation({
        mutationFn: (data) => updateScoreById(data),
        onSuccess: (data) => {
            props.refetch()
            showNotification('success', data.message);
        },
        onError: () => showNotification('error', 'oops... something went wrong')
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const enteredTime = getLocalTime(time);

        mutate({
            score_id: scoreId,
            score_a: scoreA,
            score_b: scoreB,
            entered_time: enteredTime,
            entered_date: score[0].entered_date
        })
        props.onHide()
    }

    const handleClose = () => {
        props.onHide()
    }

    return (
        score && <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Update Score
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {score ? <>
                        <span>
                            <label>Host team</label>
                            <span className="modal-points">
                                <button className="scores-button" disabled={scoreA === 5} onClick={() => setScoreA(scoreA + 1)}><FontAwesomeIcon
                                    id="plus-icon" icon={faPlus}/></button>
                                <h5>{scoreA}</h5>
                                <button className="scores-button" disabled={scoreA === 0}><FontAwesomeIcon
                                    id="minus-icon" icon={faMinus} onClick={() => setScoreA(scoreA - 1)}/></button>
                            </span>
                        </span>
                        <span>
                            <label>Gust team</label>
                            <span className="modal-points">
                                <button className="scores-button" onClick={() => setScoreB(scoreB - 1)}
                                        disabled={scoreB === 0}><FontAwesomeIcon id="minus-icon"
                                                                                 icon={faMinus}/></button>
                                <h5 id>{scoreB}</h5>
                                <button className="scores-button" disabled={scoreB === 5}><FontAwesomeIcon
                                    id="plus-icon" icon={faPlus}
                                    onClick={() => setScoreB(scoreB + 1)}/></button>
                                </span>
                        </span>
                    </> :
                    <Spinner animation={"border"}/>}
            </Modal.Body>
            <Modal.Footer>
                <Button id="close" onClick={() => handleClose()}>Close</Button>
                <Button id="submit" onClick={(e) => handleSubmit(e)}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditScoreModal;