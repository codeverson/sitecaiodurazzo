import { useState } from "react";
import AdminAgenda from "./components/AdminAgenda";
import AgendaSection from "./components/AgendaSection";
import BioSection from "./components/BioSection";
import BookingSection from "./components/BookingSection";
import CrazyLegsPage from "./components/CrazyLegsPage";
import DiscographySection from "./components/DiscographySection";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LessonsPage from "./components/LessonsPage";
import SiteAmbient from "./components/SiteAmbient";
import YoutubeChannelSection from "./components/YoutubeChannelSection";
import { DiscographyCoversProvider } from "./context/DiscographyCoversContext";
import { HeroSlidesProvider } from "./context/HeroSlidesContext";
import { ShowsProvider } from "./context/ShowsContext";
import { YoutubeVideosProvider } from "./context/YoutubeVideosContext";
import { heroData } from "./data/mock";

export default function App() {
  const [adminOpen, setAdminOpen] = useState(false);
  const pathname =
    typeof window !== "undefined" ? window.location.pathname.replace(/\/+$/, "") || "/" : "/";
  const isLessonsPage = pathname === "/aulas";
  const isCrazyLegsPage = pathname === "/crazy-legs";
  const isStaffPage = pathname === "/staff";
  const isStandalonePage = isLessonsPage || isCrazyLegsPage || isStaffPage;

  const youtubeChannelHref =
    heroData.socials.find((s) => s.platform === "youtube")?.href ??
    "https://www.youtube.com/@CAIODURAZZO";

  const navItems = heroData.navItems.map((item) => {
    if (item.href === "/aulas") return item;
    if (!isStandalonePage) return item;
    return item.href.startsWith("#") ? { ...item, href: `/${item.href}` } : item;
  });

  const footerLinks = navItems.filter((item) => item.label !== "Aulas");

  return (
    <ShowsProvider>
      <YoutubeVideosProvider>
      <HeroSlidesProvider>
      <DiscographyCoversProvider>
      <div className="relative min-h-screen bg-cd-base font-body text-cd-mist">
        <SiteAmbient />
        {isStaffPage ? null : (
          <Header
            navItems={navItems}
            socials={heroData.socials}
            onOpenAdmin={() => setAdminOpen(true)}
            staffHref="/staff"
            brandHref={isStandalonePage ? "/" : "#top"}
          />
        )}

        {isStaffPage ? (
          <AdminAgenda open={true} standalone={true} onClose={() => {
            window.location.href = "/";
          }} />
        ) : (
          <AdminAgenda open={adminOpen} onClose={() => setAdminOpen(false)} />
        )}

        {isStaffPage ? null : isLessonsPage ? (
          <LessonsPage />
        ) : isCrazyLegsPage ? (
          <CrazyLegsPage />
        ) : (
          <>
            <Hero />
            <main>
              <BioSection />
              <YoutubeChannelSection channelUrl={youtubeChannelHref} />
              <AgendaSection />
              <DiscographySection />
              <BookingSection />
            </main>
          </>
        )}

        <Footer
          brandTitle="Caio Durazzo"
          links={footerLinks}
          socials={heroData.socials}
        />
      </div>
      </DiscographyCoversProvider>
      </HeroSlidesProvider>
      </YoutubeVideosProvider>
    </ShowsProvider>
  );
}
