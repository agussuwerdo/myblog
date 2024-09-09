// src/components/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link legacyBehavior href="/">
          <a className="text-white text-lg font-semibold">My Blog</a>
        </Link>
        <div>
          <Link legacyBehavior href="/blog">
            <a className="text-gray-300 hover:text-white mx-2">Blog</a>
          </Link>
          <Link legacyBehavior href="/admin">
            <a className="text-gray-300 hover:text-white mx-2">Admin</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
