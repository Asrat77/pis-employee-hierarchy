'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Title, TextInput, Textarea, Button, Paper, Select, Group, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter, useParams } from 'next/navigation';
import { RootState } from '@/store/store';
import { updatePosition } from '@/store/positionSlice';
import { Position } from '@/types/position';
import Link from 'next/link';
import { IconAlertCircle } from '@tabler/icons-react';

export default function EditPositionPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const positionId = parseInt(params.id as string);
  
  const positions = useSelector((state: RootState) => state.positions.positions);
  const position = positions.find(p => p.id === positionId);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      name: position?.name || '',
      description: position?.description || '',
      parentId: position?.parentId,
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Position name must be at least 2 characters' : null),
      description: (value) => (value.trim().length < 5 ? 'Description must be at least 5 characters' : null),
    },
  });

  useEffect(() => {
    if (position) {
      form.setValues({
        name: position.name,
        description: position.description,
        parentId: position.parentId,
      });
    } else {
      setError('Position not found');
    }
  }, [position]);

  const handleSubmit = form.onSubmit((values) => {
    setLoading(true);
    
    if (values.parentId === positionId) {
      setError('A position cannot be its own parent');
      setLoading(false);
      return;
    }
    
    let currentParentId = values.parentId;
    while (currentParentId !== null) {
      const parent = positions.find(p => p.id === currentParentId);
      if (!parent) break;
      if (parent.id === positionId) {
        setError('This would create a circular reference in the hierarchy');
        setLoading(false);
        return;
      }
      currentParentId = parent.parentId;
    }
    
    if (position) {
      const updatedPosition: Position = {
        ...position,
        name: values.name.trim(),
        description: values.description.trim(),
        parentId: values.parentId === undefined ? null : values.parentId,
      };
      
      dispatch(updatePosition(updatedPosition));
      
      router.push('/positions');
    }
  });

  const parentOptions = positions
    .filter(p => p.id !== positionId)
    .map(position => ({
      value: position.id.toString(),
      label: position.name,
    }));
  
  parentOptions.unshift({ value: '', label: 'None (Root Position)' });

  if (error && error === 'Position not found') {
    return (
      <Container size="md" py="xl">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Position not found" color="red">
          The position you are trying to edit does not exist. Please return to the positions page.
        </Alert>
        <Button component={Link} href="/positions" mt="md">
          Back to Positions
        </Button>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Paper p="md" withBorder>
        <Title order={2} mb="lg">Edit Position</Title>
        
        {error && error !== 'Position not found' && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" mb="md">
            {error}
          </Alert>
        )}
        
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
            value={form.values.parentId?.toString() || ''}
            onChange={(value) => form.setFieldValue('parentId', value ? parseInt(value) : null)}
          />
          
          <Group justify="flex-end">
            <Button component={Link} href="/positions" variant="outline">
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Update Position
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}