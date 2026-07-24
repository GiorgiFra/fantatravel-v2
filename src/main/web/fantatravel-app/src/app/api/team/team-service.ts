import axiosInstance from '../axios-client';
import {CreateTeamRequest, TeamModel} from "../../models/models";

interface TeamMethods {
    /** calls POST /travel */
    getTeam: (id: number) => Promise<TeamModel>;
    createTeam: (request: CreateTeamRequest) => Promise<TeamModel>;
    updateTeam: (id:number|undefined, request: CreateTeamRequest) => Promise<TeamModel>;
}

export const TeamService = (): TeamMethods => {
    const getTeam = async (id: number): Promise<TeamModel> => {
        const response = await axiosInstance.get<TeamModel>(`/teams/${id}`);
        return response.data;
    };
    const createTeam = async (request: CreateTeamRequest): Promise<TeamModel> => {
        const response = await axiosInstance.post<TeamModel>('/teams/create', request);
        return response.data;
    };
    const updateTeam = async (id: number|undefined, request: CreateTeamRequest): Promise<TeamModel> => {
        const response = await axiosInstance.post<TeamModel>(`/teams/${id}/update`, request);
        return response.data;
    };

    return {
        createTeam,
        getTeam,
        updateTeam
    };
};

