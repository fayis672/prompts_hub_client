import { Logo } from "@/components/common/Logo";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-background p-4 gap-6'>
            <Logo showText={true} className="scale-125" />
            {children}
        </div>
    );
}
