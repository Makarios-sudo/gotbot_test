import { apiService } from "./apiServices";

export const foodService = {
    getAll: () => apiService.get('/foods/list_food'),
    create: (foodItem) => apiService.post('/foods/add_food', foodItem),
    update: (id, foodItem) => apiService.put(`/foods/${id}/update_food`, foodItem),
    delete: (id) => apiService.delete(`/foods/${id}/delete_food`),
    getById: (id) => apiService.get(`/foods/${id}/get_food`),
};