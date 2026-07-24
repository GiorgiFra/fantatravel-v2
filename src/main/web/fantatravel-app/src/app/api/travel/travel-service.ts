import axiosInstance from '../axios-client';
import {
    CreateTravelRequest,
    LinkRuleTravelRequest, LinkSpecialCategoryTravelRequest, ReviewedTravelRequest,
    RuleModel,
    SpecialCategoryModel,
    TravelModel,
    TravelUserModel
} from "../../models/models";

interface TravelMethods {
    /** calls POST /travel */
    getTravels: () => Promise<TravelModel[]>;
    getTeams: () => Promise<TravelModel[]>;
    getTravel: (id: number) => Promise<TravelModel>;
    deleteTravel: (id: number) => Promise<string>;
    getRulesToLink: (id: number) => Promise<RuleModel[]>;
    linkRules: (id: number, request: LinkRuleTravelRequest) => Promise<TravelModel>;
    getTravelers: (id: number) => Promise<TravelUserModel[]>;
    linkUser: (id: number, role: 'TRAVELER' | 'PLAYER') => Promise<number>;
    createTravel: (request: CreateTravelRequest) => Promise<TravelModel>;
    getSpecialCategoriesToLink: (id: number) => Promise<SpecialCategoryModel[]>;
    getSpecialCategories: (id: number) => Promise<SpecialCategoryModel[]>;
    linkSpecialCategories: (id: number, request: LinkSpecialCategoryTravelRequest) => Promise<TravelModel>;
    review: (id: number, request: ReviewedTravelRequest) => Promise<TravelModel>;
}

export const TravelService = (): TravelMethods => {
    const getTravels = async (): Promise<TravelModel[]> => {
        const response = await axiosInstance.get<TravelModel[]>('/travels');
        return response.data;
    };
    const getTeams = async (): Promise<TravelModel[]> => {
        const response = await axiosInstance.get<TravelModel[]>('/travels/teams');
        return response.data;
    };
    const getTravel = async (id: number): Promise<TravelModel> => {
        const response = await axiosInstance.get<TravelModel>(`/travels/${id}`);
        return response.data;
    };
    const deleteTravel = async (id: number): Promise<string> => {
        const response = await axiosInstance.delete<string>(`/travels/${id}`);
        return response.data;
    };

    const getRulesToLink = async (id: number): Promise<RuleModel[]> => {
        const response = await axiosInstance.get<RuleModel[]>(`/travels/${id}/link-rules`);
        return response.data;
    };

    const getSpecialCategoriesToLink = async (id: number): Promise<SpecialCategoryModel[]> => {
        const response = await axiosInstance.get<SpecialCategoryModel[]>(`/travels/${id}/link-special-categories`);
        return response.data;
    };

    const getTravelers = async (id: number): Promise<TravelUserModel[]> => {
        const response = await axiosInstance.get<TravelUserModel[]>(`/travels/${id}/travelers`);
        return response.data;
    };
    const createTravel = async (request: CreateTravelRequest): Promise<TravelModel> => {
        const response = await axiosInstance.post<TravelModel>('/travels/create', request);
        return response.data;
    };
    const linkRules = async (id: number, request: LinkRuleTravelRequest): Promise<TravelModel> => {
        const response = await axiosInstance.post<TravelModel>(`/travels/${id}/link-rules`, request);
        return response.data;
    };
    const linkSpecialCategories = async (id: number, request: LinkSpecialCategoryTravelRequest): Promise<TravelModel> => {
        const response = await axiosInstance.post<TravelModel>(`/travels/${id}/link-special-categories`, request);
        return response.data;
    };
    const linkUser = async (id: number, role: 'TRAVELER' | 'PLAYER'): Promise<number> => {
        const response = await axiosInstance.post<number>(`/travels/${id}/link-user`,
            {},
            {params: {userType: role}});
        return response.data;
    };

    const getSpecialCategories = async (id: number): Promise<SpecialCategoryModel[]> => {
        const response = await axiosInstance.get<SpecialCategoryModel[]>(`/travels/${id}/special-categories`);
        return response.data;
    };

    const review = async (id: number, request: ReviewedTravelRequest): Promise<TravelModel> => {
        const response = await axiosInstance.post<TravelModel>(`/travels/${id}/review`,
            request);
        return response.data;
    };

    return {
        getTravels,
        getTravel,
        createTravel,
        getRulesToLink,
        linkRules,
        deleteTravel,
        linkUser,
        getTeams,
        getTravelers,
        linkSpecialCategories,
        getSpecialCategoriesToLink,
        getSpecialCategories,
        review
    };
};

