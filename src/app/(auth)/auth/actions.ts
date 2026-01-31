'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import { checkUserExists, createUserProfile } from '@/lib/api/users'

export async function createProfile(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.access_token || !session?.user?.email) {
        return { error: 'Not authenticated' }
    }

    const displayName = formData.get('display_name') as string

    if (!displayName) {
        return { error: 'Display name is required' }
    }

    const data = {
        username: session.user.email, // Using email as username as requested
        display_name: displayName,
        bio: formData.get('bio') as string | undefined,
        website_url: formData.get('website_url') as string | undefined,
    }

    try {
        await createUserProfile(session.access_token, data)
    } catch (error) {
        return { error: 'Failed to create profile. Please try again.' }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData?.get('email') as string
    const password = formData?.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message === 'Invalid login credentials' ? 'Invalid email or password' : error.message }
    }

    try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
            const userCheck = await checkUserExists(session.access_token)
            console.log('User check result (Login):', userCheck)

            if (!userCheck.exists) {
                redirect('/create-profile')
            }
        }
    } catch (apiError) {
        // If it's a redirect error, rethrow it
        if ((apiError as any).digest?.startsWith('NEXT_REDIRECT')) {
            throw apiError
        }
        console.error('API check failed during login:', apiError)
        // Decide if we want to block login on API failure. For now, we proceed but log.
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(prevState: any, formData: FormData) {
    console.log('Signup Action v2 exec')
    const supabase = await createClient()

    const email = formData?.get('email') as string
    const password = formData?.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        if (error.message.includes('already registered')) {
            return { error: 'This email is already registered. Please sign in.' }
        }
        return { error: error.message }
    }

    try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
            const userCheck = await checkUserExists(session.access_token)
            console.log('User check result (Signup):', userCheck)

            if (!userCheck.exists) {
                redirect('/create-profile')
            }
        }
    } catch (apiError) {
        // If it's a redirect error, rethrow it
        if ((apiError as any).digest?.startsWith('NEXT_REDIRECT')) {
            throw apiError
        }
        console.error('API check failed during signup:', apiError)
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function logout() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/login')
}
