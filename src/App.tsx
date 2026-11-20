import React, { useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { HaritRajasthanPage } from './pages/HaritRajasthanPage';
import { CarbonCreditPage } from './pages/CarbonCreditPage';
import { AtmanirbharGaushalaPage } from './pages/AtmanirbharGaushalaPage';
import { SeniorCitizenCarePage } from './pages/SeniorCitizenCarePage';
import { OrganicFarmingPage } from './pages/OrganicFarmingPage';
import { CleanEnergyPage } from './pages/CleanEnergyPage';
import { HeritageWaterSolarPage } from './pages/HeritageWaterSolarPage';
import { CleanIndiaPlasticFreePage } from './pages/CleanIndiaPlasticFreePage';
import { WomenEmpowermentPage } from './pages/WomenEmpowermentPage';
import { SkillDevelopmentPage } from './pages/SkillDevelopmentPage';
import { HaritBharatPage } from './pages/HaritBharatPage';
import { MissionsPage } from './pages/MissionsPage';
import { AboutPage, ProjectsPage } from './pages/AboutAndProjectsPages';
import {
  EventsPage,
  HaritMarathonPage,
  MagazinePage,
  TrainingPage,
} from './pages/EventsTrainingPages';
import {
  ContactPage,
  JoinPage,
  PartnershipPage,
} from './pages/JoinPartnershipContactPages';
import { AdminDashboard } from './admin/AdminDashboard';
import { fetchPublicBootstrap } from './admin/apiClient';
import type { PublicBootstrapPayload } from './admin/types';
import { PublicPortalProvider } from './context/PublicPortalContext';
import { SEED_REGISTRATIONS } from './utils/govedaLogic';
import type { Language, RegistrationCategory, RegistrationRecord } from './types/goveda';

const STORAGE_KEY = 'goveda_registrations_v1';

function parseAppRoute(): { path: string; query: URLSearchParams } {
  const hashRaw = window.location.hash.replace(/^#/, '');
  if (hashRaw && hashRaw.startsWith('/')) {
    const [pathPart, queryPart] = hashRaw.split('?');
    return {
      path: pathPart || '/',
      query: new URLSearchParams(queryPart ?? ''),
    };
  }

  const pathname = window.location.pathname || '/';
  const normalizedPath =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return {
    path: normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`,
    query: new URLSearchParams(window.location.search ?? ''),
  };
}

export default function App() {
  const [lang, setLang] = useState<Language>('hi');
  const [route, setRoute] = useState<{ path: string; query: URLSearchParams }>(() =>
    parseAppRoute()
  );
  const [bootstrap, setBootstrap] = useState<PublicBootstrapPayload | null>(null);
  const [bootstrapLoading, setBootstrapLoading] = useState(true);
  const [records, setRecords] = useState<RegistrationRecord[]>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback cleanly to deterministic seed data
    }
    return SEED_REGISTRATIONS;
  });

  const refreshBootstrap = useCallback(async () => {
    try {
      const data = await fetchPublicBootstrap();
      setBootstrap(data);
    } catch {
      // Public portal still renders gracefully with static baseline definitions
    } finally {
      setBootstrapLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBootstrap();
  }, [refreshBootstrap]);

  useEffect(() => {
    const syncRoute = () => {
      setRoute(parseAppRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  const handleNavigate = (targetPath: string) => {
    const normalized = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
    try {
      window.history.pushState(null, '', normalized);
    } catch {
      window.location.hash = `#${normalized}`;
    }
    const [pathPart, queryPart] = normalized.split('?');
    setRoute({
      path: pathPart || '/',
      query: new URLSearchParams(queryPart ?? ''),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddRecord = (newRecord: RegistrationRecord) => {
    setRecords((prev) => {
      const next = [newRecord, ...prev];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota issues safely
      }
      return next;
    });
  };

  // Dedicated full-bleed Admin Console route (no public header/footer)
  if (route.path === '/admin' || route.path.startsWith('/admin/')) {
    return (
      <AdminDashboard
        onExitAdmin={() => {
          refreshBootstrap();
          handleNavigate('/');
        }}
        onDataMutated={() => {
          refreshBootstrap();
        }}
      />
    );
  }

  const renderPage = () => {
    const { path, query } = route;

    if (path === '/' || path === '') {
      return <HomePage lang={lang} onNavigate={handleNavigate} />;
    }

    if (path === '/about') {
      return <AboutPage lang={lang} onNavigate={handleNavigate} />;
    }

    if (path === '/missions/carbon-credit') {
      return (
        <CarbonCreditPage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path === '/harit-bharat' || path === '/missions/harit-bharat') {
      return <HaritBharatPage lang={lang} onNavigate={handleNavigate} />;
    }

    if (path === '/missions/harit-rajasthan' || path === '/harit-rajasthan') {
      return (
        <HaritRajasthanPage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (
      path === '/missions/self-reliant-gaushala' ||
      path === '/missions/atmanirbhar-gaushala'
    ) {
      return (
        <AtmanirbharGaushalaPage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (
      path === '/missions/senior-citizen-care' ||
      path === '/missions/elderly-care' ||
      path === '/missions/vriddha-ashram'
    ) {
      return (
        <SeniorCitizenCarePage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (
      path === '/missions/organic-farming' ||
      path === '/missions/jaivik-kheti'
    ) {
      return (
        <OrganicFarmingPage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (
      path === '/missions/biogas-cbg' ||
      path === '/missions/clean-energy' ||
      path === '/missions/swachh-urja'
    ) {
      return (
        <CleanEnergyPage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (
      path === '/missions/heritage-solar-water' ||
      path === '/missions/heritage-water-solar'
    ) {
      return (
        <HeritageWaterSolarPage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (
      path === '/missions/clean-india-plastic-free' ||
      path === '/missions/swachh-bharat'
    ) {
      return (
        <CleanIndiaPlasticFreePage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (
      path === '/missions/women-empowerment' ||
      path === '/missions/mahila-sashaktikaran'
    ) {
      return (
        <WomenEmpowermentPage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (
      path === '/missions/skill-development' ||
      path === '/missions/kaushal-vikas'
    ) {
      return (
        <SkillDevelopmentPage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path === '/missions') {
      return (
        <MissionsPage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path.startsWith('/missions/')) {
      const slug = path.replace('/missions/', '').split('/')[0];
      return (
        <MissionsPage
          lang={lang}
          missionSlug={slug}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path.startsWith('/harit-rajasthan/')) {
      const slug = path.replace('/harit-rajasthan/', '').split('/')[0];
      return (
        <HaritRajasthanPage
          lang={lang}
          districtSlug={slug}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path === '/join' || path.startsWith('/join/')) {
      const pathCat = path.startsWith('/join/')
        ? (path.replace('/join/', '').split('/')[0] as RegistrationCategory)
        : null;
      const cat =
        pathCat ||
        (query.get('category') as RegistrationCategory | null) ||
        'farmer';
      return (
        <JoinPage
          lang={lang}
          initialCategory={cat}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path === '/training') {
      return (
        <TrainingPage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path === '/projects') {
      return <ProjectsPage lang={lang} onNavigate={handleNavigate} />;
    }

    if (path === '/events') {
      return <EventsPage lang={lang} onNavigate={handleNavigate} />;
    }

    if (path === '/harit-marathon' || path === '/events/harit-marathon') {
      return (
        <HaritMarathonPage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path === '/magazine') {
      return (
        <MagazinePage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path === '/partnership') {
      return (
        <PartnershipPage
          lang={lang}
          records={records}
          onAddRecord={handleAddRecord}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path === '/contact' || path.startsWith('/legal')) {
      return <ContactPage lang={lang} />;
    }

    return <HomePage lang={lang} onNavigate={handleNavigate} />;
  };

  return (
    <PublicPortalProvider
      value={{
        bootstrap,
        loading: bootstrapLoading,
        onNavigate: handleNavigate,
        refreshBootstrap,
      }}
    >
      <div className="min-h-screen flex flex-col bg-white text-[#1E2923] overflow-x-clip">
        <Header
          lang={lang}
          onToggleLang={setLang}
          currentPath={route.path}
          onNavigate={handleNavigate}
        />
        <main className="flex-1">{renderPage()}</main>
        <Footer lang={lang} onNavigate={handleNavigate} />
      </div>
    </PublicPortalProvider>
  );
}
