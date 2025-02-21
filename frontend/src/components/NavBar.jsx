import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavBar = () => {
  const location = useLocation(); // Get current route

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Book Management
        </Link>
        {/* Hide "Book List" button if already on the Book List page */}
        {location.pathname !== "/books" && (
          <Link to="/books">
            <Button variant="secondary">Book List</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
