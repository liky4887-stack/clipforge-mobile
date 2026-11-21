import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type Check = {
  name: string;
  status: 'ok' | 'missing' | 'too_slow' | 'manual_mode';
  detail: string;
};

export type MediaFile = {
  id: string;
  original_name: string;
  size_bytes: number;
  mime: string;
  created_at: string;
};

export type Job = {
  id: string;
  media_file_id: string;
  type: string;
  status: 'queued' | 'running' | 'done' | 'failed' | 'killed_by_android';
  progress: number;
  error: string | null;
  output_file_id: string | null;
};

type TokenPair = { accessToken: string; refreshToken: string };

const BASE_URL = 'http://127.0.0.1:8787';

type EngineState = {
  accessToken: string | null;
  offline: boolean;
  offlineReason: string | null;
  setTokens: (t: TokenPair) => Promise<void>;
  loadTokens: () => Promise<void>;
  clearTokens: () => Promise<void>;
  request: <T>(path: string, init?: RequestInit & { json?: unknown }) => Promise<T>;
};

export const useEngine = create<EngineState>((set, get) => ({
  accessToken: null,
  offline: false,
  offlineReason: null,
  setTokens: async (t) => {
    await AsyncStorage.setItem('clipforge.tokens', JSON.stringify(t));
    set({ accessToken: t.accessToken, offline: false, offlineReason: null });
  },
  loadTokens: async () => {
    const raw = await AsyncStorage.getItem('clipforge.tokens');
    if (raw) {
      const t = JSON.parse(raw) as TokenPair;
      set({ accessToken: t.accessToken });
    }
  },
  clearTokens: async () => {
    await AsyncStorage.removeItem('clipforge.tokens');
    set({ accessToken: null });
  },
  request: async <T,>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> => {
    const token = get().accessToken;
    const headers = new Headers(init?.headers);
    if (init?.json !== undefined) headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers,
        body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
      });
      set({ offline: false, offlineReason: null });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string }).error ?? `engine error ${res.status}`);
      return data as T;
    } catch (err) {
      if (err instanceof TypeError) {
        set({ offline: true, offlineReason: 'Engine offline: open Termux and run npm start' });
        throw new Error('Engine offline: open Termux and run npm start');
      }
      throw err;
    }
  },
}));
