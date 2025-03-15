import Button from "@/components/Button";
import "./styles.scss";

export default function Home() {
  return (
    <div className="homepage__container">
      <div className="homepage__container--info">
        <div className="info-title">Welcome To Bookshelf</div>
        <div className="info-subtitle">Your personal book management system. Browse and manage your collection of books and authors.</div>
      </div>
      <div className="homepage__container--actions">
        <Button label="Browse Books" isLink={true} link="/books" />
        <Button label="Browse Authors" mode="dark" isLink={true} link="/authors" />
      </div>
    </div>
  );
}
