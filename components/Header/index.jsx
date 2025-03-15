'use client';

import { usePathname } from "next/navigation";
import { navItems } from "@/constants/navItems";
import { BookOpen, User } from "lucide-react";
import Link from "next/link";

import "./styles.scss";

const iconMap = {
    books: <BookOpen />,
    authors: <User />,
};

const Header = props => {
    const pathname = usePathname();

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
                            console.log(item.label, item.path === pathname)
                            return (
                                <div
                                    key={item.id}
                                    className={`navigation-links-item ${pathname === item.path ? 'active' : ''}`}
                                >
                                    <Link href={item.path}>{iconMap[item.icon]} {item.label}</Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;