import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AstronautBiometrics, INITIAL_BIOMETRICS } from '../data/lsahData';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

export interface AstronautAccountData {
  uid: string;
  displayName: string;
  callsign: string;
  starsEarned: number;
  selectedSymptoms: string[];
  biometrics: AstronautBiometrics;
  completedTests: string[];
}

export interface CheckinEntry {
  id: string;
  title: string;
  note: string;
  starReward: number;
  createdAt?: Timestamp;
}

export async function signInWithGoogle(): Promise<User> {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export async function signOutAccount(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function loadOrCreateAstronautProfile(
  user: User,
  fallbackState: {
    starsEarned: number;
    selectedSymptoms: string[];
    biometrics: AstronautBiometrics;
  }
): Promise<AstronautAccountData> {
  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as AstronautAccountData;
      return {
        ...data,
        biometrics: { ...INITIAL_BIOMETRICS, ...(data.biometrics ?? {}) },
        selectedSymptoms: Array.isArray(data.selectedSymptoms) ? data.selectedSymptoms.slice(0, 10) : [],
        completedTests: Array.isArray(data.completedTests) ? data.completedTests.slice(0, 30) : [],
      };
    }

    const safeDisplay = (user.displayName || 'Crew Member').slice(0, 80);
    const initialDoc: AstronautAccountData & { createdAt: unknown; updatedAt: unknown } = {
      uid: user.uid,
      displayName: safeDisplay,
      callsign: safeDisplay.split(' ')[0].slice(0, 40) || 'Astronaut',
      starsEarned: Math.max(0, Math.min(100, fallbackState.starsEarned)),
      selectedSymptoms: fallbackState.selectedSymptoms.slice(0, 10),
      biometrics: fallbackState.biometrics,
      completedTests: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(ref, initialDoc);
    return {
      uid: initialDoc.uid,
      displayName: initialDoc.displayName,
      callsign: initialDoc.callsign,
      starsEarned: initialDoc.starsEarned,
      selectedSymptoms: initialDoc.selectedSymptoms,
      biometrics: initialDoc.biometrics,
      completedTests: initialDoc.completedTests,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveAstronautProfile(
  uid: string,
  payload: Omit<AstronautAccountData, 'uid'>
): Promise<void> {
  const path = `users/${uid}`;
  const ref = doc(db, 'users', uid);
  try {
    await updateDoc(ref, {
      displayName: payload.displayName.slice(0, 80) || 'Crew Member',
      callsign: payload.callsign.slice(0, 40) || 'Astronaut',
      starsEarned: Math.max(0, Math.min(100, Math.round(payload.starsEarned))),
      selectedSymptoms: payload.selectedSymptoms.slice(0, 10),
      biometrics: payload.biometrics,
      completedTests: payload.completedTests.slice(0, 30),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function logCheckinEntry(
  uid: string,
  entry: { title: string; note: string; starReward: number }
): Promise<void> {
  const checkinId = `chk_${Date.now()}`;
  const path = `users/${uid}/checkins/${checkinId}`;
  try {
    await setDoc(doc(db, 'users', uid, 'checkins', checkinId), {
      uid,
      title: entry.title.slice(0, 140),
      note: entry.note.slice(0, 280),
      starReward: Math.max(1, Math.min(5, Math.round(entry.starReward))),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchRecentCheckins(uid: string): Promise<CheckinEntry[]> {
  const path = `users/${uid}/checkins`;
  try {
    const q = query(
      collection(db, 'users', uid, 'checkins'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<CheckinEntry, 'id'>),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
