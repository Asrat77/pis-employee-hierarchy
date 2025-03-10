import axios from 'axios';
import { Position } from '@/types/position';

const API_URL = 'http://localhost:3003/api/positions';

export const positionApi = {
  getAll: async (): Promise<Position[]> => {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  },
  
  getById: async (id: string): Promise<Position> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },
  
  getChildren: async (id: string): Promise<Position[]> => {
    const response = await axios.get(`${API_URL}/${id}/children`);
    return response.data;
  },
  
  create: async (position: Omit<Position, 'id'>): Promise<Position> => {
    const response = await axios.post(API_URL, position);
    return response.data;
  },
  
  update: async (position: Position): Promise<Position> => {
    const response = await axios.put(`${API_URL}/${position.id}`, position);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};