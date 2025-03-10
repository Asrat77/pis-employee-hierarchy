'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Title, TextInput, Textarea, Button, Paper, Select, Group, Alert } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import { addPosition } from '@/store/positionSlice';
import { Position } from '@/types/position';
import Link from 'next/link';
import { IconAlertCircle } from '@tabler/icons-react';
import axios from 'axios';

const schema = yup.object({
  name: yup.string().required('Position name is required').min(2, 'Position name must be at least 2 characters'),
  description: yup.string().required('Description is required').min(5, 'Description must be at least 5 characters'),
  parentId: yup.number().nullable(),
});

type FormValues = yup.InferType<typeof schema>;

export default function CreatePositionPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const positions = useSelector((state: RootState) => state.positions.positions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getNextId = () => {
    if (positions.length === 0) return 1;
    return Math.max(...positions.map(p => p.id)) + 1;
  };

  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      parentId: null,
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      setError(null);
      
      const newPosition: Position = {
        id: getNextId(),
        name: values.name.trim(),
        description: values.description.trim(),
        parentId: values.parentId === undefined ? null : values.parentId,
      };
      
      dispatch(addPosition(newPosition));
      router.push('/positions');
    } catch (err) {
      setError('Failed to create position. Please try again.');
      console.error('Error creating position:', err);
    } finally {
      setLoading(false);
    }
  };

  const parentOptions = positions.map(position => ({
    value: position.id.toString(),
    label: position.name,
  }));
  
  parentOptions.unshift({ value: '', label: 'None (Root Position)' });

  return (
    <Container size="md" py="xl">
      <Paper p="md" withBorder className="shadow-md">
        <Title order={2} mb="lg">Create New Position</Title>
        
        {error && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" mb="md">
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextInput
                label="Position Name"
                placeholder="Enter position title"
                required
                error={errors.name?.message}
                className="transition-all duration-200 hover:shadow-sm"
                {...field}
              />
            )}
          />
          
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                label="Description"
                placeholder="Enter position description and responsibilities"
                required
                minRows={3}
                error={errors.description?.message}
                className="transition-all duration-200 hover:shadow-sm"
                {...field}
              />
            )}
          />
          
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <Select
                label="Parent Position"
                placeholder="Select parent position"
                data={parentOptions}
                clearable
                className="transition-all duration-200 hover:shadow-sm"
                onChange={(value) => field.onChange(value ? parseInt(value) : null)}
                value={field.value?.toString() || ''}
              />
            )}
          />
          
          <Group justify="flex-end" className="pt-4">
            <Button 
              component={Link} 
              href="/positions" 
              variant="outline"
              className="hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Create Position
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}