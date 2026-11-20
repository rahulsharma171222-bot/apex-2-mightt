import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  FileText,
  Trophy,
  Newspaper,
  Download,
  Award,
} from 'lucide-react';
import { SpringButton } from '../components/SpringMotion';
import {
  ScenicPageHeader,
  ScenicHorizonStrip,
  SeamlessInlinePhoto,
} from '../components/ScenicElements';
import { RegistrationPortal } from '../components/RegistrationForms';
import { TRAINING_ARTICLES, MARATHON_INFO, MAGAZINE_INFO } from '../data/siteContent';
import { usePublicPortal } from '../context/PublicPortalContext';
import { getMarathonCountdown } from '../utils/govedaLogic';
import { filterUnifiedProgrammes } from '../utils/adminLogic';
import type { Language, RegistrationRecord } from '../types/goveda';

interface TrainingPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

export function TrainingPage({
  lang,
  records,
  onAddRecord,
  onNavigate,
}: TrainingPageProps) {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const { bootstrap } = usePublicPortal();

  const adminCourses = (bootstrap?.contentItems ?? []).filter(
    (item) => item.status === 'Published' && item.sectionType === 'training'
  );
  const unifiedTrainings = filterUnifiedProgrammes(bootstrap?.programmes ?? [], {
    type: 'training',
    onlyPublished: true,
  });

  const handleListen = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speakingId === id) {
      setSpeakingId(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white">
      <ScenicPageHeader
        kicker={lang === 'hi' ? 'प्रशिक्षण एवं ज्ञान केंद्र' : 'Training & Knowledge'}
        title={
          lang === 'hi'
            ? 'सरल भाषा में पर्यावरण, खेती, कौशल और कार्बन शिक्षा'
            : 'Accessible Learning for Farmers, Gaushalas & Rural Youth'
        }
        subtitle={
          lang === 'hi'
            ? 'किसानों, गौशालाओं और ग्रामीण युवाओं के लिए सरल हिंदी व स्थानीय बोली के उदाहरणों सहित मार्गदर्शिकाएँ एवं कोर्स पंजीकरण।'
            : 'Clear educational articles, audio-supported rural explanations, and dedicated course registration.'
        }
        iconName="GraduationCap"
        variant="skills"
        assetKey="youthSkillLab"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* 10 Topic Directory Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-medium">
          {[
            'Carbon Credit Learning',
            'Farmer Training',
            'Gaushala Training',
            'Biogas/CBG Knowledge',
            'Organic Farming',
            'Environment Awareness',
            'Skill Development Courses',
            'Video Library',
            'Download Centre',
            'FAQs',
          ].map((topic, i) => (
            <div
              key={topic}
              className="rounded-xl border border-[#1B5A32]/15 bg-[#FAFBF8] px-3 py-2.5 text-[#144527]"
            >
              <span className="text-[#368737] font-bold mr-1.5 tabular-nums">
                {String(i + 1).padStart(2, '0')}.
              </span>
              {topic}
            </div>
          ))}
        </div>

        {/* Live Unified Training Programmes from Central Hub */}
        {unifiedTrainings.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#144527]">
              {lang === 'hi'
                ? 'सक्रिय क्षेत्रीय प्रशिक्षण कार्यक्रम (Central Hub)'
                : 'Active Field Training Programmes'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {unifiedTrainings.map((tr) => {
                const firstDistrict = tr.locations[0]?.district || 'Bhilwara';
                const joinUrl = `/join/${encodeURIComponent(
                  tr.linkedFormType || 'skill-training'
                )}?campaign=${encodeURIComponent(tr.programmeCode)}&campaignTitle=${encodeURIComponent(
                  tr.titleEn
                )}&district=${encodeURIComponent(firstDistrict)}`;
                return (
                  <article
                    key={tr.id}
                    className="rounded-2xl border border-[#479D27]/25 bg-[#F4F8F3] p-6 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-mono font-bold text-[#368737]">
                          {tr.programmeCode}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-white border border-[#1B5A32]/15 font-semibold text-[#144527]">
                          {tr.operationalStatus}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#144527]">
                        {lang === 'hi' ? tr.titleHi || tr.titleEn : tr.titleEn}
                      </h3>
                      <p className="text-sm text-[#2A3A30] leading-relaxed">
                        {lang === 'hi' ? tr.summaryHi || tr.summaryEn : tr.summaryEn}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#44544A] pt-1">
                        {tr.locations.length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#368737]" />
                            {tr.locations.map((l) => `${l.district}, ${l.stateName}`).join(' · ')}
                          </span>
                        )}
                        {tr.startDate && (
                          <span className="inline-flex items-center gap-1 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-[#368737]" />
                            {tr.startDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <SpringButton
                        variant="primary"
                        size="sm"
                        onClick={() => onNavigate(joinUrl)}
                      >
                        <span>{lang === 'hi' ? 'प्रशिक्षण पंजीकरण' : 'Register for Training'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </SpringButton>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Live Admin-Published Courses & Training Modules */}
        {adminCourses.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#144527]">
              {lang === 'hi'
                ? 'सक्रिय प्रशिक्षण पाठ्यक्रम एवं संसाधन'
                : 'Published Courses & Learning Resources'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminCourses.map((course) => (
                <article
                  key={course.id}
                  className="rounded-2xl border border-[#479D27]/25 bg-[#FAFBF8] p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {course.mediaUrl && (
                      <div className="h-44 rounded-xl overflow-hidden border border-[#E2EAE4]">
                        <img
                          src={course.mediaUrl}
                          alt={course.titleEn}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {course.videoUrl && (
                      <video
                        controls
                        src={course.videoUrl}
                        className="w-full rounded-xl border border-[#E2EAE4] max-h-56 bg-black"
                      />
                    )}
                    <span className="text-xs font-semibold text-[#368737]">
                      {course.categoryTag}
                    </span>
                    <h3 className="text-lg font-bold text-[#144527]">
                      {lang === 'hi' && course.titleHi ? course.titleHi : course.titleEn}
                    </h3>
                    <p className="text-sm text-[#2A3A30] leading-relaxed">
                      {lang === 'hi' && course.summaryHi ? course.summaryHi : course.summaryEn}
                    </p>

                    {course.courseMeta && (
                      <dl className="grid grid-cols-2 gap-2.5 pt-2 text-xs bg-white rounded-xl p-3.5 border border-[#1B5A32]/10">
                        <div>
                          <dt className="text-[#5B6B60]">
                            {lang === 'hi' ? 'पात्रता' : 'Eligibility'}
                          </dt>
                          <dd className="font-semibold text-[#1E2923]">
                            {lang === 'hi' && course.courseMeta.eligibilityHi
                              ? course.courseMeta.eligibilityHi
                              : course.courseMeta.eligibilityEn}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#5B6B60]">
                            {lang === 'hi' ? 'अवधि' : 'Duration'}
                          </dt>
                          <dd className="font-semibold text-[#1E2923]">
                            {lang === 'hi' && course.courseMeta.durationHi
                              ? course.courseMeta.durationHi
                              : course.courseMeta.durationEn}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#5B6B60]">
                            {lang === 'hi' ? 'माध्यम' : 'Mode'}
                          </dt>
                          <dd className="font-semibold text-[#1E2923]">
                            {lang === 'hi' && course.courseMeta.modeHi
                              ? course.courseMeta.modeHi
                              : course.courseMeta.modeEn}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#5B6B60]">
                            {lang === 'hi' ? 'शुल्क / स्थिति' : 'Fee Status'}
                          </dt>
                          <dd className="font-semibold text-[#368737]">
                            {lang === 'hi' && course.courseMeta.feeStatusHi
                              ? course.courseMeta.feeStatusHi
                              : course.courseMeta.feeStatusEn}
                          </dd>
                        </div>
                      </dl>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#1B5A32]/10 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {course.pdfUrl && (
                        <a
                          href={course.pdfUrl}
                          download
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#1B5A32]/20 text-xs font-semibold text-[#144527] hover:bg-[#EDF5EE]"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'}</span>
                        </a>
                      )}
                    </div>
                    <SpringButton
                      variant="primary"
                      size="sm"
                      onClick={() => onNavigate('/join/skill-training')}
                    >
                      <span>{lang === 'hi' ? 'कोर्स आवेदन करें' : 'Apply for Course'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </SpringButton>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Articles with Rural Plain-Language Cards + Audio Helper */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TRAINING_ARTICLES.map((art) => (
            <article
              key={art.id}
              className="rounded-2xl border border-[#1B5A32]/15 bg-white p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#368737] font-semibold">
                  <span>{art.category[lang]}</span>
                  <span className="text-[#44544A]">{art.readTime}</span>
                </div>
                <h2 className="text-lg font-bold text-[#144527]">{art.title[lang]}</h2>
                <p className="text-sm text-[#2A3A30] leading-relaxed">{art.summary[lang]}</p>

                {art.ruralExample && (
                  <div className="rounded-xl bg-[#F4F8F3] border border-[#1B5A32]/15 p-4 text-xs text-[#144527] leading-relaxed">
                    {art.ruralExample[lang]}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#1B5A32]/10 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleListen(
                      art.id,
                      `${art.title[lang]}. ${art.summary[lang]} ${art.ruralExample?.[lang] ?? ''}`
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8F2E6] text-[#144527] text-xs font-semibold hover:bg-[#d8ebd5] cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {speakingId === art.id
                      ? lang === 'hi'
                        ? 'रोकें'
                        : 'Stop Audio'
                      : lang === 'hi'
                      ? 'सुनकर समझें'
                      : 'Listen'}
                  </span>
                </button>
                <SpringButton
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('/missions/carbon-credit')}
                >
                  <span>{lang === 'hi' ? 'संबंधित मिशन' : 'Related Mission'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </SpringButton>
              </div>
            </article>
          ))}
        </div>

        <ScenicHorizonStrip variant="skills" />

        {/* Dedicated Skill Course & Expert Trainer Registration Portal */}
        <section className="space-y-4">
          <div className="border-l-2 border-[#4CAF50] pl-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#144527]">
              {lang === 'hi'
                ? 'कौशल प्रशिक्षण, विदेशी भाषा एवं प्रशिक्षक पंजीकरण फॉर्म'
                : 'Dedicated Skill Training, Foreign Language & Trainer Registration'}
            </h2>
            <p className="text-xs sm:text-sm text-[#44544A] mt-1">
              {lang === 'hi'
                ? 'जापानी, जर्मन, फ्रेंच, अंग्रेजी संवाद, ग्रीन जॉब्स कोर्स में प्रवेश या विशेषज्ञ प्रशिक्षक के रूप में जुड़ने के लिए नीचे समर्पित फॉर्म भरें।'
                : 'Enroll in Japanese, German, French, Spoken English, or Green Jobs courses, or apply as a subject-matter trainer.'}
            </p>
          </div>
          <RegistrationPortal
            lang={lang}
            records={records}
            onAddRecord={onAddRecord}
            initialCategory="skill-training"
            allowedCategories={['skill-training', 'expert-trainer', 'farmer', 'gaushala']}
            onSelectCategoryRoute={(cat) => onNavigate(`/join/${cat}`)}
          />
        </section>
      </div>
    </div>
  );
}

interface EventsPageProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

export function EventsPage({ lang, onNavigate }: EventsPageProps) {
  const { bootstrap } = usePublicPortal();
  const liveEvents = bootstrap?.marathonEvents ?? [];
  const featuredEvent = liveEvents[0];
  const unifiedEvents = filterUnifiedProgrammes(bootstrap?.programmes ?? [], {
    type: 'event',
    onlyPublished: true,
  });
  const publishedMedia = (bootstrap?.contentItems ?? []).filter(
    (c) => c.status === 'Published' && (c.sectionType === 'news' || c.sectionType === 'gallery')
  );

  return (
    <div className="bg-white">
      <ScenicPageHeader
        kicker={lang === 'hi' ? 'कार्यक्रम एवं मीडिया' : 'Events & Media'}
        title={lang === 'hi' ? 'आगामी आयोजन, गैलरी एवं पत्रिका' : 'Upcoming Events, Gallery & Publications'}
        iconName="Users"
        variant="fort"
        assetKey="haritMarathon"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Featured Harit Marathon Card */}
        <div className="rounded-3xl border border-[#479D27]/20 bg-[#FAFBF8] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {featuredEvent?.bannerUrl ? (
              <img
                src={featuredEvent.bannerUrl}
                alt={featuredEvent.titleEn}
                className="h-60 lg:h-full w-full object-cover"
              />
            ) : (
              <SeamlessInlinePhoto
                assetKey="haritMarathon"
                alt="Harit Marathon Bhilwara 2026"
                className="h-60 lg:h-full w-full rounded-none"
              />
            )}
          </div>
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#368737]">
                {featuredEvent
                  ? `${lang === 'hi' ? featuredEvent.dateDisplayHi : featuredEvent.dateDisplayEn} · ${featuredEvent.district}`
                  : `${MARATHON_INFO.dateDisplay[lang]} · Bhilwara, Rajasthan`}
              </p>
              <h2 className="text-2xl font-extrabold text-[#144527] mt-1">
                {featuredEvent
                  ? lang === 'hi'
                    ? featuredEvent.titleHi
                    : featuredEvent.titleEn
                  : MARATHON_INFO.title[lang]}
              </h2>
              <p className="text-sm text-[#2A3A30] mt-2 leading-relaxed">
                {featuredEvent
                  ? lang === 'hi'
                    ? featuredEvent.themeHi
                    : featuredEvent.themeEn
                  : MARATHON_INFO.theme[lang]}{' '}
                —{' '}
                {lang === 'hi'
                  ? 'पर्यावरण जागरूकता, स्वच्छता, किसान समृद्धि, गौशाला आत्मनिर्भरता और कार्बन शिक्षा का सार्वजनिक अभियान।'
                  : 'A civic campaign uniting environmental awareness, cleanliness, farmer prosperity, Gaushala self-reliance, and carbon literacy.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <SpringButton
                variant="primary"
                size="md"
                onClick={() => onNavigate('/harit-marathon')}
              >
                <Trophy className="w-4 h-4" aria-hidden="true" />
                <span>{lang === 'hi' ? 'हरित मैराथन पेज खोलें' : 'Open Harit Marathon Page'}</span>
              </SpringButton>
              <SpringButton
                variant="outline"
                size="md"
                onClick={() => onNavigate('/magazine')}
              >
                <BookOpen className="w-4 h-4 text-[#368737]" aria-hidden="true" />
                <span>{lang === 'hi' ? 'त्रैमासिक पत्रिका' : 'Quarterly Magazine'}</span>
              </SpringButton>
            </div>
          </div>
        </div>

        {/* Additional Admin-Published Events if more than 1 */}
        {liveEvents.length > 1 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#144527]">
              {lang === 'hi' ? 'अन्य क्षेत्रीय कार्यक्रम' : 'Additional Scheduled Programmes'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveEvents.slice(1).map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-2xl border border-[#1B5A32]/15 bg-[#FAFBF8] p-5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-[#368737] font-semibold">
                    <span>
                      {ev.district} · {lang === 'hi' ? ev.dateDisplayHi : ev.dateDisplayEn}
                    </span>
                    <span>{ev.status}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#144527]">
                    {lang === 'hi' ? ev.titleHi : ev.titleEn}
                  </h3>
                  <p className="text-xs text-[#44544A]">
                    {lang === 'hi' ? ev.venueHi : ev.venueEn}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Live Unified Field Events & Activities from Central Hub */}
        {unifiedEvents.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#144527]">
              {lang === 'hi'
                ? 'सक्रिय क्षेत्रीय आयोजन एवं अभियान गतिविधियाँ'
                : 'Live Field Events & Campaign Activities'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {unifiedEvents.map((ev) => {
                const firstDistrict = ev.locations[0]?.district || 'Bhilwara';
                const joinUrl = `/join/${encodeURIComponent(
                  ev.linkedFormType || 'volunteer'
                )}?campaign=${encodeURIComponent(ev.programmeCode)}&campaignTitle=${encodeURIComponent(
                  ev.titleEn
                )}&district=${encodeURIComponent(firstDistrict)}`;
                return (
                  <div
                    key={ev.id}
                    className="rounded-2xl border border-[#1B5A32]/15 bg-[#F4F8F3] p-5 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#368737] font-semibold">
                        <span className="font-mono">{ev.programmeCode}</span>
                        <span>{ev.operationalStatus}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#144527]">
                        {lang === 'hi' ? ev.titleHi || ev.titleEn : ev.titleEn}
                      </h3>
                      <p className="text-xs text-[#2A3A30] leading-relaxed">
                        {lang === 'hi' ? ev.summaryHi || ev.summaryEn : ev.summaryEn}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#44544A]">
                        {ev.locations.length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#368737]" />
                            {ev.locations
                              .map((l) =>
                                l.localityName ? `${l.localityName}, ${l.district}` : l.district
                              )
                              .join(' · ')}
                          </span>
                        )}
                        {ev.startDate && (
                          <span className="inline-flex items-center gap-1 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-[#368737]" />
                            {ev.startDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <SpringButton
                        variant="primary"
                        size="sm"
                        onClick={() => onNavigate(joinUrl)}
                      >
                        <span>{lang === 'hi' ? 'सहभागी बनें' : 'Register for Activity'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </SpringButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Dynamic News & Media Gallery from Admin CMS */}
        {publishedMedia.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#144527]">
              {lang === 'hi'
                ? 'प्रकाशित समाचार, वीडियो एवं दस्तावेज़ गैलरी'
                : 'Published News, Video & Media Updates'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {publishedMedia.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-[#479D27]/20 overflow-hidden bg-white flex flex-col justify-between"
                >
                  <div>
                    {item.videoUrl ? (
                      <video
                        controls
                        src={item.videoUrl}
                        className="w-full h-48 object-cover bg-black"
                      />
                    ) : item.mediaUrl ? (
                      <img
                        src={item.mediaUrl}
                        alt={item.titleEn}
                        className="w-full h-48 object-cover"
                      />
                    ) : null}
                    <div className="p-4 space-y-1.5">
                      <span className="text-[11px] font-semibold text-[#368737]">
                        {item.categoryTag}
                      </span>
                      <h3 className="text-sm font-bold text-[#144527]">
                        {lang === 'hi' && item.titleHi ? item.titleHi : item.titleEn}
                      </h3>
                      <p className="text-xs text-[#44544A] leading-relaxed">
                        {lang === 'hi' && item.summaryHi ? item.summaryHi : item.summaryEn}
                      </p>
                    </div>
                  </div>
                  {item.pdfUrl && (
                    <div className="px-4 pb-4">
                      <a
                        href={item.pdfUrl}
                        download
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#144527] hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'संलग्न PDF डाउनलोड करें' : 'Download Attached PDF'}</span>
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Visual Showcase Gallery — 9 Unique Rajasthan Field Visuals */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#144527]">
            {lang === 'hi' ? 'अभियान एवं क्षेत्रीय झलकियाँ (Photo Gallery)' : 'Campaign & Field Visuals'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { img: 'haritRajasthan' as const, caption: { hi: 'राजस्थान ग्रामीण वृक्षारोपण एवं कृषि वानिकी', en: 'Rajasthan agroforestry & native plantation' } },
              { img: 'carbonFarmer' as const, caption: { hi: 'किसान संवाद एवं पौध संरक्षण पहल', en: 'Farmer dialogue & sapling stewardship' } },
              { img: 'gaushalaBiogas' as const, caption: { hi: 'आत्मनिर्भर गौशाला एवं जैविक खाद मॉडल', en: 'Self-reliant Gaushala & vermicompost model' } },
              { img: 'biogasCbgPlant' as const, caption: { hi: 'बायोगैस एवं स्वच्छ ग्रामीण ऊर्जा संयंत्र', en: 'Biogas digester & clean rural energy plant' } },
              { img: 'organicAgroforestry' as const, caption: { hi: 'खेत की मेड़ों पर खेजड़ी व नीम कृषि वानिकी', en: 'Khejri & Neem farm-boundary agroforestry' } },
              { img: 'waterJohadKund' as const, caption: { hi: 'पारंपरिक जोहड़ एवं बावड़ी जल संरक्षण', en: 'Traditional Johad & stepwell water conservation' } },
              { img: 'youthSkillLab' as const, caption: { hi: 'ग्रामीण युवा डिजिटल एवं विदेशी भाषा प्रशिक्षण', en: 'Rural youth digital & foreign language lab' } },
              { img: 'womenSkill' as const, caption: { hi: 'महिला SHG कपड़े के थैले एवं कुटीर उद्यमिता', en: 'Women SHG cloth-bag craft & micro-enterprise' } },
              { img: 'seniorWellness' as const, caption: { hi: 'वरिष्ठ नागरिक सम्मान एवं सामुदायिक संवाद', en: 'Senior citizen wellness & community dialogue' } },
            ].map((item) => (
              <figure key={item.caption.en} className="rounded-3xl border border-[#479D27]/20 overflow-hidden bg-[#FAFBF8]">
                <SeamlessInlinePhoto
                  assetKey={item.img}
                  alt={item.caption.en}
                  className="h-44 w-full rounded-none"
                />
                <figcaption className="p-3.5 text-xs font-medium text-[#144527] -mt-1 relative z-10">
                  {item.caption[lang]}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Press Releases & Updates Notice */}
        <div className="rounded-2xl border border-[#1B5A32]/15 bg-[#F4F8F3] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-[#144527]">
              <Newspaper className="w-4 h-4 text-[#368737]" />
              <span>{lang === 'hi' ? 'प्रेस विज्ञप्ति एवं मीडिया संपर्क' : 'Press Releases & Media Inquiries'}</span>
            </div>
            <p className="text-xs text-[#44544A]">
              {lang === 'hi'
                ? 'आधिकारिक प्रेस विज्ञप्तियाँ, प्रशासनिक सहभागिता विवरण और मीडिया कवरेज औपचारिक पुष्टि के उपरांत प्रकाशित किए जाते हैं।'
                : 'Official press releases and confirmed event announcements are published following institutional verification.'}
            </p>
          </div>
          <SpringButton variant="outline" size="sm" onClick={() => onNavigate('/contact')}>
            <span>{lang === 'hi' ? 'मीडिया संपर्क' : 'Media Desk'}</span>
          </SpringButton>
        </div>
      </div>
    </div>
  );
}

interface HaritMarathonPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

export function HaritMarathonPage({
  lang,
  records,
  onAddRecord,
  onNavigate,
}: HaritMarathonPageProps) {
  const { bootstrap } = usePublicPortal();
  const liveEvent = bootstrap?.marathonEvents?.[0];

  const countdownTarget = liveEvent?.eventDate
    ? `${liveEvent.eventDate}T06:00:00+05:30`
    : undefined;
  const countdown = getMarathonCountdown(new Date(), countdownTarget);
  const showCountdown =
    liveEvent?.countdownEnabled !== false && !countdown.isPast;

  const categories =
    liveEvent?.raceCategories && liveEvent.raceCategories.length > 0
      ? liveEvent.raceCategories
      : MARATHON_INFO.categories;

  const schedule =
    liveEvent?.schedule && liveEvent.schedule.length > 0
      ? liveEvent.schedule
      : MARATHON_INFO.schedule;

  const confirmedGuests = liveEvent?.guests ?? [];
  const confirmedSponsors = liveEvent?.sponsors ?? [];

  return (
    <div className="bg-white">
      {/* Banner (Light & Airy Palette — Driven dynamically from Admin Events) */}
      <section className="bg-[#F6FAF5] border-b border-[#388E3C]/20 text-[#1E2923]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#388E3C]">
              {liveEvent
                ? `${lang === 'hi' ? 'विशेष जन-जागरूकता अभियान' : 'Special Public Campaign'} · ${liveEvent.district} · ${liveEvent.status}`
                : lang === 'hi'
                ? 'विशेष जन-जागरूकता अभियान • भीलवाड़ा'
                : 'Special Public Campaign · Bhilwara'}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E5B2A] leading-tight">
              {liveEvent
                ? lang === 'hi'
                  ? liveEvent.titleHi
                  : liveEvent.titleEn
                : MARATHON_INFO.title[lang]}
            </h1>
            <p className="text-lg font-semibold text-[#388E3C]">
              {liveEvent
                ? lang === 'hi'
                  ? liveEvent.themeHi
                  : liveEvent.themeEn
                : MARATHON_INFO.theme[lang]}
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-sm text-[#2A3A30]">
              <span className="inline-flex items-center gap-2 font-semibold">
                <Calendar className="w-4 h-4 text-[#388E3C]" />
                <span>
                  {liveEvent
                    ? lang === 'hi'
                      ? liveEvent.dateDisplayHi
                      : liveEvent.dateDisplayEn
                    : MARATHON_INFO.dateDisplay[lang]}
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#388E3C]" />
                <span>
                  {liveEvent
                    ? lang === 'hi'
                      ? liveEvent.venueHi
                      : liveEvent.venueEn
                    : MARATHON_INFO.venue[lang]}
                </span>
              </span>
            </div>

            {showCountdown && (
              <div className="pt-3 flex items-center gap-3 tabular-nums">
                <div className="bg-white border border-[#388E3C]/25 rounded-xl px-4 py-2 text-center shadow-2xs">
                  <p className="text-2xl font-extrabold text-[#1E5B2A]">{countdown.days}</p>
                  <p className="text-[11px] text-[#44544A]">{lang === 'hi' ? 'दिन' : 'Days'}</p>
                </div>
                <div className="bg-white border border-[#388E3C]/25 rounded-xl px-4 py-2 text-center shadow-2xs">
                  <p className="text-2xl font-extrabold text-[#1E5B2A]">{countdown.hours}</p>
                  <p className="text-[11px] text-[#44544A]">{lang === 'hi' ? 'घंटे' : 'Hours'}</p>
                </div>
                <div className="bg-white border border-[#388E3C]/25 rounded-xl px-4 py-2 text-center shadow-2xs">
                  <p className="text-2xl font-extrabold text-[#1E5B2A]">{countdown.minutes}</p>
                  <p className="text-[11px] text-[#44544A]">{lang === 'hi' ? 'मिनट' : 'Mins'}</p>
                </div>
              </div>
            )}

            {liveEvent?.postEventReportUrl && (
              <div className="pt-2">
                <a
                  href={liveEvent.postEventReportUrl}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#388E3C]/30 text-xs font-bold text-[#144527] hover:bg-[#EDF5EE]"
                >
                  <Download className="w-4 h-4 text-[#368737]" />
                  <span>
                    {lang === 'hi' ? 'आधिकारिक इवेंट रिपोर्ट (PDF)' : 'Download Official Event Report (PDF)'}
                  </span>
                </a>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            {liveEvent?.bannerUrl ? (
              <img
                src={liveEvent.bannerUrl}
                alt={liveEvent.titleEn}
                className="h-64 sm:h-72 w-full object-cover rounded-3xl border border-[#388E3C]/20"
              />
            ) : (
              <SeamlessInlinePhoto
                assetKey="haritMarathon"
                alt="Participants running in Harit Marathon Bhilwara"
                className="h-64 sm:h-72 w-full"
              />
            )}
          </div>
        </div>
        <ScenicHorizonStrip variant="village" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Categories & Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xl font-bold text-[#144527]">
              {lang === 'hi' ? 'मैराथन श्रेणियाँ (Categories)' : 'Marathon Categories'}
            </h2>
            <div className="space-y-3">
              {categories.map((c) => (
                <div
                  key={c.name}
                  className="rounded-2xl border border-[#1B5A32]/15 bg-[#FAFBF8] p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-sm text-[#144527]">{c.name}</p>
                    <p className="text-xs text-[#44544A]">{c.fee}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#368737]">{c.age}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xl font-bold text-[#144527]">
              {lang === 'hi' ? 'प्रस्तावित समय-सारणी (Event Schedule)' : 'Indicative Event Schedule'}
            </h2>
            <div className="rounded-2xl border border-[#1B5A32]/15 bg-white divide-y divide-[#1B5A32]/10">
              {schedule.map((item) => (
                <div key={item.time} className="p-3.5 flex items-center gap-4 text-xs sm:text-sm">
                  <span className="font-mono font-bold text-[#368737] shrink-0 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    {item.time}
                  </span>
                  <span className="text-[#1E2923]">
                    {'activity' in item
                      ? item.activity[lang]
                      : lang === 'hi'
                      ? item.activityHi
                      : item.activityEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rules, Guests, Sponsors, Safety Notice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm">
          <div className="rounded-2xl border border-[#1B5A32]/15 bg-[#FAFBF8] p-5 space-y-2">
            <h3 className="font-bold text-[#144527]">
              {lang === 'hi' ? 'रूट, नियम एवं सुरक्षा' : 'Route, Rules & Safety'}
            </h3>
            <p className="text-[#44544A] leading-relaxed">
              {liveEvent
                ? [
                    lang === 'hi' ? liveEvent.routeNotesHi : liveEvent.routeNotesEn,
                    lang === 'hi' ? liveEvent.rulesHi : liveEvent.rulesEn,
                    lang === 'hi' ? liveEvent.safetyInfoHi : liveEvent.safetyInfoEn,
                  ]
                    .filter(Boolean)
                    .join(' ') ||
                  (lang === 'hi'
                    ? 'रूट मैप, प्राथमिक चिकित्सा केंद्र, पेयजल स्टेशन और यातायात व्यवस्था स्थानीय प्रशासन की अंतिम स्वीकृति के साथ प्रकाशित की जाएगी।'
                    : 'Verified route map, hydration points, first-aid ambulances, and traffic coordination will be finalised with district authorities.')
                : lang === 'hi'
                ? 'रूट मैप, प्राथमिक चिकित्सा केंद्र, पेयजल स्टेशन और यातायात व्यवस्था स्थानीय प्रशासन की अंतिम स्वीकृति के साथ प्रकाशित की जाएगी।'
                : 'Verified route map, hydration points, first-aid ambulances, and traffic coordination will be finalised with district authorities.'}
            </p>
          </div>
          <div className="rounded-2xl border border-[#1B5A32]/15 bg-[#FAFBF8] p-5 space-y-2.5">
            <h3 className="font-bold text-[#144527]">
              {lang === 'hi' ? 'अतिथि एवं प्रायोजक' : 'Guests, Speakers & Sponsors'}
            </h3>
            {confirmedGuests.length === 0 && confirmedSponsors.length === 0 ? (
              <p className="text-[#44544A] leading-relaxed">
                {lang === 'hi'
                  ? 'किसी भी जनप्रतिनिधि या अधिकारी का नाम केवल औपचारिक सहमति और पुष्टि के बाद ही प्रदर्शित किया जाएगा।'
                  : 'Public officials, civic guests, and sponsors are announced strictly upon formal written confirmation.'}
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {confirmedGuests.map((g) => (
                  <div key={g.id} className="p-2 rounded-lg bg-white border border-[#E2EAE4]">
                    <p className="font-bold text-[#142119]">{g.name}</p>
                    <p className="text-[#368737]">{g.designationOrTier}</p>
                  </div>
                ))}
                {confirmedSponsors.map((s) => (
                  <div key={s.id} className="p-2 rounded-lg bg-white border border-[#E2EAE4] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#368737] shrink-0" />
                    <div>
                      <p className="font-bold text-[#142119]">{s.name}</p>
                      <p className="text-[#55685C]">{s.designationOrTier}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-[#1B5A32]/15 bg-[#F4F8F3] p-5 space-y-3">
            <h3 className="font-bold text-[#144527]">
              {lang === 'hi' ? 'स्वयंसेवक या प्रायोजक बनें' : 'Volunteer or Partner'}
            </h3>
            <div className="flex flex-wrap gap-2">
              <SpringButton
                variant="outline"
                size="sm"
                onClick={() => onNavigate('/join/volunteer')}
              >
                <span>{lang === 'hi' ? 'स्वयंसेवक बनें' : 'Volunteer'}</span>
              </SpringButton>
              <SpringButton
                variant="primary"
                size="sm"
                onClick={() => onNavigate('/partnership')}
              >
                <span>{lang === 'hi' ? 'इवेंट पार्टनर' : 'Sponsor Event'}</span>
              </SpringButton>
            </div>
          </div>
        </div>

        {/* Registration Portal for Marathon */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#144527]">
            {lang === 'hi' ? 'हरित मैराथन प्रतिभागी पंजीकरण' : 'Harit Marathon Participant Registration'}
          </h2>
          {liveEvent && liveEvent.registrationOpen === false ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
              {lang === 'hi'
                ? 'वर्तमान में इस आयोजन के लिए पंजीकरण अस्थायी रूप से बंद है। कृपया शीघ्र ही पुनः जाँच करें।'
                : 'Participant registration for this event is currently paused by the programme coordinator.'}
            </div>
          ) : (
            <RegistrationPortal
              lang={lang}
              records={records}
              onAddRecord={onAddRecord}
              initialCategory="marathon"
              allowedCategories={['marathon', 'volunteer', 'csr-partner']}
              onSelectCategoryRoute={(cat) => onNavigate(`/join/${cat}`)}
            />
          )}
        </section>
      </div>
    </div>
  );
}

interface MagazinePageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

export function MagazinePage({
  lang,
  records,
  onAddRecord,
  onNavigate,
}: MagazinePageProps) {
  const { bootstrap } = usePublicPortal();
  const gov = bootstrap?.siteGovernance;
  const magazineIssues = (bootstrap?.contentItems ?? []).filter(
    (c) => c.status === 'Published' && c.sectionType === 'magazine'
  );

  const title = gov
    ? lang === 'hi'
      ? gov.magazineTitleHi
      : gov.magazineTitleEn
    : MAGAZINE_INFO.proposedName[lang];

  return (
    <div className="bg-white">
      <ScenicPageHeader
        kicker={
          gov
            ? `${lang === 'hi' ? 'त्रैमासिक पत्रिका' : 'Quarterly Publication'} · ${gov.magazineRegStatus}${gov.magazineRegNumber ? ` (${gov.magazineRegNumber})` : ''}`
            : lang === 'hi'
            ? 'त्रैमासिक पत्रिका'
            : 'Quarterly Publication'
        }
        title={title}
        subtitle={MAGAZINE_INFO.note[lang]}
        iconName="Sprout"
        variant="carbon"
        assetKey="organicAgroforestry"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="rounded-3xl border border-[#479D27]/20 bg-[#FAFBF8] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5">
            <SeamlessInlinePhoto
              assetKey="carbonFarmer"
              alt="Harit Bharat Samvad Quarterly Magazine"
              className="h-56 w-full"
            />
          </div>
          <div className="md:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-[#144527]">
                {lang === 'hi' ? 'संपादकीय खंड एवं प्रकाशन विवरण' : 'Editorial Sections & Edition Details'}
              </h2>
              {gov && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E8F2E6] text-[#144527]">
                  RNI: {gov.magazineRegStatus}
                  {gov.magazineRegNumber ? ` · ${gov.magazineRegNumber}` : ''}
                </span>
              )}
            </div>
            <ul className="space-y-2 text-sm text-[#2A3A30]">
              {MAGAZINE_INFO.sections.map((s) => (
                <li key={s.en} className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#368737]" />
                  <span>{s[lang]}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 flex flex-wrap gap-3">
              {gov?.magazineLatestPdfUrl && (
                <a
                  href={gov.magazineLatestPdfUrl}
                  download
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E5B2A] text-white text-xs font-semibold hover:bg-[#14431D]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'नवीनतम अंक (PDF) पढ़ें' : 'Download Latest Issue (PDF)'}</span>
                </a>
              )}
              <SpringButton variant="primary" size="sm" onClick={() => onNavigate('/join/membership')}>
                <span>{lang === 'hi' ? 'सदस्यता एवं लेख फॉर्म' : 'Subscription & Article Form'}</span>
              </SpringButton>
              <SpringButton variant="outline" size="sm" onClick={() => onNavigate('/partnership')}>
                <span>{lang === 'hi' ? 'विज्ञापन एवं प्रायोजन' : 'Advertisement Inquiry'}</span>
              </SpringButton>
            </div>
          </div>
        </div>

        {/* Published Magazine Issues & Articles from Admin */}
        {magazineIssues.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#144527]">
              {lang === 'hi' ? 'प्रकाशित अंक एवं लेख' : 'Published Magazine Articles & Issues'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {magazineIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="rounded-2xl border border-[#1B5A32]/15 bg-white p-5 space-y-2"
                >
                  <span className="text-[11px] font-semibold text-[#368737]">{issue.categoryTag}</span>
                  <h3 className="text-base font-bold text-[#144527]">
                    {lang === 'hi' && issue.titleHi ? issue.titleHi : issue.titleEn}
                  </h3>
                  <p className="text-xs text-[#44544A] leading-relaxed">
                    {lang === 'hi' && issue.summaryHi ? issue.summaryHi : issue.summaryEn}
                  </p>
                  {issue.pdfUrl && (
                    <a
                      href={issue.pdfUrl}
                      download
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#144527] hover:underline pt-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'PDF डाउनलोड करें' : 'Download PDF Edition'}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="text-xs text-[#44544A] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#368737]" />
          <span>
            {lang === 'hi'
              ? 'पत्रिका का मुद्रण और वितरण लागू पंजीकरण एवं वैधानिक अनुमोदनों के पश्चात प्रारंभ होगा।'
              : 'Print and distribution commence strictly after applicable publication registration approvals.'}
          </span>
        </p>

        {/* Dedicated Magazine & Membership Registration Form */}
        <section className="space-y-4 pt-4 border-t border-stone-200">
          <h2 className="text-xl font-bold text-[#144527]">
            {lang === 'hi'
              ? 'हरित भारत संवाद — सदस्यता एवं लेख योगदान पंजीकरण'
              : 'Harit Bharat Samvad — Subscription & Editorial Contribution Form'}
          </h2>
          <RegistrationPortal
            lang={lang}
            records={records}
            onAddRecord={onAddRecord}
            initialCategory="membership"
            allowedCategories={['membership', 'expert-trainer', 'csr-partner']}
            onSelectCategoryRoute={(cat) => onNavigate(`/join/${cat}`)}
          />
        </section>
      </div>
    </div>
  );
}
