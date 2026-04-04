'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { forgotPassword } from '../auth/actions'

export default function ForgotPasswordPage() {
    const [state, action, isPending] = useActionState(forgotPassword, null)

    if (state?.success) {
        return (
            <div className='w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm'>
                <div className='mb-6 text-center'>
                    <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                        <svg
                            className='h-6 w-6 text-primary'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                            />
                        </svg>
                    </div>
                    <h1 className='text-2xl font-bold text-foreground'>Check Your Email</h1>
                    <p className='mt-2 text-sm text-muted-foreground'>
                        We&apos;ve sent a password reset link to <span className='font-medium text-foreground'>{state.email}</span>. Click the link in the email to reset your password.
                    </p>
                </div>
                <Link
                    href='/login'
                    className='inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                >
                    Back to Sign In
                </Link>
            </div>
        )
    }

    return (
        <div className='w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm'>
            <div className='mb-6 text-center'>
                <h1 className='text-2xl font-bold text-foreground'>Forgot Password</h1>
                <p className='mt-1 text-sm text-muted-foreground'>
                    Enter your email and we&apos;ll send you a reset link
                </p>
            </div>

            <form className='grid gap-4'>
                <div className='grid gap-2'>
                    <label htmlFor='email' className='text-sm font-medium'>
                        Email
                    </label>
                    <input
                        id='email'
                        name='email'
                        type='email'
                        placeholder='name@example.com'
                        defaultValue={state?.email}
                        required
                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    />
                </div>

                {state?.error && (
                    <div className='text-sm text-red-500 font-medium text-center'>
                        {state.error}
                    </div>
                )}

                <button
                    formAction={action}
                    disabled={isPending}
                    className='inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                >
                    {isPending ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className='text-center text-sm'>
                    <Link href='/login' className='font-medium text-primary hover:underline'>
                        Back to Sign In
                    </Link>
                </div>
            </form>
        </div>
    )
}
