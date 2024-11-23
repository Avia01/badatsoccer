import React, {useState} from 'react';
import {getImagesFromAzure} from "../service/ImagesService";
import {useQuery} from "react-query";
import {getTeamColor} from "./TeamSelect";


const ImageViewer = ({name, results}) => {
    const [imageUrl, setImageUrl] = useState([]);

    useQuery({
        queryKey: ['image'],
        queryFn: getImagesFromAzure,
        onSuccess: setImageUrl
    });

    const updatedPlayers = results.map(player => {
        const imageEntry = imageUrl.find(image => {
            return image.player_name.split('.')[0].toLowerCase() === player.player_name.toLowerCase()
        });
        return {
            ...player,
            player_url: imageEntry ? imageEntry.player_url : ''
        };
    });

    return (
        <>
            {updatedPlayers.filter((item) => item.player_name === name).map(player =>
                player.player_url ?
                    <img src={player.player_url} alt={player.player_name} className='player-image' style={{
                        outline: `4px solid ${getTeamColor(player.team_to_pick)}`,
                        // backgroundImage: `url(${player.player_url})`,
                    }}/> :
                    <img style={{outline: `4px solid ${getTeamColor(player.team_to_pick)}`}}
                         src="https://q-reviews.com/wp-content/uploads/2022/08/Profile_avatar_placeholder_large.png"
                     alt="player"/>)}
        </>
    );
};

export default ImageViewer;