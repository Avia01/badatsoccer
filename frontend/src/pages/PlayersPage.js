import React from 'react';
import '../styles/PlayersPage.css'
import FootballCourt from "../assets/FootballCourt";
import usePlayers from "../hooks/usePlayers";
import Players from "../components/Players";
import Loading from "../components/Loading";

const PlayersPage = () => {

    const {playerId, player, players, isFetching} = usePlayers()

    const groupByTeam = Object.groupBy(players.filter(player => player && player?.team_to_pick), ({team_to_pick}) => {
        return team_to_pick.replace(' ', '_');
    });

    const renderPlayers = (teams) => {
        if (playerId) {
            const child = <>
                <h5 style={{
                    textAlign: "center",
                    margin: '1em 0 0 0',
                    fontWeight: 600
                }}>{teams ? player[0]?.team_to_pick : ''}</h5>
                <div className="players-list" style={{
                    height: (document.body.clientHeight / 3)
                }}><Players team={player}/></div>
            </>
            return <FootballCourt child={child}/>
        } else {
            return Object.entries(teams).map((team) => {
                const teamName = team[0].replace('_', ' ');
                const child = <>
                    <h5 style={{textAlign: "center", margin: '1em 0 0 0',fontWeight: 600}}>{teamName}</h5>
                    <div className="players-list"><Players key={team[1].team_to_pick} team={team[1]}/></div>
                </>
                return <FootballCourt child={child}/>
            });
        }
    }

    return (
        <div className="players-container">{isFetching ?
            <div className="message">
                <Loading style={{height: '100dvh'}} height={50}/></div>
            : <>{ players ? renderPlayers(groupByTeam) : <div><h5>Pick a Field first...</h5></div>}</>}
        </div>
    );
};

export default PlayersPage;
