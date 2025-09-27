import { useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types/domain';
import { useAppStore } from '../lib/store';

export function useAuth() {
  const { setUser, setAuthenticated, setLoading } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
            setAuthenticated(true);
          } else {
            // User document doesn't exist, they need to complete onboarding
            setUser(null);
            setAuthenticated(false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setAuthenticated(false);
        }
      } else {
        setUser(null);
        setAuthenticated(false);
      }
      
      setIsLoading(false);
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setAuthenticated, setLoading]);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const createUserDocument = async (firebaseUser: FirebaseUser, onboardingData: any) => {
    try {
      const userData: User = {
        uid: firebaseUser.uid,
        displayName: onboardingData.displayName,
        email: firebaseUser.email!,
        photoURL: firebaseUser.photoURL || undefined,
        stats: {
          STR: 0,
          VIT: 0,
          INT: 0,
          WIS: 0,
          DEX: 0,
          CHA: 0,
        },
        totalXP: 0,
        level: 1,
        streak: {
          count: 0,
          lastCompletedISO: null,
        },
        debuff: {
          percent: 0,
          expiresAtISO: null,
        },
        goals: onboardingData.goals,
        resetHour: onboardingData.resetHour,
        title: 'Rookie Hunter',
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      setUser(userData);
      setAuthenticated(true);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut: signOutUser,
    createUserDocument,
  };
}
