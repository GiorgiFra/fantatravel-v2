import axiosInstance from '../axios-client';
import {AddPointRequest, NotSelectableTravelersModel, PointsDayModel, PointsUserModel} from "../../models/models";

interface PointMethods {
    /** calls POST /points */
    addPoints: (request: AddPointRequest) => Promise<void>;
    /** calls POST /points */
    getPoints: (travelId: number) => Promise<PointsDayModel[]>;
    /** calls POST /points/total */
    getTotalPoints: (travelId: number) => Promise<PointsUserModel[]>;
    /** calls POST /points/total/players */
    getTotalPointsPlayers: (travelId: number) => Promise<PointsUserModel[]>;
    /** calls POST /points/{day} */
    getPointsByDay: (travelId: number, day: string) => Promise<AddPointRequest>;
    /** calls POST /points/{day}/notSelectableTravelers */
    getNotSelectableTravelers: (travelId: number, day: string) => Promise<NotSelectableTravelersModel[]>;
}

export const PointService = (): PointMethods => {
    const addPoints = async (request: AddPointRequest): Promise<void> => {
        const response = await axiosInstance.post<void>('/points', request);
        return response.data;
    };

    const getPoints = async (travelId: number): Promise<PointsDayModel[]> => {
        const response = await axiosInstance.get<PointsDayModel[]>('/points', {
            params: { travelId}
        } );
        return response.data;
    };

    const getTotalPoints = async (travelId: number): Promise<PointsUserModel[]> => {
        const response = await axiosInstance.get<PointsUserModel[]>('/points/total', {
            params: { travelId}
        } );
        return response.data;
    };

    const getTotalPointsPlayers = async (travelId: number): Promise<PointsUserModel[]> => {
        const response = await axiosInstance.get<PointsUserModel[]>('/points/total/players', {
            params: { travelId}
        } );
        return response.data;
    };

    const getPointsByDay = async (travelId: number, day: string): Promise<AddPointRequest> => {
        const response = await axiosInstance.get<AddPointRequest>(`/points/${day}`, {
            params: { travelId}
        } );
        return response.data;
    };

    const getNotSelectableTravelers = async (travelId: number, day: string): Promise<NotSelectableTravelersModel[]> => {
        const response = await axiosInstance.get<NotSelectableTravelersModel[]>(`/points/notSelectableTravelers/${day}`, {
            params: { travelId}
        } );
        return response.data;
    };

    return {
        addPoints,
        getPoints,
        getPointsByDay,
        getTotalPoints,
        getTotalPointsPlayers,
        getNotSelectableTravelers
    };
};

