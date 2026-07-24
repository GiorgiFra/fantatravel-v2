import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {TravelService} from "./travel-service";
import {useNavigate} from "react-router-dom";
import {
    CreateTravelRequest,
    LinkRuleTravelRequest,
    LinkSpecialCategoryTravelRequest,
    ReviewedTravelRequest,
    TravelModel
} from "../../models/models";
import {AxiosError} from "axios";

const {
    getTravels, createTravel,
    getTravel, getRulesToLink,
    linkRules, deleteTravel,
    linkUser, getTeams, getTravelers,
    linkSpecialCategories, getSpecialCategoriesToLink,
    getSpecialCategories, review
} = TravelService();

export const useGetTravels = () => {
    return useQuery({
        queryKey: ["travels"],
        queryFn: (params: any) => getTravels(),
    });
};

export const useGetTeams = () => {
    return useQuery({
        queryKey: ["teams"],
        queryFn: () => getTeams(),
    });
};

export const useGetTravel = (id: number) => {
    return useQuery({
        queryKey: ["travel", id],
        queryFn: () => getTravel(id),
    });
};

export const useGetTravelers = (id: number) => {
    return useQuery({
        queryKey: ["travelers", id],
        enabled: !!id,
        queryFn: () => getTravelers(id),
    });
};
export const useDeleteTravel = () => {
    return useMutation({
        mutationKey: ["deleteTravel"],
        mutationFn: (id: number) => deleteTravel(id),
    });
};

export const useGetRulesToLink = (id: number) => {
    return useQuery({
        queryKey: ["rules-to-link", id],
        queryFn: () => getRulesToLink(id),
    });
};

export const useGetSpecialCategoriesToLink = (id: number) => {
    return useQuery({
        queryKey: ["special-categories-to-link", id],
        queryFn: () => getSpecialCategoriesToLink(id),
    });
};
export const useCreateTravel = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationKey: ["createTravel"],
        mutationFn: (params: CreateTravelRequest) => createTravel(params),
        onSuccess: async (data: TravelModel) => {
            navigate(`/travels`);
        }
    });
};
export const useLinkRules = (id: number) => {
    const navigate = useNavigate();
    return useMutation({
        mutationKey: ["linkRules"],
        mutationFn: (params: LinkRuleTravelRequest) => linkRules(id, params),
        onSuccess: async (data: TravelModel) => {
            navigate(`/travels/${data.id}`);
        }
    });
};

export const useLinkSpecialCategories = (id: number) => {
    const navigate = useNavigate();
    return useMutation({
        mutationKey: ["linkSpecialCategories"],
        mutationFn: (params: LinkSpecialCategoryTravelRequest) => linkSpecialCategories(id, params),
        onSuccess: async (data: TravelModel) => {
            navigate(`/travels/${data.id}`);
        }
    });
};
export const useLinkUser = (id: number) => {
    const navigate = useNavigate();
    const queryClient= useQueryClient()
    return useMutation({
        mutationKey: ["linkRules", id],
        mutationFn: (role: 'TRAVELER' | 'PLAYER') => linkUser(id, role),
        onSuccess: async () => {
            navigate(`/travels/${id}`);
            queryClient.invalidateQueries({ queryKey: ["travel", id] });
        }
    });
};

export const useGetSpecialCategories = (id: number) => {
    return useQuery({
        queryKey: ["special-categories", id],
        queryFn: () => getSpecialCategories(id),
    });
};
export const useReview = (id: number) => {
    const navigate = useNavigate();
    const queryClient= useQueryClient()
    return useMutation<TravelModel, AxiosError, ReviewedTravelRequest>({
        mutationKey: ["review", id],
        mutationFn: (request: ReviewedTravelRequest) => review(id, request),
        onSuccess: async () => {
            navigate(`/travels/${id}`);
            queryClient.invalidateQueries({ queryKey: ["travels", id] });
        }
    });
};