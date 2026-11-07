import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  onSnapshot 
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType, testConnection } from '../lib/firebase';
import { Bike, FuelLog, MaintenanceTask, MaintenanceLogEntry, GpsTrip } from '../types';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  syncBikeToCloud: (bike: Bike) => Promise<void>;
  syncFuelLogToCloud: (log: FuelLog) => Promise<void>;
  syncTaskToCloud: (task: MaintenanceTask) => Promise<void>;
  syncServiceLogToCloud: (entry: MaintenanceLogEntry) => Promise<void>;
  syncTripToCloud: (trip: GpsTrip) => Promise<void>;
  isCloudSyncing: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        // Ensure user document exists
        try {
          await setDoc(
            doc(db, 'users', currentUser.uid),
            {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Piloto Pit Racer',
              lastActive: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (err) {
          console.error('Error saving user profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-Out Error:', error);
    }
  };

  const syncBikeToCloud = async (bike: Bike) => {
    if (!user) return;
    setIsCloudSyncing(true);
    try {
      await setDoc(doc(db, 'bikes', bike.id), {
        ...bike,
        userId: user.uid,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `bikes/${bike.id}`);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const syncFuelLogToCloud = async (log: FuelLog) => {
    if (!user) return;
    setIsCloudSyncing(true);
    try {
      await setDoc(doc(db, 'fuel_logs', log.id), {
        ...log,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `fuel_logs/${log.id}`);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const syncTaskToCloud = async (task: MaintenanceTask) => {
    if (!user) return;
    setIsCloudSyncing(true);
    try {
      await setDoc(doc(db, 'maintenance_tasks', task.id), {
        ...task,
        userId: user.uid,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `maintenance_tasks/${task.id}`);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const syncServiceLogToCloud = async (entry: MaintenanceLogEntry) => {
    if (!user) return;
    setIsCloudSyncing(true);
    try {
      await setDoc(doc(db, 'service_logs', entry.id), {
        ...entry,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `service_logs/${entry.id}`);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const syncTripToCloud = async (trip: GpsTrip) => {
    if (!user) return;
    setIsCloudSyncing(true);
    try {
      await setDoc(doc(db, 'trips', trip.id), {
        ...trip,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `trips/${trip.id}`);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        logOut,
        syncBikeToCloud,
        syncFuelLogToCloud,
        syncTaskToCloud,
        syncServiceLogToCloud,
        syncTripToCloud,
        isCloudSyncing,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
