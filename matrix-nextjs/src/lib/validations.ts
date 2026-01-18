/**
 * Zod Validation Schemas
 * Server-side and client-side validation for forms
 */

import { z } from 'zod';

// Hungarian name regex (allows Hungarian special characters)
const hungarianNameRegex = /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s'-]+$/;

// Hungarian phone regex (allows various Hungarian phone formats)
const hungarianPhoneRegex = /^(\+36|06)?[-\s]?(\d{1,2})[-\s]?(\d{3})[-\s]?(\d{3,4})$/;

// Minimum form submission time (bot protection)
const MIN_SUBMISSION_TIME_MS = 3000; // 3 seconds

/**
 * Contact Form Schema
 * Validates contact form submissions with Hungarian locale support
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'A név legalább 2 karakter hosszú legyen.' })
    .max(100, { message: 'A név maximum 100 karakter lehet.' })
    .regex(hungarianNameRegex, {
      message: 'A név csak betűket, szóközt, kötőjelet és aposztrófot tartalmazhat.',
    }),

  email: z
    .string()
    .email({ message: 'Kérjük, adjon meg egy érvényes email címet.' })
    .max(254, { message: 'Az email cím túl hosszú.' }),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || hungarianPhoneRegex.test(val),
      { message: 'Kérjük, adjon meg egy érvényes magyar telefonszámot.' }
    ),

  company: z
    .string()
    .max(200, { message: 'A cégnév maximum 200 karakter lehet.' })
    .optional(),

  subject: z
    .string()
    .min(3, { message: 'A tárgy legalább 3 karakter hosszú legyen.' })
    .max(200, { message: 'A tárgy maximum 200 karakter lehet.' }),

  message: z
    .string()
    .min(10, { message: 'Az üzenet legalább 10 karakter hosszú legyen.' })
    .max(5000, { message: 'Az üzenet maximum 5000 karakter lehet.' }),

  gdprConsent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Az adatvédelmi nyilatkozat elfogadása kötelező.',
    }),

  // Honeypot field - should be empty
  website: z.string().max(0, { message: 'Bot detected.' }).optional(),

  // Timestamp for submission timing validation
  formLoadedAt: z.number().optional(),
});

/**
 * Validate submission timing (bot protection)
 * Returns true if submission took at least MIN_SUBMISSION_TIME_MS
 */
export function validateSubmissionTiming(formLoadedAt?: number): boolean {
  if (!formLoadedAt) return true; // Skip if not provided
  const submissionTime = Date.now() - formLoadedAt;
  return submissionTime >= MIN_SUBMISSION_TIME_MS;
}

/**
 * Contact form type inferred from schema
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Server-side validation result
 */
export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
};

/**
 * Validate contact form data
 */
export function validateContactForm(data: unknown): ValidationResult<ContactFormData> {
  try {
    const validated = contactFormSchema.parse(data);

    // Check submission timing
    if (!validateSubmissionTiming(validated.formLoadedAt)) {
      return {
        success: false,
        errors: {
          _form: ['A form túl gyorsan lett elküldve. Kérjük, próbálja újra.'],
        },
      };
    }

    // Check honeypot
    if (validated.website && validated.website.length > 0) {
      return {
        success: false,
        errors: {
          _form: ['Érvénytelen beküldés.'],
        },
      };
    }

    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        const path = issue.path.join('.') || '_form';
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      });
      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: {
        _form: ['Ismeretlen hiba történt. Kérjük, próbálja újra.'],
      },
    };
  }
}

/**
 * Newsletter subscription schema
 */
export const newsletterSchema = z.object({
  email: z
    .string()
    .email({ message: 'Kérjük, adjon meg egy érvényes email címet.' })
    .max(254, { message: 'Az email cím túl hosszú.' }),

  gdprConsent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Az adatvédelmi nyilatkozat elfogadása kötelező.',
    }),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;
