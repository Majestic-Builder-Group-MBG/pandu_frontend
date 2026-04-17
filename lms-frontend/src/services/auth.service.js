// src/services/auth.service.js
import axios from 'axios';

const API_URL = env.API_URL;

class AuthService {
  async login(user) {
    const response = await axios.post(API_URL + 'login', {
      username: user.username,
      password: user.password
    });
    
    // If successful, the backend usually returns a JWT token
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
  }
}

export default new AuthService();
