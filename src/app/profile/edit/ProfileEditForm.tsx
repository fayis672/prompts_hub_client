'use client'

import { useActionState } from 'react'
import { updateProfile } from '../actions'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface ProfileEditFormProps {
    user: any
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
    const [state, action, isPending] = useActionState(updateProfile, null)

    return (
        <form action={action} className="space-y-8">
            {/* Display Name */}
            <div className="grid gap-2">
                <label htmlFor="display_name" className="text-sm font-medium">
                    Display Name
                </label>
                <input
                    id="display_name"
                    name="display_name"
                    type="text"
                    defaultValue={user.display_name}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>

            {/* Bio */}
            <div className="grid gap-2">
                <label htmlFor="bio" className="text-sm font-medium">
                    Bio
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    defaultValue={user.bio || ''}
                    rows={4}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>

            {/* Social Links */}
            <div className="grid gap-4 pt-4">
                <h3 className="text-lg font-medium">Social Links</h3>

                <div className="grid gap-2">
                    <label htmlFor="website_url" className="text-sm font-medium">
                        Website URL
                    </label>
                    <input
                        id="website_url"
                        name="website_url"
                        type="url"
                        defaultValue={user.website_url || ''}
                        placeholder="https://example.com"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="twitter_handle" className="text-sm font-medium">
                            Twitter Handle
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                            <input
                                id="twitter_handle"
                                name="twitter_handle"
                                type="text"
                                defaultValue={user.twitter_handle || ''}
                                className="flex h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="github_handle" className="text-sm font-medium">
                            GitHub Handle
                        </label>
                        <input
                            id="github_handle"
                            name="github_handle"
                            type="text"
                            defaultValue={user.github_handle || ''}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="linkedin_url" className="text-sm font-medium">
                            LinkedIn URL
                        </label>
                        <input
                            id="linkedin_url"
                            name="linkedin_url"
                            type="url"
                            defaultValue={user.linkedin_url || ''}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>
            </div>

            {/* Status Messages */}
            {state?.error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <p>{state.error}</p>
                </div>
            )}

            {state?.success && (
                <div className="flex items-center gap-2 rounded-md bg-green-500/15 p-3 text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <p>{state.success}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
                {isPending ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
    )
}
