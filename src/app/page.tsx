import Background from "@/components/three/Background";
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import ScrollTop from "@/components/ScrollTop";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";

export default function Home() {
  return (
    <>
      <Preloader />
      <Background />
      <main>
        <Hero />
        <Work />
        <Services />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
      <ScrollTop />
      <Cursor />
    </>
  );
}
