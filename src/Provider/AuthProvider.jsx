import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { createContext, useEffect, useState } from "react";
import { auth } from "../Firebase/firebase.config";

// import useAxiosPublic from "../Hooks/useAxiosPublic";

export const AuthContext = createContext(null);

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  // const axiosPublic = useAxiosPublic();

  // Google login
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // email password sign up
  const signUpWithEmailAndPassword = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // email password login
  const loginWithEmailAndPassword = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Log out
  const logOut = () => {
    console.log("hello")
    setLoading(true);
    return signOut(auth);
  };


  const updateUserProfile = async (displayName, photoURL) => {
    try {
      setLoading(true); 
      const profileData = {};
      if (displayName) {
        profileData.displayName = displayName;
      }
      if (photoURL) {
        profileData.photoURL = photoURL;
      }
      await updateProfile(auth.currentUser, profileData);
      console.log("User profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(currentUser);
    });
    return () => {
      unsubscribe();
    };
  });

  // User updating


  const authInfo = {
    googleLogin,
    signUpWithEmailAndPassword,
    loginWithEmailAndPassword,
    user,
    logOut,
    updateUserProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;