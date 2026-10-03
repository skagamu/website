import HeroHub from "../components/HeroHub";
import ManifestoSection from "../components/ManifestoSection";
import TabbedCarousel from "../components/TabbedCarousel";
import AlumniCarousel from "../components/AlumniCarousel";
import EventCarousel from "../components/EventCarousel";
import TeacherProfile from "../components/TeacherProfile";
import SchoolGallery from "../components/SchoolGallery";

export default function HomePage() {
  return (
    <main>
      <HeroHub />
      <ManifestoSection />
      <TabbedCarousel />
      <AlumniCarousel />
      <TeacherProfile />
      <EventCarousel />
      <SchoolGallery />
    </main>
  );
}
