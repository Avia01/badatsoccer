import ImageViewer from "./ImageViewer";

const Players = ({team = Array}) => {

    return (
        <>
            {team.map((player) => {
                return (
                    <div className="player" key={player.id}>
                        <ImageViewer name={player.player_name} results={team}/>
                        <h5 className="player-name">{player.player_name}</h5>
                    </div>
                )
            })
            }
        </>
    );
}
export default Players