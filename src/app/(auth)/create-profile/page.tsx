'use client'

import { useActionState } from 'react'
import { createProfile } from '../auth/actions'

export default function CreateProfilePage() {
    const [state, action, isPending] = useActionState(createProfile, null)

    return (
        <div className='flex h-screen items-center justify-center bg-background p-4'>
            <div className='w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm'>
                <div className='mb-6 text-center'>
                    <h1 className='text-2xl font-bold text-foreground'>Complete Your Profile</h1>
                    <p className='text-sm text-muted-foreground'>
                        Tell us a bit about yourself
                    </p>
                </div>

                <form action={action} className='grid gap-4'>
                    <div className='grid gap-2'>
                        <label htmlFor='username' className='text-sm font-medium'>
                            Username (Email)
                        </label>
                        <input
                            id='username'
                            name='username'
                            type='text'
                            readOnly
                            placeholder='Will be filled from session'
                            className='flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                        />
                        <p className='text-[10px] text-muted-foreground'>
                            We'll use your email as your username for now.
                        </p>
                    </div>

                    <div className='grid gap-2'>
                        <label htmlFor='display_name' className='text-sm font-medium'>
                            Display Name <span className='text-red-500'>*</span>
                        </label>
                        <input
                            id='display_name'
                            name='display_name'
                            type='text'
                            required
                            placeholder='John Doe'
                            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        />
                    </div>

                    <div className='grid gap-2'>
                        <label htmlFor='bio' className='text-sm font-medium'>
                            Bio
                        </label>
                        <textarea
                            id='bio'
                            name='bio'
                            placeholder='Software Engineer at Tech Co.'
                            className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        />
                    </div>

                    <div className='grid gap-2'>
                        <label htmlFor='website_url' className='text-sm font-medium'>
                            Website
                        </label>
                        <input
                            id='website_url'
                            name='website_url'
                            type='url'
                            placeholder='https://example.com'
                            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        />
                    </div>

                    {state?.error && (
                        <div className='text-sm text-red-500 font-medium text-center'>
                            {state.error}
                        </div>
                    )}

                    <button
                        type='submit'
                        disabled={isPending}
                        className='inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                    >
                        {isPending ? 'Creating Profile...' : 'Create Profile'}
                    </button>
                </form>
            </div>
        </div>
    )
}
