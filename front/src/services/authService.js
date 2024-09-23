import apiAxios from '../libs/axios';

class AuthService {
  async refreshToken() {
    try {
      await apiAxios.get('/api/refresh-token');
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token", error);
      throw error;
    }
  }

  async getUserData() {
    try {
      const response = await apiAxios.get('/api/me');
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur", error);
      throw error;
    }
  }
}

export const authService = new AuthService();