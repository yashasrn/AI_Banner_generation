import firebase from './FirebaseConfig';

const AuthService = {
  login: async (email, password) => {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  },
  signup: async (email, password) => {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    return userCredential.user;
  },
};

export default AuthService;
