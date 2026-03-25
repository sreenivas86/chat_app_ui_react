import { io } from 'socket.io-client';
const apiUrl =
  window.__ENV__?.VITE_API_URL || import.meta.env.VITE_API_URL;
export const socket = io(`${apiUrl}`);
