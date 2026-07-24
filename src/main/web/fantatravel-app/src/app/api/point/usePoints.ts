import {useMutation, useQuery} from '@tanstack/react-query';
import {AddPointRequest} from "../../models/models";
import {PointService} from "./point-service";

const {
    addPoints,
    getPoints,
    getPointsByDay,
    getTotalPoints,
    getTotalPointsPlayers,
    getNotSelectableTravelers
} = PointService();

export const useAddPoints = () => {
    return useMutation({
        mutationKey: ["points"],
        mutationFn: (params: AddPointRequest) => addPoints(params),
    });
};



export const useGetPoints = (travelId: number|undefined) => {
    return useQuery({
        queryKey: ["points", travelId],
        enabled: !!travelId,
        queryFn: () => getPoints(travelId!),
    });
};

export const useGetTotalPoints = (travelId: number|undefined) => {
    return useQuery({
        queryKey: ["total-points", travelId],
        enabled: !!travelId,
        queryFn: () => getTotalPoints(travelId!),
    });
};

export const useGetTotalPointsPlayers = (travelId: number|undefined) => {
    return useQuery({
        queryKey: ["total-points-players", travelId],
        enabled: !!travelId,
        queryFn: () => getTotalPointsPlayers(travelId!),
    });
};

export const useGetPointsByDay = (travelId: number|undefined, day:string|undefined) => {
    return useQuery({
        queryKey: ["points", travelId, day],
        enabled: !!travelId && !!day,
        queryFn: () => getPointsByDay(travelId!, day!),
    });
};

export const useNotSelectableTravelers = (travelId: number|undefined, day:string|undefined) => {
    return useQuery({
        queryKey: ["not-selectable-travelers", travelId, day],
        enabled: !!travelId && !!day,
        queryFn: () => getNotSelectableTravelers(travelId!, day!),
    });
};
