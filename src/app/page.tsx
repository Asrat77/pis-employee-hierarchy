'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Title, Text, Group, Button, Loader } from '@mantine/core';
import { fetchPositions } from '@/store/positionSlice';
import Link from 'next/link';
import { RootState, AppDispatch } from '@/store/store';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.positions);

  useEffect(() => {
    dispatch(fetchPositions());
  }, [dispatch]);

  return (
    <main>
      <Container size="lg" py="xl">
        <Title order={1} mb="md">Employee Hierarchy Management</Title>
        <Text mb="xl">Manage your organization's employee positions and structure</Text>
        
        {loading && <Loader size="sm" mb="md" />}
        {error && <Text color="red" mb="md">{error}</Text>}
        
        <Group>
          <Button component={Link} href="/positions" variant="filled">
            View Positions
          </Button>
          <Button component={Link} href="/positions/create" variant="outline">
            Create New Position
          </Button>
        </Group>
      </Container>
    </main>
  );
}
