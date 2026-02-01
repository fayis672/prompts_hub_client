'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { updateUserProfile } from '@/lib/api/users'

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.access_token) {
        return { error: 'Not authenticated' }
    }

    const displayName = formData.get('display_name') as string

    if (!displayName) {
        return { error: 'Display name is required' }
    }

    const data = {
        display_name: displayName,
        bio: formData.get('bio') as string | undefined,
        website_url: formData.get('website_url') as string | undefined,
        twitter_handle: formData.get('twitter_handle') as string | undefined,
        github_handle: formData.get('github_handle') as string | undefined,
        linkedin_url: formData.get('linkedin_url') as string | undefined,
    }

    try {
        await updateUserProfile(session.access_token, data)
    } catch (error) {
        return { error: 'Failed to update profile. Please try again.' }
    }

    revalidatePath('/', 'layout')
    // We can redirect or just return success
    return { success: 'Profile updated successfully!' }
}
