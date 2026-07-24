import {useQuery} from '@tanstack/react-query';
import {DestinationService} from "./destination-service";

const { getDestinations } = DestinationService();

export const useGetDestinations = () => {
    return useQuery({
        queryKey: ["destinations"],
        queryFn: (params: any) => getDestinations(),
    });
};
