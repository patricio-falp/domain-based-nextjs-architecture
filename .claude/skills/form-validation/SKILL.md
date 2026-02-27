---
name: form-validation
description: Create forms with validation using React Hook Form and Zod. Use when the user asks to add a form, create a form, add validation, build an input form, or handle form submission with validation rules.
---

# Form Validation (React Hook Form + Zod)

## When to Use

Use this skill when the user asks to create a form with validation, add form handling, or build an input form.

## Tech Stack

- **React Hook Form** v7 — form state management
- **Zod** v4 — schema validation
- **@hookform/resolvers** — bridges Zod schemas to RHF

## Form Template

### 1. Define the Zod Schema

```tsx
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  role: z.string().min(1, 'Please select a role'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be 500 characters or less'),
  acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
});

type FormData = z.infer<typeof formSchema>;
```

### 2. Setup the Form Hook

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const {
  register,
  handleSubmit,
  control,
  formState: { errors, isSubmitting, isValid, isDirty },
  reset,
} = useForm<FormData>({
  resolver: zodResolver(formSchema),
  mode: 'onTouched', // Validate on blur, then on change
  defaultValues: {
    name: '',
    email: '',
    role: '',
    message: '',
    acceptTerms: false,
  },
});
```

### 3. Build the Form JSX

```tsx
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
  {/* Text inputs — use register() */}
  <Input label="Name" placeholder="John Doe" error={errors.name?.message} {...register('name')} />

  <Input
    label="Email"
    type="email"
    placeholder="john@example.com"
    error={errors.email?.message}
    {...register('email')}
  />

  {/* Select — use Controller for non-native components */}
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

  {/* Textarea — use register() */}
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-(--color-fg)">Message</label>
    <textarea
      placeholder="Your message..."
      rows={3}
      className={cn(
        'w-full bg-(--color-bg-muted) text-(--color-fg) rounded-lg px-3 py-2',
        'text-sm border-0 transition-all duration-200 resize-none',
        'focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:bg-(--color-bg)',
        errors.message && 'ring-2 ring-(--color-error) focus:ring-(--color-error)'
      )}
      {...register('message')}
    />
    {errors.message && (
      <p className="text-sm text-(--color-error)" role="alert">
        {errors.message.message}
      </p>
    )}
  </div>

  {/* Checkbox — use Controller */}
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

  {/* Submit + Reset */}
  <div className="flex items-center gap-3 pt-2">
    <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
      Submit
    </Button>
    <Button type="button" variant="secondary" onClick={() => reset()}>
      Reset
    </Button>
  </div>
</form>
```

## Patterns

### register() vs Controller

| Use `register()`                           | Use `Controller`                          |
| ------------------------------------------ | ----------------------------------------- |
| Native `<input>`, `<textarea>`, `<select>` | Radix UI components (Select, Checkbox)    |
| The `Input` component (forwards ref)       | Any component with `value`/`onChange` API |

### Validation Modes

- `mode: 'onTouched'` — validate on blur first, then on change (recommended)
- `mode: 'onChange'` — validate on every keystroke (aggressive)
- `mode: 'onBlur'` — validate only on blur
- `mode: 'onSubmit'` — validate only on submit (lazy)

### Error Display

Always show errors below the input with `role="alert"`:

```tsx
{
  errors.fieldName && (
    <p className="text-sm text-(--color-error)" role="alert">
      {errors.fieldName.message}
    </p>
  );
}
```

The `Input` component accepts an `error` prop directly:

```tsx
<Input error={errors.name?.message} {...register('name')} />
```

### Submit Handler

```tsx
const onSubmit = async (data: FormData) => {
  // data is fully typed and validated
  await fetch('/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  toast.success('Submitted successfully!');
};
```

### Common Zod Validators

```tsx
z.string().min(1, 'Required'); // Required string
z.string().email('Invalid email'); // Email
z.string().url('Invalid URL'); // URL
z.string().regex(/^\d+$/, 'Numbers only'); // Regex
z.number().min(0).max(100); // Number range
z.enum(['a', 'b', 'c']); // Enum
z.boolean().refine((v) => v, 'Must accept'); // Required checkbox
z.string().optional(); // Optional
z.array(z.string()).min(1, 'Select at least one'); // Array
```

### Available Form Components

- `Input` — text/email/password/number (`src/components/ui/Input.tsx`)
- `SimpleSelect` — dropdown select (`src/components/ui/Select.tsx`)
- `Checkbox` — checkbox with label (`src/components/ui/Checkbox.tsx`)
- `Button` — submit/reset buttons (`src/components/ui/Button.tsx`)

### Toast on Success/Error

```tsx
import { toast } from '@/stores/toast';

toast.success('Form submitted successfully!');
toast.error('Something went wrong');
```

## Server-Side Validation

For API routes, use Zod directly:

```tsx
import { z } from 'zod';
import { ValidationApiError } from '@/lib/api/errors';

const result = schema.safeParse(body);
if (!result.success) {
  const errors = result.error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
  throw new ValidationApiError('Validation failed', errors);
}
```
