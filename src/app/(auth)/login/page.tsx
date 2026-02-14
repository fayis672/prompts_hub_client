'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '../auth/actions'

export default function LoginPage() {
    const [loginState, loginAction, isLoginPending] = useActionState(login, null)

    console.log('Login State:', loginState)

    return (
        <div className='w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm'>
            <div className='mb-6 text-center'>
                <h1 className='text-2xl font-bold text-foreground'>Welcome Back</h1>
                <p className='text-sm text-muted-foreground'>
                    Enter your email to sign in to your account
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
                        defaultValue={loginState?.email}
                        required
                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    />
                </div>
                <div className='grid gap-2'>
                    <label htmlFor='password' className='text-sm font-medium'>
                        Password
                    </label>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        required
                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    />
                </div>

                {loginState?.error && (
                    <div className='text-sm text-red-500 font-medium text-center'>
                        {loginState.error}
                    </div>
                )}

                <button
                    formAction={loginAction}
                    disabled={isLoginPending}
                    className='inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                >
                    {isLoginPending ? 'Signing In...' : 'Sign In'}
                </button>

                <div className='text-center text-sm'>
                    Don&apos;t have an account?{' '}
                    <Link href='/signup' className='font-medium text-primary hover:underline'>
                        Sign Up
                    </Link>
                </div>
            </form>
        </div>
    )
}
