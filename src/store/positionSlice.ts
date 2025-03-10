import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Position } from '@/types/position';

interface PositionState {
  positions: Position[];
  loading: boolean;
  error: string | null;
}

const initialState: PositionState = {
  positions: [],
  loading: false,
  error: null,
};

const positionSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    setPositions: (state, action: PayloadAction<Position[]>) => {
      state.positions = action.payload;
    },
    addPosition: (state, action: PayloadAction<Position>) => {
      state.positions.push(action.payload);
    },
    updatePosition: (state, action: PayloadAction<Position>) => {
      const index = state.positions.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.positions[index] = action.payload;
      }
    },
    deletePosition: (state, action: PayloadAction<number>) => {
      state.positions = state.positions.filter(p => p.id !== action.payload);
    },
  },
});

export const { setPositions, addPosition, updatePosition, deletePosition } = positionSlice.actions;
export default positionSlice.reducer;