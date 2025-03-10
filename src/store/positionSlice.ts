import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Position } from '@/types/position';
import { positionApi } from '@/services/positionApi';

export const fetchPositions = createAsyncThunk(
  'positions/fetchAll',
  async () => {
    return await positionApi.getAll();
  }
);

export const createPosition = createAsyncThunk(
  'positions/create',
  async (position: Omit<Position, 'id'>) => {
    return await positionApi.create(position);
  }
);

export const updatePositionThunk = createAsyncThunk(
  'positions/update',
  async (position: Position) => {
    return await positionApi.update(position);
  }
);

export const deletePositionThunk = createAsyncThunk(
  'positions/delete',
  async (id: string) => {
    await positionApi.delete(id);
    return id;
  }
);

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
    deletePosition: (state, action: PayloadAction<string>) => {
      state.positions = state.positions.filter(p => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPositions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPositions.fulfilled, (state, action) => {
        state.positions = action.payload;
        state.loading = false;
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch positions';
      })
      .addCase(createPosition.fulfilled, (state, action) => {
        state.positions.push(action.payload);
      })
      .addCase(updatePositionThunk.fulfilled, (state, action) => {
        const index = state.positions.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.positions[index] = action.payload;
        }
      })
      .addCase(deletePositionThunk.fulfilled, (state, action) => {
        state.positions = state.positions.filter(p => p.id !== action.payload);
      });
  },
});

export const { setPositions, addPosition, updatePosition, deletePosition } = positionSlice.actions;
export default positionSlice.reducer;