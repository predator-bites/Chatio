import axios, { AxiosError } from 'axios';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Room {
  id: string;
  title: string;
  userId: string;
  users: User[];
  inviteUrl: string | null;
  createdAt: string;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  roomId: string | null;
  createdAt: string;
  user?: {
    id: string;
    username: string;
  };
}

const http = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ error?: string }>) => {
    const message =
      err.response?.data?.error ?? err.message ?? 'Unexpected error';

    return Promise.reject(new Error(message));
  },
);

async function request<T>(
  path: string,
  config: Parameters<typeof http.request>[0] = {},
): Promise<T> {
  const res = await http.request<T>({ url: path, ...config });

  return res.data;
}

export const authApi = {
  login(data: { username: string; password: string }): Promise<User> {
    return request<User>('/auth/login', { method: 'POST', data });
  },

  logout(): Promise<void> {
    return request<void>('/auth/logout', { method: 'POST' });
  },
  getGoogleUrl(): Promise<void> {
    return request<void>('/auth/google', { method: 'GET' });
  },
  currentUser(): Promise<User> {
    return request<User>('/auth/currentUser', {
      method: 'GET',
      withCredentials: true,
    });
  },
};

export const userApi = {
  create(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<User> {
    return request<User>('/user', { method: 'POST', data });
  },
  submitEmail(id: string, submitUrl: string): Promise<string> {
    return request<string>(`/user/${id}/${submitUrl}`);
  },
  requestPasswordReset(data: { email: string }): Promise<void> {
    return request<void>('/user/reset', { method: 'POST', data });
  },
  resetPassword(
    id: string,
    passwordChangeUrl: string,
    data: { password: string },
  ): Promise<void> {
    return request<void>(`/user/reset/${id}/${passwordChangeUrl}`, {
      method: 'PATCH',
      data,
    });
  },
};

export const roomApi = {
  getUserRooms(): Promise<Room[]> {
    return request<Room[]>('/room');
  },
  create(data: { title: string }): Promise<Room> {
    return request<Room>('/room', { method: 'POST', data });
  },
  delete(roomId: string): Promise<void> {
    return request<void>(`/room/${roomId}`, { method: 'DELETE' });
  },
  getMessages(id: string): Promise<Message[]> {
    return request<Message[]>(`/room/${id}`);
  },
  getRoomMembers(id: string): Promise<User[]> {
    return request<User[]>(`/room/${id}/members`);
  },
  join(roomId: string, inviteUrl: string): Promise<void> {
    return request<void>(`/room/join/${roomId}/${inviteUrl}`);
  },
  leave(data: { roomId: string }): Promise<void> {
    return request<void>('/room', { method: 'DELETE', data });
  },
  generateInviteUrl(data: { roomId: string }): Promise<string> {
    return request<string>('/room/inviteUrl', { method: 'POST', data });
  },
  deleteInviteUrl(data: { roomId: string }): Promise<void> {
    return request<void>('/room/inviteUrl', { method: 'DELETE', data });
  },
  getRoomInfoByInvite(
    roomId: string,
    inviteUrl: string,
  ): Promise<{ id: string; title: string }> {
    return request<{ id: string; title: string }>(
      `/room/info/${roomId}/${inviteUrl}`,
    );
  },
};

export const messageApi = {
  getAll(): Promise<Message[]> {
    return request<Message[]>('/message');
  },

  create(data: {
    userId: string;
    text: string;
    roomId?: string;
  }): Promise<Message> {
    return request<Message>('/message', { method: 'POST', data });
  },
  delete(data: { id: string }): Promise<void> {
    return request<void>('/message', { method: 'DELETE', data });
  },
};

export { http as apiClient };
