import React, {useState} from 'react';
import '../styles/StatisticsPage.css'
import {extractTeamName, getTeamColor} from "../components/TeamSelect";
import {useQuery} from "react-query";
import {getStatisticsByFieldNameDate} from "../service/StatisticsService";
import useSelectedField from "../hooks/useSelectedField";
import OutlineShirtSvg from "../assets/OutlineShirtSvg";
import ShirtSvg from "../assets/ShirtSvg";
import Loading from "../components/Loading";
import {getTeamsByFieldAndDate} from "../service/TeamsService";
import {showNotification} from "../App";
import {formatDate} from "./EntryFormPage";
import useFields from "../hooks/useFields";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {motion} from 'framer-motion';

const TeamStatsCard = (team) => {


    const newTeam = team.team;
    return <motion.div className="team-stats-card">
        <motion.span className="stats-header">{newTeam.team.includes("white") ? <OutlineShirtSvg height={60}/> :
            <ShirtSvg fill={getTeamColor(newTeam.team)} width={60}/>}
            <motion.h3>{extractTeamName(newTeam.team)}</motion.h3>
        </motion.span>

        <motion.div>Success rate: <motion.span className="fw-bold">{newTeam.successRate}</motion.span></motion.div>
        <motion.div>Goals per game average: <motion.span className="fw-bold">{newTeam.goalsPerGame}</motion.span>
        </motion.div>
        <motion.div>Goals per game against average: <motion.span
            className="fw-bold">{newTeam.goalsAgainstPerGame}</motion.span></motion.div>
    </motion.div>

};

const Statistics = () => {

    const [teams, setTeams] = useState([])
    const [teamsStats, setTeamsStats] = useState([]);
    const [games, setGames] = useState([])
    const {selectedField} = useSelectedField();
    const {date} = useFields()
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true)

    useQuery(['teams', teams, selectedField, date], () => getTeamsByFieldAndDate({
        field: selectedField,
        date: formatDate(date)
    }), {
        onSuccess: setTeams,
        onError: (err) => {
            showNotification('error', err)
        },
        onSettled: () => setIsLoading(false),
        refetchOnWindowFocus: false
    });

    const getStatistics = async (field, date) => {
        setIsLoading(true);
        return getStatisticsByFieldNameDate({field: field, date: date}).then(res => {
            setIsLoading(false);
            return res;
        })
    }

    useQuery({
        queryFn: () => getStatistics(selectedField, date),
        queryKey: ['statistics', games, selectedField, date],
        onSuccess: (date) => {
            setGames(date)
            calculatePoints()
        },
        onError: (err) => {
            showNotification('error', err)
        }
    });

    const tableInfoInitialStyle = {
        height: 0,
        opacity: 0
    }

    const tableInfoAnimateStyle = {
        height: isOpen ? 200 : 0,
        opacity: isOpen ? 1 : 0
    }

    const TableInfo = <motion.div id='table-info'
                                  initial={tableInfoInitialStyle}
                                  animate={tableInfoAnimateStyle}
    >
        <motion.h6 initial={tableInfoInitialStyle}
                   animate={tableInfoAnimateStyle}>MP - Matches Played
        </motion.h6>
        <motion.h6 initial={tableInfoInitialStyle}
                   animate={tableInfoAnimateStyle}>W - Wins
        </motion.h6>
        <motion.h6 initial={tableInfoInitialStyle}
                   animate={tableInfoAnimateStyle}>D - Draws
        </motion.h6>
        <motion.h6 initial={tableInfoInitialStyle}
                   animate={tableInfoAnimateStyle}>L - Losses
        </motion.h6>
        <motion.h6 initial={tableInfoInitialStyle}
                   animate={tableInfoAnimateStyle}>GS - Goals Scored
        </motion.h6>
        <motion.h6 initial={tableInfoInitialStyle}
                   animate={tableInfoAnimateStyle}>GA - Goals Against
        </motion.h6>
        <motion.h6 initial={tableInfoInitialStyle}
                   animate={tableInfoAnimateStyle}>GD - Goal Difference
        </motion.h6>
    </motion.div>

    const StatisticsTable = ({stats}) => (
        <motion.div className="statistics">
            <motion.table className="statistics-table">
                <motion.thead>
                    <motion.tr>
                        <motion.th className="fw-bold mt-4">#</motion.th>
                        <motion.th>Team</motion.th>
                        <motion.th>MP</motion.th>
                        <motion.th>W</motion.th>
                        <motion.th>D</motion.th>
                        <motion.th>L</motion.th>
                        <motion.th>GS</motion.th>
                        <motion.th>GA</motion.th>
                        <motion.th>GD</motion.th>
                        <motion.th>Pts</motion.th>
                    </motion.tr>
                </motion.thead>
                <motion.tbody initial={{
                    height: 0,
                }}
                animate={{
                    height: "fit-content"
                }}
                >
                    {stats && stats.map((item, index) => (
                        <motion.tr key={index}>
                            <motion.td className="fw-bold">{index + 1}</motion.td>
                            <motion.td>{extractTeamName(item.team)}</motion.td>
                            <motion.td>{item.MP}</motion.td>
                            <motion.td>{item.W}</motion.td>
                            <motion.td>{item.D}</motion.td>
                            <motion.td>{item.L}</motion.td>
                            <motion.td>{item.GS}</motion.td>
                            <motion.td>{item.GA}</motion.td>
                            <motion.td>{item.GD}</motion.td>
                            <motion.td>{item.points}</motion.td>
                        </motion.tr>
                    ))}
                </motion.tbody>
            </motion.table>
            <FontAwesomeIcon className="info-icon" icon={faInfoCircle} onClick={() => setIsOpen(!isOpen)}/>
            {isOpen ? TableInfo : null}
        </motion.div>
    );

    const calculatePoints = () => {
        let tempStats = {};

        teams?.forEach(team => {
            tempStats[team.team] = {
                MP: 0,
                W: 0,
                D: 0,
                L: 0,
                GS: 0,
                GA: 0,
                GD: 0,
                points: 0
            };
        });

        tempStats && games?.forEach(game => {
            const {team_a, team_b, score_a, score_b} = game;

            if (tempStats[team_a] && tempStats[team_b]) {

                tempStats[team_a].MP += 1;
                tempStats[team_b].MP += 1;

                tempStats[team_a].GS += score_a;
                tempStats[team_b].GS += score_b;
                tempStats[team_a].GA += score_b;
                tempStats[team_b].GA += score_a;

                if (score_a > score_b) {
                    tempStats[team_a].W += 1;
                    tempStats[team_b].L += 1;
                    tempStats[team_a].points += 3;
                } else if (score_b > score_a) {
                    tempStats[team_b].W += 1;
                    tempStats[team_a].L += 1;
                    tempStats[team_b].points += 3;
                } else {
                    tempStats[team_a].D += 1;
                    tempStats[team_b].D += 1;
                    tempStats[team_a].points += 1;
                    tempStats[team_b].points += 1;
                }

                tempStats[team_a].GD = tempStats[team_a].GS - tempStats[team_a].GA;
                tempStats[team_b].GD = tempStats[team_b].GS - tempStats[team_b].GA;
            }


        });

        const statsArray = Object.keys(tempStats).map(teamName => ({
            team: teamName,
            ...tempStats[teamName],
        })).sort((a, b) => b.W !== a.W ? b.W - a.W : b.points - a.points);

        setTeamsStats(statsArray);
    };

    const allStatsAreZero = teamsStats.every(team => {
        return team.MP === 0 && team.W === 0 && team.D === 0 && team.L === 0 && team.GS === 0 && team.GA === 0 && team.GD === 0 && team.points === 0;
    });

    const enrichedTeams = teamsStats.map(team => {
            const stats = team
            const averageGoals = stats.MP > 0 ? (stats.GS / stats.MP).toFixed(2) : 0;
            return {
                ...team,
                successRate: stats.MP > 0 ? ((stats.W / stats.MP) * 100).toFixed(2) + '%' : '0%',
                goalsPerGame: parseInt(averageGoals),
                goalsAgainstPerGame: stats.MP > 0 ? (stats.GA / stats.MP).toFixed(1) : 0
            }
        }
    );

    return (
        isLoading ?
            <div className="message">
                <Loading style={{height: '100dvh'}} height={50}/></div> :
            <div className="statistics-container">
                {(teamsStats.length === 0 || allStatsAreZero) ?
                    <div className='message-container'>
                        <h5 className="statistics-message">Statistics for this field
                            are empty for now... <br/> <span>Play first to see team's Statistics</span>
                        </h5>
                    </div> :
                    <>
                        {(games && teamsStats) && <StatisticsTable stats={teamsStats || []}/>}
                        <div>
                            {enrichedTeams.map((team, i) => {
                                return <TeamStatsCard key={i} team={team}/>
                            })}
                        </div>
                    </>
                }
            </div>
    );
};

export default Statistics;
