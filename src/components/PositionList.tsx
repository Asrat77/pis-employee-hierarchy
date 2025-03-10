import React from 'react';
import { Table, Button, Group, Text, Badge } from '@mantine/core';
import { Position } from '@/types/position';
import Link from 'next/link';

interface PositionListProps {
  positions: Position[];
  onDelete: (id: string) => void;
}

export default function PositionList({ positions, onDelete }: PositionListProps) {
  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Parent</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {positions.map((position) => (
          <tr key={position.id}>
            <td>{position.id}</td>
            <td>
              <Text fw={500}>{position.name}</Text>
            </td>
            <td>
              <Text truncate maw={300}>
                {position.description}
              </Text>
            </td>
            <td>
              {position.parentId ? (
                <Badge color="blue">
                  {positions.find(p => p.id === position.parentId)?.name || 'Unknown'}
                </Badge>
              ) : (
                <Badge color="green">Root Position</Badge>
              )}
            </td>
            <td>
              <Group gap="xs">
                <Button
                  component={Link}
                  href={`/positions/${position.id}`}
                  size="xs"
                  variant="outline"
                >
                  View
                </Button>
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
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}