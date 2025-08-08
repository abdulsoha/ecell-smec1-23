import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import About from "@/components/About";
import UpcomingEvents from "@/components/UpcomingEvents";
import GuidingForce from "@/components/GuidingForce";
import NewTeam from "@/components/NewTeam";
import Gallery from "@/components/Gallery";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <About />
      <UpcomingEvents />
      <GuidingForce />
      <NewTeam />
      <Gallery />
      <FAQ />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
