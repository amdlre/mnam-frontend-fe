import { z } from 'zod';

// ─── Owner ──────────────────────────────────────────────────
export const ownerCreateSchema = z.object({
  owner_name: z.string().min(1, { message: 'required' }),
  owner_mobile_phone: z
    .string()
    .min(1, { message: 'required' })
    .regex(/^\d{10}$/, { message: 'phoneInvalid' }),
  paypal_email: z
    .string()
    .email({ message: 'emailInvalid' })
    .optional()
    .or(z.literal('')),
  note: z.string(),
});
export type OwnerCreateFormData = z.infer<typeof ownerCreateSchema>;

export const ownerEditSchema = ownerCreateSchema;
export type OwnerEditFormData = z.infer<typeof ownerEditSchema>;

// ─── Project ────────────────────────────────────────────────
export const projectCreateSchema = z.object({
  name: z.string().min(1, { message: 'required' }),
  owner_id: z.string().min(1, { message: 'required' }),
  city: z.string(),
  district: z.string(),
  security_guard_phone: z.string(),
  property_manager_phone: z.string(),
  map_url: z.string(),
  contract_no: z.string(),
  contract_status: z.string(),
  contract_duration: z.string(),
  commission_percent: z
    .number({ message: 'invalidNumber' })
    .min(0, { message: 'invalidNumber' })
    .max(100, { message: 'invalidNumber' }),
  bank_name: z.string(),
  bank_iban: z.string(),
});
export type ProjectCreateFormData = z.infer<typeof projectCreateSchema>;

export const projectEditSchema = projectCreateSchema;
export type ProjectEditFormData = z.infer<typeof projectEditSchema>;

// ─── Unit ───────────────────────────────────────────────────
export const unitCreateSchema = z.object({
  project_id: z.string().min(1, { message: 'required' }),
  unit_name: z.string().min(1, { message: 'required' }),
  unit_type: z.string().min(1, { message: 'required' }),
  rooms: z.number({ message: 'invalidNumber' }).min(0, { message: 'invalidNumber' }),
  floor_number: z
    .number({ message: 'invalidNumber' })
    .min(0, { message: 'invalidNumber' }),
  unit_area: z
    .number({ message: 'invalidNumber' })
    .min(0, { message: 'invalidNumber' }),
  status: z.string().min(1, { message: 'required' }),
  base_weekday_price: z
    .number({ message: 'invalidNumber' })
    .min(0, { message: 'invalidNumber' }),
  weekend_markup_percent: z
    .number({ message: 'invalidNumber' })
    .min(0, { message: 'invalidNumber' }),
  discount_16_percent: z.number({ message: 'invalidNumber' }).min(0).max(100),
  discount_21_percent: z.number({ message: 'invalidNumber' }).min(0).max(100),
  discount_23_percent: z.number({ message: 'invalidNumber' }).min(0).max(100),
  description: z.string(),
  permit_no: z.string(),
  amenities: z.array(z.string()),
  access_info: z.string(),
  booking_links: z.array(z.object({ platform: z.string(), url: z.string() })),
});
export type UnitCreateFormData = z.infer<typeof unitCreateSchema>;

export const unitEditSchema = unitCreateSchema;
export type UnitEditFormData = z.infer<typeof unitEditSchema>;

// ─── Booking ────────────────────────────────────────────────
export const bookingCreateSchema = z
  .object({
    project_id: z.string().min(1, { message: 'required' }),
    unit_id: z.string().min(1, { message: 'required' }),
    guest_name: z.string().min(1, { message: 'required' }),
    guest_phone: z.string(),
    check_in_date: z.string().min(1, { message: 'required' }),
    check_out_date: z.string().min(1, { message: 'required' }),
    total_price: z
      .number({ message: 'invalidNumber' })
      .min(0, { message: 'invalidNumber' }),
    status: z.string().min(1, { message: 'required' }),
    channel_source: z.string(),
    notes: z.string(),
  })
  .refine(
    (data) => new Date(data.check_out_date) > new Date(data.check_in_date),
    { message: 'checkoutAfterCheckin', path: ['check_out_date'] },
  );
export type BookingCreateFormData = z.infer<typeof bookingCreateSchema>;
