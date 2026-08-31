import { Header } from "@/components/demo-barbershop/Header";
import { Hero } from "@/components/demo-barbershop/Hero";
import { Services } from "@/components/demo-barbershop/Services";
import { Gallery } from "@/components/demo-barbershop/Gallery";
import { Team } from "@/components/demo-barbershop/Team";
import { Reviews } from "@/components/demo-barbershop/Reviews";
import { Booking } from "@/components/demo-barbershop/Booking";
import { Contact } from "@/components/demo-barbershop/Contact";
import { Footer } from "@/components/demo-barbershop/Footer";
import { Reveal } from "@/components/demo-barbershop/Reveal";
import { SmoothScroll } from "@/components/demo-barbershop/SmoothScroll";

export default function BarbershopDemoPage() {
  return (
    <>
      <div aria-hidden className="bg-field" data-field />
      <div aria-hidden className="bg-grain" />
      <Reveal />
      <SmoothScroll />
      <Header />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Team />
        <Reviews />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
