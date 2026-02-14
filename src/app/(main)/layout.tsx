import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/api/users";

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    let user = null

    if (session?.access_token) {
        user = await getCurrentUser(session.access_token)
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar user={user} />
                <main className="flex-1 px-4 md:px-8 max-w-[1600px] w-full py-8">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
