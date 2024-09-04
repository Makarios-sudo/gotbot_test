

import { apiService } from './apiServices';

export const authService = {
  register: (user) => apiService.post('/users/register', user),
  login: (user) => apiService.post('/users/login', user),
};
