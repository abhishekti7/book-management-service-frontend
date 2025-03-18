'use client';

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, User, LogOut, LogIn, Plus } from "lucide-react";

import { navItems } from "@/constants/navItems";
import { useAuth } from "@/contexts/auth-context";

import "./styles.scss";

const iconMap = {
    books: <BookOpen />,
    authors: <User />,
};

const Header = props => {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <nav className="header__wrapper">
            <div className="header__container">
                <div className="header__container--right">
                    <BookOpen />
                    <span>
                        <Link href='/'>BookShelf</Link>
                    </span>
                </div>
                <div className="header__container--left">
                    <div className="navigation-links">
                        {navItems.map(item => {
                            return (
                                <div
                                    key={item.id}
                                    className={`navigation-links-item ${pathname === item.path ? 'active' : ''}`}
                                >
                                    <Link href={item.path}>{iconMap[item.icon]} {item.label}</Link>
                                </div>
                            );
                        })}

                        {isAuthenticated ? (
                            <div className="btn-logout" onClick={handleLogout}><LogOut />Logout</div>
                        ) : (
                            <>
                                {pathname === '/login' ? (
                                    <div className="btn-register" onClick={() => {
                                        router.push('/register')
                                    }}><Plus /> Register</div>
                                ) : (
                                    <div className="btn-login" onClick={() => {
                                        router.push('/login')
                                    }}><LogIn /> Login</div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;