'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Title, Text, Group, Button } from '@mantine/core';
import { setPositions } from '@/store/positionSlice';
import Link from 'next/link';

// Sample initial data for demonstration
const initialPositions = [
  { id: 1, name: 'CEO', description: 'Chief Executive Officer', parentId: null },
  { id: 2, name: 'CTO', description: 'Chief Technology Officer', parentId: 1 },
  { id: 3, name: 'CFO', description: 'Chief Financial Officer', parentId: 1 },
  { id: 4, name: 'Project Manager', description: 'Technology Project Manager', parentId: 2 },
];

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize with sample data
    dispatch(setPositions(initialPositions));
  }, [dispatch]);

  return (
    <main>
      <Container size="lg" py="xl">
        <Title order={1} mb="md">Employee Hierarchy Management</Title>
        <Text mb="xl">Manage your organization's employee positions and structure</Text>
        
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
