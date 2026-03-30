import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AmbientAudio from "@/components/ui/AmbientAudio";
import CursorGlow from "@/components/ui/CursorGlow";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CursorGlow />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <AmbientAudio />
    </>
  );
}
