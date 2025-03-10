import React from 'react';
import { Text, Group, Button, Badge, Card, SimpleGrid } from '@mantine/core';
import { Position } from '@/types/position';
import Link from 'next/link';

interface PositionGridProps {
  positions: Position[];
  onDelete: (id: string) => void; 
}

export default function PositionGrid({ positions, onDelete }: PositionGridProps) {
  const sortedPositions = [...positions].sort((a, b) => {
    
    if (a.parentId === null && b.parentId !== null) return -1;
    if (a.parentId !== null && b.parentId === null) return 1;
    
    
    if (a.parentId === b.parentId) {
      return a.name.localeCompare(b.name);
    }
    
    const aParent = positions.find(p => p.id === a.parentId);
    const bParent = positions.find(p => p.id === b.parentId);
    if (aParent && bParent) {
      return aParent.name.localeCompare(bParent.name);
    }
    
    return 0;
  });

  const renderPositionCard = (position: Position) => {
    return (
      <Card key={position.id} shadow="sm" padding="lg" radius="md" withBorder className="h-full">
        <Card.Section withBorder inheritPadding py="xs" className="bg-gray-50">
          <Group justify="space-between">
            <Text fw={700}>{position.name}</Text>
            {position.parentId === null ? (
              <Badge color="green">Root Position</Badge>
            ) : (
              <Badge color="blue">
                {positions.find(p => p.id === position.parentId)?.name || 'Unknown'}
              </Badge>
            )}
          </Group>
        </Card.Section>
        
        <Text size="sm" mt="md" mb="md" lineClamp={2} className="h-12">
          {position.description}
        </Text>
        
        <Group mt="auto" justify="center">
          <Button
            component={Link}
            href={`/positions/edit/${position.id}`}
            size="xs"
            variant="filled"
            color="blue"
          >
            Edit
          </Button>
          <Button
            size="xs"
            variant="filled"
            color="red"
            onClick={() => onDelete(position.id)}
          >
            Delete
          </Button>
        </Group>
      </Card>
    );
  };

  const renderLevel = (parentId: string | null) => {
    const levelPositions = sortedPositions.filter(p => p.parentId === parentId);
    if (levelPositions.length === 0) return null;

    const title = parentId === null 
      ? 'Root Positions'
      : `Positions under ${positions.find(p => p.id === parentId)?.name}`;

    return (
      <div key={parentId || 'root'} className="mb-8">
        <div className={`relative ${parentId ? 'ml-8 pl-8 border-l-2 border-gray-200' : ''}`}>
          <Text fw={700} size="lg" mb="md" className="border-b pb-2">
            {title}
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {levelPositions.map(position => renderPositionCard(position))}
          </SimpleGrid>
          {levelPositions.map(position => renderLevel(position.id))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {renderLevel(null)}
    </div>
  );
}