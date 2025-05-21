import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main-content">{children}</main>
      <Footer />
    </div>
  );
}
