import { z } from 'zod';

// Common Zod validation helpers
export const zString = z.string().trim();
export const zName = zString.min(1).max(200);
export const zDescription = zString.max(500);
export const zNullableDescription = zString.max(500).nullable();
export const zId = z.coerce.number().int().positive();
export const zNullableId = z.coerce.number().int().positive().nullable();
export const zBit = z.coerce.number().min(0).max(1);
export const zDateString = z.string().datetime();
export const zMoney = z.coerce.number().min(0);
