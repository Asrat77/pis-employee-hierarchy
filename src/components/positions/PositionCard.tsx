import { Card, Text, Group, Button, Badge } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Position } from '@/types/position';
import Link from 'next/link';

interface PositionCardProps {
  position: Position;
  parentName?: string;
  onDelete: (id: string) => void;
}

export function PositionCard({ position, parentName, onDelete }: PositionCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text fw={500}>{position.name}</Text>
          {parentName && (
            <Badge color="blue" variant="light">
              Reports to: {parentName}
            </Badge>
          )}
        </Group>
      </Card.Section>

      <Text size="sm" mt="md" mb="md">
        {position.description}
      </Text>

      <Group justify="flex-end" mt="md">
        <Button 
          component={Link} 
          href={`/positions/edit/${position.id}`} 
          variant="light" 
          color="blue" 
          size="xs"
          leftSection={<IconEdit size="1rem" />}
        >
          Edit
        </Button>
        <Button 
          variant="light" 
          color="red" 
          size="xs" 
          onClick={() => onDelete(position.id)}
          leftSection={<IconTrash size="1rem" />}
        >
          Delete
        </Button>
      </Group>
    </Card>
  );
}