'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Title, Text, Group, Button } from '@mantine/core';
import { setPositions } from '@/store/positionSlice';
import Link from 'next/link';
import demoPositions from '../data/demoPositions.json';
import { Position } from '@/types/position';

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPositions(demoPositions as Position[]));
    
    console.log('Demo positions loaded:', demoPositions);
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
