import { getCurrentUser } from '@/lib/api/users'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileEditForm } from '@/app/profile/edit/ProfileEditForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function ProfileEditPage() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.access_token) {
        redirect('/login')
    }

    const user = await getCurrentUser(session.access_token)

    if (!user) {
        // Handle case where session exists but user profile fetch fails
        return <div>Failed to load profile. Please try again later.</div>
    }

    return (
        <div className="container mx-auto max-w-2xl py-10">
            <Link href="/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Profile
            </Link>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Edit Profile</h1>
                    <p className="text-muted-foreground">
                        Update your profile information and manage your public presence.
                    </p>
                </div>

                <ProfileEditForm user={user} />
            </div>
        </div>
    )
}
