import { createContext, useContext, useEffect, useState } from "react";
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  getIdToken
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.status === 'deleted') {
            await signOut(auth);
            setUserData(null);
          } else {
            setUserData(data);
          }
        }
      } else {
        setUserData(null);
      }
      setLoading(false); 
    });
    return () => unsubscribe();
  }, []);

  const getAuthToken = async () => {
    if (!auth.currentUser) {
      console.error("Tentativa de obter token sem usuário logado.");
      return null;
    }

    return await getIdToken(auth.currentUser, true);
  };

  const signup = async (nome, email, password, role = 'student') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    const newUserData = {
      nome: nome,
      email: email,
      createdAt: serverTimestamp(),
      status: 'active', 
      role: role 
    };
    await setDoc(doc(db, "users", newUser.uid), newUserData);
    setUserData(newUserData);
    return newUser;
  };
  
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const loggedUser = userCredential.user;
    const userDocRef = doc(db, "users", loggedUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data().status === 'deleted') {
      const querReativar = window.confirm("Esta conta foi desativada. Deseja reativá-la?");
      if (querReativar) {
        await updateDoc(userDocRef, { status: 'active' });
        setUserData({ ...userDoc.data(), status: 'active' }); 
      } else {
        await signOut(auth);
        throw new Error("Login cancelado pelo usuário.");
      }
    } else if (userDoc.exists()) {
        setUserData(userDoc.data());
    }
    return userCredential;
  };
  
  const loginComGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists() || userDoc.data().status === 'deleted') {
        const newUserData = {
            nome: user.displayName,
            email: user.email,
            createdAt: serverTimestamp(),
            status: 'active',
            role: 'student' 
        };
        await setDoc(userDocRef, newUserData, { merge: true });
        setUserData(newUserData);
    } else {
        setUserData(userDoc.data());
    }
  };

  const deleteAccount = async () => {
    if (!user) throw new Error("Usuário não autenticado.");
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { status: 'deleted', deletedAt: serverTimestamp() });
    await logout();
  };
  
  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    userData,
    loading,
    getAuthToken,
    isGoogleProvider: user?.providerData.some(p => p.providerId === 'google.com'),
    signup,
    login,
    logout,
    loginComGoogle,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}