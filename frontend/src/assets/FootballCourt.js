import React from 'react';
import '../styles/FootballCourt.css';


const FootballCourt = ({child}) => {

    return (
        <div className="field-container">
            {child}
            <div className="soccer-field">
                <div className="goal-one"></div>
                <div className="half-way-line"></div>
                <div className="center-circle">
                    <div className="center-dot"></div>
                </div>
                <div className="goal-two"></div>
            </div>
        </div>
    );
};

export default FootballCourt;
