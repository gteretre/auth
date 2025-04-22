import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";

const Nav = async () => {
  const session = await getServerSession(options);
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-gray-900/80 shadow-md rounded-xl my-6 backdrop-blur-md border border-black/10 dark:border-white/10">
      <div className="flex items-center gap-2">
        <span className="nav-logo text-2xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
          AuthApp
        </span>
      </div>
      <div className="nav-links flex gap-6 items-center">
        <Link href="/" className="nav-link">
          Home
        </Link>
        {session ? (
          <>
            <Link href="/member" className="nav-link">
              Member
            </Link>
            <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
          </>
        ) : (
          <Link href="/api/auth/signin" className="nav-link">
            Login
          </Link>
        )}
        {session && session.user.role === "admin" && (
          <Link href="/admin" className="nav-link">
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
