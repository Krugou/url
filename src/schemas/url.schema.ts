import { z } from 'zod';

export function createUrlSchema(t: (key: string) => string) {
  return z.object({
    url: z
      .string()
      .min(1, { message: t('errors.required') })
      .regex(/^https?:\/\/.+/, { message: t('errors.invalid_url') }),
  });
}

export type UrlFormData = z.infer<ReturnType<typeof createUrlSchema>>;
