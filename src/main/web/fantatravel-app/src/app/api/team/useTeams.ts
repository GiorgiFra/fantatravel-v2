import {useMutation, useQuery} from '@tanstack/react-query';
import {useNavigate} from "react-router-dom";
import {CreateTeamRequest, TeamModel} from "../../models/models";
import {TeamService} from "./team-service";

const {
    getTeam, createTeam, updateTeam
} = TeamService();

export const useGetTeam = (id: number|undefined) => {
    return useQuery({
        queryKey: ["team", id],
        enabled: !!id,
        queryFn: () => getTeam(id!),
    });
};
export const useCreateTeam = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationKey: ["createTeam"],
        mutationFn: (params: CreateTeamRequest) => createTeam(params),
        onSuccess: async (data: TeamModel) => {
            navigate(`/teams`);
        }
    });
};
export const useUpdateTeam = (id: number|undefined) => {
    const navigate = useNavigate();
    return useMutation({
        mutationKey: ["updateTeam", id],
        mutationFn: (params: CreateTeamRequest) => updateTeam(id, params),
        onSuccess: async (data: TeamModel) => {
            navigate(`/teams`);
        }
    });
};