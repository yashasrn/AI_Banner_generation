class UserHistoryService {
    static saveUserHistory(prompt, response) {
      const history = JSON.parse(localStorage.getItem('userHistory')) || [];
      history.push({ prompt, response, timestamp: new Date() });
      localStorage.setItem('userHistory', JSON.stringify(history));
    }
  
    static getUserHistory() {
      return JSON.parse(localStorage.getItem('userHistory')) || [];
    }
  }
  
  export default UserHistoryService;
  