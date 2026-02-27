'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@components/ui/Input';
import { SimpleSelect } from '@components/ui/Select';
import { Checkbox } from '@components/ui/Checkbox';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { toast } from '@/shared/stores/toast';

/* ─── Schema ─────────────────────────────────────────────────────── */

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  role: z.string().min(1, 'Please select a role'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be 500 characters or less'),
  acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const roleOptions = [
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'manager', label: 'Product Manager' },
  { value: 'other', label: 'Other' },
];

/* ─── Component ──────────────────────────────────────────────────── */

export function FormDemo() {
  const [submittedData, setSubmittedData] = useState<ContactFormData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      role: '',
      message: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate async submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmittedData(data);
    toast.success('Form submitted successfully!');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Form */}
      <Card variant="outlined" padding>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <SimpleSelect
                label="Role"
                placeholder="Select your role..."
                options={roleOptions}
                error={errors.role?.message}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-(--color-fg)">Message</label>
            <textarea
              placeholder="Tell us about your project..."
              rows={3}
              className={`
                w-full bg-(--color-bg-muted) text-(--color-fg) rounded-lg px-3 py-2
                text-sm border-0 transition-all duration-200 resize-none
                focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0
                focus:bg-(--color-bg)
                ${errors.message ? 'ring-2 ring-(--color-error) focus:ring-(--color-error)' : ''}
              `}
              {...register('message')}
            />
            {errors.message && (
              <p className="text-sm text-(--color-error)" role="alert">
                {errors.message.message}
              </p>
            )}
          </div>

          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <Checkbox
                  label="I accept the terms and conditions"
                  checked={field.value}
                  onChange={field.onChange}
                />
                {errors.acceptTerms && (
                  <p className="text-sm text-(--color-error)" role="alert">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
              Submit
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                reset();
                setSubmittedData(null);
              }}
            >
              Reset
            </Button>
            {isDirty && (
              <Badge variant="warning" size="sm">
                Unsaved changes
              </Badge>
            )}
            {isValid && isDirty && (
              <Badge variant="success" size="sm">
                Valid
              </Badge>
            )}
          </div>
        </form>
      </Card>

      {/* Output */}
      <div className="space-y-4">
        <Card variant="filled" padding>
          <h4 className="text-sm font-medium text-(--color-fg) mb-2">Schema</h4>
          <pre className="text-xs text-(--color-fg-muted) font-mono whitespace-pre-wrap overflow-x-auto">
            {`z.object({
  name: z.string().min(1).max(50),
  email: z.string().min(1).email(),
  role: z.string().min(1),
  message: z.string().min(10).max(500),
  acceptTerms: z.boolean().refine(v => v === true),
})`}
          </pre>
        </Card>

        {/* Validation errors */}
        {Object.keys(errors).length > 0 && (
          <Card variant="outlined" padding>
            <h4 className="text-sm font-medium text-(--color-error) mb-2">
              Validation Errors ({Object.keys(errors).length})
            </h4>
            <ul className="space-y-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field} className="text-xs text-(--color-fg-muted) flex items-center gap-2">
                  <Badge variant="error" size="sm">
                    {field}
                  </Badge>
                  <span>{error?.message}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Submitted data */}
        {submittedData && (
          <Card variant="outlined" padding>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-medium text-(--color-success)">Submitted Data</h4>
              <Badge variant="success" size="sm">
                OK
              </Badge>
            </div>
            <pre className="text-xs text-(--color-fg-muted) font-mono whitespace-pre-wrap">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
}
