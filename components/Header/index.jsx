'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BookOpen, User, LogOut } from "lucide-react";

import { navItems } from "@/constants/navItems";
import { useAuth } from "@/contexts/auth-context";

import "./styles.scss";

const iconMap = {
    books: <BookOpen />,
    authors: <User />,
};

const Header = props => {
    const pathname = usePathname();
    const { isAuthenticated, logout, loading } = useAuth();

    const handleLogout = async () => {
        try {
            const response = await logout();

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
                            <div className="btn-logout"><LogOut />Logout</div>
                        ) : null}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;