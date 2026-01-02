import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border mt-auto">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                P
                            </div>
                            <span className="text-lg font-bold text-foreground">
                                Prompts<span className="text-primary">Hub</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            The premier community for discovering, sharing, and creating AI prompts.
                            Elevate your generations today.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/browse" className="hover:text-primary transition-colors">Browse Prompts</Link></li>
                            <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
                            <li><Link href="/trending" className="hover:text-primary transition-colors">Trending</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Prompts Hub. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
