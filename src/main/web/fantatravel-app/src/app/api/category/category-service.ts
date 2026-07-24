import axiosInstance from '../axios-client';
import {CategoryModel} from "../../models/models";

interface CategoryMethods {
    /** calls POST /categories */
    getCategories: () => Promise<CategoryModel[]>;
}

export const CategoryService = (): CategoryMethods => {
    const getCategories = async (): Promise<CategoryModel[]> => {
        const response = await axiosInstance.get<CategoryModel[]>('/categories');
        return response.data;
    };

    return {
        getCategories,
    };
};

