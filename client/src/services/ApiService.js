import axios from 'axios';

const ApiService = {
  signupUser: (data) => axios.post('/api/auth/signup', data),
  loginUser: (data) => axios.post('/api/auth/login', data),
  generateBanner: (data) => axios.post('/api/banner/generate', data),
};

export default ApiService;
