'use server';

import { cookies } from 'next/headers';

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { success: false, message: 'Please fill in all fields.' };
  }

  let data;
  let response;

  try {
    response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    data = await response.json();
  } catch (error) {
    return { success: false, message: 'Unable to connect to the authentication server.' };
  }

  if (!response.ok) {
    return { success: false, message: data?.message || 'Login failed! Check your credentials.' };
  }

  const cookieStore = await cookies();
  const token = data.token || data.accessToken || data.access_token; 

  if (token) {
    cookieStore.set('my_secret_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  } else {
    return { success: false, message: 'Server error: Authentication token missing.' };
  }

  return { success: true, message: 'Login successful' };
}