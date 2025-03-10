import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextInput, Button, Textarea, Select } from '@mantine/core';
import { Position } from '@/types/position';

const schema = yup.object({
  name: yup.string().required('Position name is required'),
  description: yup.string().required('Description is required'),
  parentId: yup.number().nullable(),
}).required();

interface PositionFormProps {
  positions: Position[];
  onSubmit: (data: Partial<Position>) => void;
  initialData?: Position;
}

export function PositionForm({ positions, onSubmit, initialData }: PositionFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      name: '',
      description: '',
      parentId: null,
    },
  });

  const parentOptions = positions.map((pos) => ({
    value: pos.id.toString(),
    label: pos.name,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextInput
        label="Position Name"
        placeholder="Enter position name"
        error={errors.name?.message}
        {...register('name')}
      />

      <Textarea
        label="Description"
        placeholder="Enter position description"
        error={errors.description?.message}
        {...register('description')}
      />

      <Controller
        name="parentId"
        control={control}
        render={({ field }) => (
          <Select
            label="Parent Position"
            placeholder="Select parent position"
            data={[{ value: '', label: 'No Parent' }, ...parentOptions]}
            {...field}
            onChange={(value) => field.onChange(value ? parseInt(value) : null)}
            value={field.value?.toString() || ''}
          />
        )}
      />

      <Button type="submit" fullWidth>
        {initialData ? 'Update Position' : 'Create Position'}
      </Button>
    </form>
  );
}