import axios from "../api/axios";

const GET_IMAGES_FROM_AZURE = '/get_images_from_azure'
const UPDATE_PLAYERS_IMAGES='/update_players_images'

export const getImagesFromAzure = async () => {
    const response  = await axios.get(GET_IMAGES_FROM_AZURE)
    return response.data;
}

export const updatePlayersImagesAzure = async () => {
     return await axios.get(UPDATE_PLAYERS_IMAGES)
}