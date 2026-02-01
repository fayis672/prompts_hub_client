import { getCurrentUser } from '@/lib/api/users'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Edit, Github, Linkedin, Twitter, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.access_token) {
        redirect('/login')
    }

    const user = await getCurrentUser(session.access_token)

    if (!user) {
        return <div className="p-8 text-center text-muted-foreground">Failed to load profile. Please try again later.</div>
    }

    const initials = user.display_name
        ? user.display_name.slice(0, 2).toUpperCase()
        : user.username?.slice(0, 1).toUpperCase() || "U";

    return (
        <div className="container mx-auto max-w-2xl py-12 md:py-20">
            <Card className="overflow-hidden border-border/60 shadow-lg">
                <div className="h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"></div>

                <div className="px-8 pb-8 -mt-12">
                    <div className="flex justify-between items-end mb-6">
                        <div className="h-24 w-24 rounded-full bg-background p-1 shadow-sm ring-1 ring-border/20">
                            <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                {initials}
                            </div>
                        </div>

                        <Link
                            href="/profile/edit"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 mb-2"
                        >
                            <Edit className="h-3.5 w-3.5" />
                            Edit Profile
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{user.display_name}</h1>
                            <p className="text-muted-foreground">{user.username}</p>
                        </div>

                        {user.bio && (
                            <div className="prose prose-sm text-foreground/80 max-w-none">
                                <p>{user.bio}</p>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="h-px bg-border/50" />

                        {/* Social Links */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Connect</h3>
                            <div className="flex gap-4">
                                {user.website_url && (
                                    <a href={user.website_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors" title="Website">
                                        <Globe className="h-4 w-4" />
                                    </a>
                                )}
                                {user.twitter_handle && (
                                    <a href={`https://twitter.com/${user.twitter_handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors" title="Twitter">
                                        <Twitter className="h-4 w-4" />
                                    </a>
                                )}
                                {user.github_handle && (
                                    <a href={`https://github.com/${user.github_handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors" title="GitHub">
                                        <Github className="h-4 w-4" />
                                    </a>
                                )}
                                {user.linkedin_url && (
                                    <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors" title="LinkedIn">
                                        <Linkedin className="h-4 w-4" />
                                    </a>
                                )}

                                {!user.website_url && !user.twitter_handle && !user.github_handle && !user.linkedin_url && (
                                    <p className="text-sm text-muted-foreground italic">No social links added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
