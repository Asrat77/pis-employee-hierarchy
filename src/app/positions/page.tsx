'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Title, Button, Group, Loader, Text, Paper, Box } from '@mantine/core';
import Link from 'next/link';
import { RootState, AppDispatch } from '@/store/store';
import { fetchPositions, deletePositionThunk } from '@/store/positionSlice';
import PositionGrid from '@/components/PositionGrid';
import { IconPlus } from '@tabler/icons-react';

export default function PositionsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { positions, loading, error } = useSelector((state: RootState) => state.positions);


  useEffect(() => {
    dispatch(fetchPositions());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      dispatch(deletePositionThunk(id));
    }
  };

  return (
    <Container size="lg" py="xl" className="max-w-6xl mx-auto">
      <Paper shadow="xs" p="md" withBorder className="mb-6 bg-white">
        <Group justify="space-between" mb="md">
          <Title order={2} className="text-gray-800 font-bold">Positions</Title>
          <Button 
            component={Link} 
            href="/positions/create"
            leftSection={<IconPlus size={16} />}
            className="bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Add New Position
          </Button>
        </Group>

        {loading && (
          <Box className="flex justify-center py-8">
            <Loader size="md" />
          </Box>
        )}
        
        {error && (
          <Paper p="md" withBorder className="bg-red-50 border-red-200 mb-4">
            <Text color="red" className="font-medium">
              {error}
            </Text>
          </Paper>
        )}
        
        {!loading && positions.length === 0 && (
          <Paper p="xl" withBorder className="bg-gray-50 flex flex-col items-center justify-center py-12">
            <Text size="lg" className="text-gray-600 mb-4">No positions found. Create your first position!</Text>
            <Button 
              component={Link} 
              href="/positions/create"
              leftSection={<IconPlus size={16} />}
              variant="outline"
              className="hover:bg-gray-100 transition-colors"
            >
              Create Position
            </Button>
          </Paper>
        )}

        {!loading && positions.length > 0 && (
          <PositionGrid positions={positions} onDelete={handleDelete} />
        )}
      </Paper>
    </Container>
  );
}