import React from 'react';
import SoccerBallSvg from "../assets/SoccerBallSvg";
import '../styles/Loading.css';

const Loading = ({height, style}) => {
    return (
        <div className="loading" style={style}><SoccerBallSvg height={height}/></div>
    );
};

export default Loading;
