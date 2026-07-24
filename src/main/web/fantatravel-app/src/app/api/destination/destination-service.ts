import axiosInstance from '../axios-client';
import {DestinationModel} from "../../models/models";

interface DestinationMethods {
    /** calls POST /destinations */
    getDestinations: () => Promise<DestinationModel[]>;
}

export const DestinationService = (): DestinationMethods => {
    const getDestinations = async (): Promise<DestinationModel[]> => {
        const response = await axiosInstance.get<DestinationModel[]>('/destinations');
        return response.data;
    };

    return {
        getDestinations,
    };
};

