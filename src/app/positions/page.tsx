'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Title, Text, Alert, Button, Modal, Paper, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { RootState } from '@/store/store';
import { deletePosition, setPositions } from '@/store/positionSlice';
import { PositionCard } from '@/components/positions/PositionCard';
import Link from 'next/link';
import demoPositions from '@/data/demoPositions.json';
import { Position } from '@/types/position';

export default function PositionsPage() {
  const dispatch = useDispatch();
  const positions = useSelector((state: RootState) => state.positions.positions);
  const [positionToDelete, setPositionToDelete] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  // Load demo positions on component mount
  useEffect(() => {
    if (positions.length === 0) {
      dispatch(setPositions(demoPositions as Position[]));
    }
  }, [dispatch, positions.length]);

  // Function to get positions by level
  const getPositionsByLevel = () => {
    const levels: Position[][] = [];
    
    // First level: positions with null parent
    const rootPositions = positions.filter(p => p.parentId === null);
    levels.push(rootPositions);
    
    // Build subsequent levels
    let currentParentIds = rootPositions.map(p => p.id);
    
    while (currentParentIds.length > 0) {
      const childPositions = positions.filter(p => p.parentId !== null && currentParentIds.includes(p.parentId));
      
      if (childPositions.length === 0) {
        break;
      }
      
      levels.push(childPositions);
      currentParentIds = childPositions.map(p => p.id);
    }
    
    return levels;
  };

  const handleDelete = () => {
    if (positionToDelete !== null) {
      dispatch(deletePosition(positionToDelete));
      close();
      setPositionToDelete(null);
    }
  };

  // Get positions organized by hierarchy level
  const positionLevels = getPositionsByLevel();

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1} mb="xs">Organization Hierarchy</Title>
          <Text c="dimmed">View and manage your organization's positions</Text>
        </div>
        <Button component={Link} href="/positions/create" leftSection={<IconPlus size="1rem" />}>
          Create Position
        </Button>
      </Group>
      
      <Paper p="md" withBorder>
        {positionLevels.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {positionLevels.map((levelPositions, levelIndex) => (
              <div key={levelIndex} className="border-t-2 border-gray-200 pt-4 first:border-t-0 first:pt-0">
                <div className="text-lg font-semibold mb-3">
                  {levelIndex === 0 ? 'Executive Leadership' : `Level ${levelIndex + 1}`}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {levelPositions.map(position => {
                    const parent = position.parentId !== null 
                      ? positions.find(p => p.id === position.parentId) 
                      : null;
                    
                    return (
                      <div key={position.id} className="relative">
                        <PositionCard 
                          position={position}
                          parentName={parent?.name}
                          onDelete={(id) => {
                            setPositionToDelete(id);
                            open();
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Alert icon={<IconAlertCircle size="1rem" />} title="No positions found" color="blue">
            There are no positions in the system yet. Create your first position to get started.
          </Alert>
        )}
      </Paper>

      {/* Confirmation Modal */}
      <Modal opened={opened} onClose={close} title="Confirm Deletion" centered>
        <Text mb="md">Are you sure you want to delete this position? This action cannot be undone.</Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button color="red" onClick={handleDelete}>Delete</Button>
        </Group>
      </Modal>
    </Container>
  );
}