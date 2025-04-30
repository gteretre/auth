import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="font-work-sans flex min-h-screen flex-col">
      <div className="mx-auto w-full flex-1">
        <Navbar />
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
            <h1 className="mb-4 text-4xl font-bold text-primary">
              404 - Strona nie istnieje
            </h1>
            <p className="mb-8 text-lg text-gray-500">
              Przykro nam, strona której szukasz została przeniosiona lub nie
              istnieje.
            </p>
            <Link href="/" className="search-btn rounded-full px-6 py-2">
              Wróć do strony głównej
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
