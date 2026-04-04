'use client'

import { useActionState } from 'react'
import { resetPassword } from '../auth/actions'

export default function ResetPasswordPage() {
    const [state, action, isPending] = useActionState(resetPassword, null)

    return (
        <div className='w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm'>
            <div className='mb-6 text-center'>
                <h1 className='text-2xl font-bold text-foreground'>Reset Password</h1>
                <p className='mt-1 text-sm text-muted-foreground'>
                    Enter your new password below
                </p>
            </div>

            <form className='grid gap-4'>
                <div className='grid gap-2'>
                    <label htmlFor='password' className='text-sm font-medium'>
                        New Password
                    </label>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        placeholder='At least 6 characters'
                        required
                        minLength={6}
                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    />
                </div>

                <div className='grid gap-2'>
                    <label htmlFor='confirm_password' className='text-sm font-medium'>
                        Confirm New Password
                    </label>
                    <input
                        id='confirm_password'
                        name='confirm_password'
                        type='password'
                        placeholder='Re-enter your new password'
                        required
                        minLength={6}
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
                    {isPending ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    )
}
