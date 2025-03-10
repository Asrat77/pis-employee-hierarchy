'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Title, TextInput, Textarea, Button, Paper, Select, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import { addPosition } from '@/store/positionSlice';
import { Position } from '@/types/position';
import Link from 'next/link';

export default function CreatePositionPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const positions = useSelector((state: RootState) => state.positions.positions);
  const [loading, setLoading] = useState(false);

  const getNextId = () => {
    if (positions.length === 0) return 1;
    return Math.max(...positions.map(p => p.id)) + 1;
  };

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      parentId: null as number | null,
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Position name must be at least 2 characters' : null),
      description: (value) => (value.trim().length < 5 ? 'Description must be at least 5 characters' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    setLoading(true);
    
    const newPosition: Position = {
      id: getNextId(),
      name: values.name.trim(),
      description: values.description.trim(),
      parentId: values.parentId,
    };
    
    dispatch(addPosition(newPosition));
    
    router.push('/positions');
  });

  const parentOptions = positions.map(position => ({
    value: position.id.toString(),
    label: position.name,
  }));
  
  parentOptions.unshift({ value: '', label: 'None (Root Position)' });

  return (
    <Container size="md" py="xl">
      <Paper p="md" withBorder>
        <Title order={2} mb="lg">Create New Position</Title>
        
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Position Name"
            placeholder="Enter position title"
            required
            mb="md"
            {...form.getInputProps('name')}
          />
          
          <Textarea
            label="Description"
            placeholder="Enter position description and responsibilities"
            required
            minRows={3}
            mb="md"
            {...form.getInputProps('description')}
          />
          
          <Select
            label="Parent Position"
            placeholder="Select parent position"
            data={parentOptions}
            mb="xl"
            clearable
            onChange={(value) => form.setFieldValue('parentId', value ? parseInt(value) : null)}
          />
          
          <Group justify="flex-end">
            <Button component={Link} href="/positions" variant="outline">
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Position
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}