import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="font-work-sans flex min-h-screen flex-col">
      <div className="mx-auto w-full flex-1">
        <Navbar />
        <div className="mx-auto w-full max-w-[1600px]">{children}</div>
      </div>
      <Footer />
    </main>
  );
}
