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
import MaintenancePage from "./components/MaintenancePage";
import SiteAmbient from "./components/SiteAmbient";
import SiteSeo from "./components/SiteSeo";
import YoutubeChannelSection from "./components/YoutubeChannelSection";
import { useAuth } from "./context/AuthContext";
import { DiscographyCoversProvider, useDiscographyCovers } from "./context/DiscographyCoversContext";
import { HeroSlidesProvider } from "./context/HeroSlidesContext";
import { SiteSettingsProvider, useSiteSettings } from "./context/SiteSettingsContext";
import { ShowsProvider, useShows } from "./context/ShowsContext";
import { YoutubeVideosProvider, useYoutubeVideos } from "./context/YoutubeVideosContext";
import { heroData } from "./data/mock";

function AppShell() {
  const [adminOpen, setAdminOpen] = useState(false);
  const { shows } = useShows();
  const { videos } = useYoutubeVideos();
  const { shelfItems } = useDiscographyCovers();
  const { isAdmin, loading: authLoading } = useAuth();
  const pathname =
    typeof window !== "undefined" ? window.location.pathname.replace(/\/+$/, "") || "/" : "/";
  const isLessonsPage = pathname === "/aulas";
  const isCrazyLegsPage = pathname === "/crazy-legs";
  const isStaffPage = pathname === "/staff";
  const { maintenanceMode, settingsReady } = useSiteSettings();
  const isStandalonePage = isLessonsPage || isCrazyLegsPage || isStaffPage;
  const shouldHoldPublicRender = !isStaffPage && (!settingsReady || authLoading);
  const shouldShowMaintenance = maintenanceMode && !isStaffPage && !isAdmin;
  const seoPage = shouldShowMaintenance
    ? "maintenance"
    : isStaffPage
      ? "staff"
      : isLessonsPage
        ? "aulas"
        : isCrazyLegsPage
          ? "crazy-legs"
          : "home";

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
    <>
      {shouldHoldPublicRender ? null : (
      <SiteSeo page={seoPage} shows={shows} videos={videos} discographyItems={shelfItems} />
      )}
      {shouldHoldPublicRender ? (
        <main className="min-h-screen bg-[#060404]" aria-hidden />
      ) : shouldShowMaintenance ? (
        <MaintenancePage />
      ) : (
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
            <AdminAgenda
              open={true}
              standalone={true}
              onClose={() => {
                window.location.href = "/";
              }}
            />
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
      )}
    </>
  );
}

export default function App() {
  return (
    <ShowsProvider>
      <YoutubeVideosProvider>
        <HeroSlidesProvider>
          <SiteSettingsProvider>
            <DiscographyCoversProvider>
              <AppShell />
            </DiscographyCoversProvider>
          </SiteSettingsProvider>
        </HeroSlidesProvider>
      </YoutubeVideosProvider>
    </ShowsProvider>
  );
}
