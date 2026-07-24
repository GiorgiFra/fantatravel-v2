import {useQuery} from '@tanstack/react-query';
import {CategoryService} from "./category-service";

const { getCategories } = CategoryService();

export const useGetCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
    });
};
