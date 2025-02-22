'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const FormSchemaCustomer = z.object({
  customerId: z.string(),
  name: z.string(),
  email: z.string({
    invalid_type_error: 'Please enter correct email with @*.com',
  }),
  imageUrl: z.string(),
});

const CreateCustomer = FormSchemaCustomer.omit({ customerId: true });

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    imageUrl?: string[];
  };
  message?: string | null;
};

export async function createCustomer(prevState: CustomerState, formData: FormData) {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    imageUrl: formData.get('imageUrl'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer',
    };
  }

  const { name, email, imageUrl } = validatedFields.data;

  try {
    await sql` 
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, ${imageUrl});
    `;
  } catch (error) {
    console.error(error);
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    console.error(error);
  }

  try {
    if (status === 'paid') {
      updateRevenue(amountInCents / 100, date);
    }
  } catch (error) {
    console.log(error);
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  try {
    if (status === 'paid') {
      await sql`
      UPDATE revenue
      SET revenue = revenue + ${amount}
      WHERE month = (SELECT TO_CHAR(date, 'Mon') FROM invoices
        WHERE id = ${id}
         AND customer_id = ${customerId})
      `;
    }
  } catch (error) {
    return { message: 'Database Error: Failed to Update Revenue on Paid Invoice Update.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateRevenue(amount: number, date: string) {
  try {
    const dateMonth = new Date(date).getMonth();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    await sql`
      UPDATE revenue
      SET revenue = revenue + ${amount},
          year = TO_NUMBER(TO_CHAR(date, 'yyyy'))
      WHERE TO_DATE(${months[dateMonth]} , 'Mon') = TO_DATE(month, 'Mon');
    `;
  } catch (error) {
    console.log('Database Error:', error);
  }
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    console.error(error);
  }

  revalidatePath('/dashboard/invoices');
}
