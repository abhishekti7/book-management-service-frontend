'use client'

import { LogIn, UserPlus } from "lucide-react";

import Button from "@/components/Button";
import { useAuth } from "@/contexts/auth-context";

import "./styles.scss";

export default function Home() {
  const { loading, isAuthenticated } = useAuth();

  return (
    <div className="homepage__container">
      <div className="homepage__container--info">
        <div className="info-title">Welcome To Bookshelf</div>
        <div className="info-subtitle">Your personal book management system. Browse and manage your collection of books and authors.</div>
      </div>
      <div className="homepage__container--actions">
        {!loading ? (
          !isAuthenticated ? (
            <>
              <Button label="Login" icon={<LogIn />} isLink={true} link="/login" />
              <Button label="Register" icon={<UserPlus />} mode="dark" isLink={true} link="/register" />
            </>
          ) : (
            <>
              <Button label="Browse Books" isLink={true} link="/books" />
              <Button label="Browse Authors" mode="dark" isLink={true} link="/authors" />
            </>
          )
        ) : null}

      </div>
    </div>
  );
}
