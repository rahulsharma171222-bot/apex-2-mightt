import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  MapPin,
  CheckCircle2,
  Phone,
  Download,
  Briefcase,
} from 'lucide-react';
import { SpringButton } from '../components/SpringMotion';
import { GovedaMissionSvg } from '../components/GovedaIcons';
import {
  ScenicPageHeader,
  ScenicHorizonStrip,
  type ScenicVariant,
} from '../components/ScenicElements';
import {
  RegistrationPortal,
  CATEGORY_OPTIONS,
} from '../components/RegistrationForms';
import { BRAND_INFO } from '../data/siteContent';
import { ApiError, submitPublicForm } from '../admin/apiClient';
import { usePublicPortal } from '../context/PublicPortalContext';
import type { AssetKey } from '../data/assets';
import type { Language, RegistrationCategory, RegistrationRecord } from '../types/goveda';

interface JoinPageProps {
  lang: Language;
  initialCategory?: RegistrationCategory;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

function getCategoryHeaderTheme(cat: RegistrationCategory): {
  variant: ScenicVariant;
  assetKey: AssetKey;
  iconName: string;
} {
  switch (cat) {
    case 'farmer':
      return { variant: 'carbon', assetKey: 'carbonFarmer', iconName: 'Sprout' };
    case 'harit-mitra':
      return { variant: 'fort', assetKey: 'haritRajasthan', iconName: 'Users' };
    case 'gaushala':
      return { variant: 'gaushala', assetKey: 'gaushalaBiogas', iconName: 'Home' };
    case 'school-college':
      return { variant: 'skills', assetKey: 'youthSkillLab', iconName: 'GraduationCap' };
    case 'women-shg':
      return { variant: 'village', assetKey: 'womenSkill', iconName: 'Users' };
    case 'skill-training':
      return { variant: 'skills', assetKey: 'youthSkillLab', iconName: 'GraduationCap' };
    case 'volunteer':
      return { variant: 'village', assetKey: 'wasteCleanVillage', iconName: 'HeartHandshake' };
    case 'marathon':
      return { variant: 'fort', assetKey: 'haritMarathon', iconName: 'SunMedium' };
    case 'csr-partner':
      return { variant: 'fort', assetKey: 'heritageSolar', iconName: 'Landmark' };
    case 'ngo-institution':
      return { variant: 'village', assetKey: 'organicAgroforestry', iconName: 'Trees' };
    case 'expert-trainer':
      return { variant: 'carbon', assetKey: 'biogasCbgPlant', iconName: 'CloudSun' };
    case 'membership':
      return { variant: 'water', assetKey: 'waterJohadKund', iconName: 'HeartHandshake' };
    default:
      return { variant: 'village', assetKey: 'haritRajasthan', iconName: 'Users' };
  }
}

export function JoinPage({
  lang,
  initialCategory = 'farmer',
  records,
  onAddRecord,
  onNavigate,
}: JoinPageProps) {
  const activeOption =
    CATEGORY_OPTIONS.find((c) => c.id === initialCategory) ?? CATEGORY_OPTIONS[0];
  const headerTheme = getCategoryHeaderTheme(activeOption.id);

  return (
    <div className="bg-white">
      <ScenicPageHeader
        kicker={
          lang === 'hi'
            ? `समर्पित पंजीकरण फॉर्म #${String(activeOption.number).padStart(2, '0')} • 12 श्रेणियाँ`
            : `Dedicated Form #${String(activeOption.number).padStart(2, '0')} of 12 • Public Portal`
        }
        title={activeOption.label[lang]}
        subtitle={activeOption.subtitle[lang]}
        iconName={headerTheme.iconName}
        variant={headerTheme.variant}
        assetKey={headerTheme.assetKey}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <RegistrationPortal
          lang={lang}
          records={records}
          onAddRecord={onAddRecord}
          initialCategory={initialCategory}
          showDirectoryGrid={true}
          onSelectCategoryRoute={(cat) => onNavigate(`/join/${cat}`)}
        />
      </div>
    </div>
  );
}

interface PartnershipPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate?: (path: string) => void;
}

export function PartnershipPage({
  lang,
  records,
  onAddRecord,
  onNavigate,
}: PartnershipPageProps) {
  const { bootstrap } = usePublicPortal();
  const csrProposals = (bootstrap?.csrProposals ?? []).filter((c) => c.isPublished);
  const gov = bootstrap?.siteGovernance ?? null;

  const scrollToCsrForm = () => {
    const el = document.getElementById('csr-inquiry-portal');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white">
      <ScenicPageHeader
        kicker={lang === 'hi' ? 'सहयोग एवं दान' : 'Partnership & Donation'}
        title={
          lang === 'hi'
            ? 'GOVEDA के साथ संस्थागत सहभागिता एवं पारदर्शी सहयोग'
            : 'Partner With GOVEDA — CSR, Academic & Civic Collaboration'
        }
        subtitle={
          lang === 'hi'
            ? 'CSR प्रोजेक्ट्स, विश्वविद्यालय शोध, ग्राम अभियान प्रायोजन तथा पारदर्शी वित्तीय सहयोग।'
            : 'Structured CSR initiatives, institutional partnerships, campaign sponsorships, and verified donation governance.'
        }
        iconName="Landmark"
        variant="fort"
        assetKey="heritageSolar"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* 6 Partnership Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { iconName: 'Landmark', title: { hi: 'CSR पार्टनरशिप', en: 'CSR Partnership' }, desc: { hi: 'वृक्षारोपण, गौशाला आत्मनिर्भरता, जल संरक्षण व कौशल विकास में दीर्घकालिक CSR परियोजनाएँ।', en: 'Structured district CSR programs for plantation, Gaushalas, water, and youth skills.' } },
            { iconName: 'Users', title: { hi: 'कॉर्पोरेट एवं इवेंट प्रायोजन', en: 'Corporate Sponsorship' }, desc: { hi: 'हरित मैराथन 2026, ग्रीन कैंपस व जनजागरूकता अभियानों में सह-प्रायोजन।', en: 'Sponsor public awareness initiatives including Harit Marathon Bhilwara 2026.' } },
            { iconName: 'GraduationCap', title: { hi: 'विश्वविद्यालय एवं संस्थान सहयोग', en: 'University & Institutional Collaboration' }, desc: { hi: 'ग्रीन कैंपस, MRV शोध, मृदा-जल परीक्षण एवं छात्र स्वयंसेवा।', en: 'Academic research, Green Campus hubs, soil testing labs, and student fellowships.' } },
            { iconName: 'Trees', title: { hi: 'NGO एवं सामाजिक संगठन सहयोग', en: 'NGO Collaboration' }, desc: { hi: 'क्षेत्रीय जमीनी संस्थाओं के साथ समन्वित हरित अभियान।', en: 'Grassroots coordination with local Rajasthan NGOs and panchayat bodies.' } },
            { iconName: 'HeartHandshake', title: { hi: 'व्यक्तिगत योगदान (Individual Donation)', en: 'Individual Donation & Sponsor a Campaign' }, desc: { hi: 'पारदर्शी एवं सत्यापित संस्थागत बैंक चैनल द्वारा जन-सहयोग।', en: 'Support verified local sapling care, water kund revival, or SHG training.' } },
            { iconName: 'CloudSun', title: { hi: 'दान पारदर्शिता व अनुपालन', en: 'Donation Transparency & Partner Recognition' }, desc: { hi: 'रसीद और कर-लाभ जानकारी केवल वास्तविक वैध अनुमोदनों के अनुसार।', en: 'Bank details, receipts, and tax benefit notices strictly follow active statutory approvals.' } },
          ].map((opt) => (
            <div
              key={opt.title.en}
              className="rounded-3xl border border-[#479D27]/20 bg-[#FAFBF8] p-5 space-y-2.5"
            >
              <GovedaMissionSvg iconName={opt.iconName} className="w-10 h-10" />
              <h2 className="text-base font-bold text-[#144527]">{opt.title[lang]}</h2>
              <p className="text-xs text-[#44544A] leading-relaxed">{opt.desc[lang]}</p>
            </div>
          ))}
        </div>

        {/* Active Published CSR Project Proposals */}
        {csrProposals.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#368737]" />
                <h2 className="text-xl font-bold text-[#144527]">
                  {lang === 'hi' ? 'सक्रिय CSR परियोजना प्रस्ताव' : 'Active CSR Project Proposals'}
                </h2>
              </div>
              <span className="text-xs text-[#44544A]">
                {lang === 'hi'
                  ? 'प्रत्येक प्रस्ताव की अवधारणा टिप्पणी डाउनलोड करें या CSR रुचि दर्ज करें'
                  : 'Download concept notes or submit institutional CSR interest below'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {csrProposals.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#1B5A32]/15 bg-[#FAFBF8] p-5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#368737]">{item.missionPillar}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#1B5A32]/20 font-bold text-[#144527]">
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#144527]">
                      {lang === 'hi' ? item.titleHi : item.titleEn}
                    </h3>
                    <p className="text-xs text-[#2A3A30] leading-relaxed">
                      {lang === 'hi' ? item.summaryHi : item.summaryEn}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-[#44544A]">
                      {item.targetDistricts && (
                        <div className="bg-white rounded-lg px-3 py-1.5 border border-[#1B5A32]/10">
                          <strong className="text-[#144527]">
                            {lang === 'hi' ? 'लक्षित जिले:' : 'Districts:'}
                          </strong>{' '}
                          {item.targetDistricts}
                        </div>
                      )}
                      {item.budgetLabel && (
                        <div className="bg-white rounded-lg px-3 py-1.5 border border-[#1B5A32]/10">
                          <strong className="text-[#144527]">
                            {lang === 'hi' ? 'बजट रूपरेखा:' : 'Budget Scope:'}
                          </strong>{' '}
                          {item.budgetLabel}
                        </div>
                      )}
                    </div>
                    {(item.beneficiaryScopeEn || item.beneficiaryScopeHi) && (
                      <p className="text-[11px] text-[#44544A]">
                        <strong className="text-[#144527]">
                          {lang === 'hi' ? 'लाभार्थी क्षेत्र:' : 'Beneficiaries:'}
                        </strong>{' '}
                        {lang === 'hi' ? item.beneficiaryScopeHi : item.beneficiaryScopeEn}
                      </p>
                    )}
                  </div>
                  <div className="pt-3 border-t border-[#1B5A32]/10 flex flex-wrap items-center justify-between gap-2">
                    {item.proposalPdfUrl ? (
                      <a
                        href={item.proposalPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#1B5A32]/20 text-xs font-semibold text-[#144527] hover:bg-[#E8F2E6]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'प्रस्ताव PDF डाउनलोड' : 'Download Concept Note'}</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-[#5B6B60]">
                        {lang === 'hi' ? 'विस्तृत प्रस्ताव अनुरोध पर उपलब्ध' : 'Detailed deck shared on inquiry'}
                      </span>
                    )}
                    <SpringButton variant="primary" size="sm" onClick={scrollToCsrForm}>
                      <span>{lang === 'hi' ? 'CSR रुचि दर्ज करें' : 'Express CSR Interest'}</span>
                    </SpringButton>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <ScenicHorizonStrip variant="village" />

        {/* Donation Transparency Charter */}
        <div
          id="donate"
          className="rounded-2xl bg-[#F4F8F3] border border-[#1B5A32]/20 p-6 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#144527]">
              <ShieldCheck className="w-5 h-5 text-[#368737]" />
              <span>
                {lang === 'hi'
                  ? 'सत्यापित बैंक विवरण एवं वैधानिक अनुपालन सूचना'
                  : 'Verified Bank Details & Statutory Receipt Charter'}
              </span>
            </div>
            {gov && (
              <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
                <span className={`px-2.5 py-0.5 rounded-full border ${gov.eightyGApproved ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-white border-[#1B5A32]/20 text-[#44544A]'}`}>
                  80G: {gov.eightyGApproved ? (lang === 'hi' ? 'स्वीकृत' : 'Approved') : (lang === 'hi' ? 'लंबित / पुष्टि उपरांत' : 'Pending Verification')}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border ${gov.fcraApproved ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-white border-[#1B5A32]/20 text-[#44544A]'}`}>
                  FCRA: {gov.fcraApproved ? (lang === 'hi' ? 'स्वीकृत' : 'Approved') : (lang === 'hi' ? 'सक्रिय नहीं' : 'Not Active')}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border ${gov.paymentGatewayEnabled ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-white border-[#1B5A32]/20 text-[#44544A]'}`}>
                  {lang === 'hi' ? 'ऑनलाइन गेटवे:' : 'Online Gateway:'}{' '}
                  {gov.paymentGatewayEnabled ? (lang === 'hi' ? 'सक्रिय' : 'Enabled') : (lang === 'hi' ? 'अभी सक्रिय नहीं' : 'Not Enabled Yet')}
                </span>
              </div>
            )}
          </div>

          {gov?.bankConfirmedForPublic && gov.bankAccountSummary?.trim() ? (
            <div className="rounded-xl bg-white border border-[#1B5A32]/15 p-4 text-xs sm:text-sm text-[#144527] space-y-1">
              <p className="font-bold">
                {lang === 'hi' ? 'सत्यापित संस्थागत बैंक विवरण:' : 'Verified Institutional Bank Account:'}
              </p>
              <p className="whitespace-pre-line font-mono text-xs text-[#2A3A30]">{gov.bankAccountSummary}</p>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-[#2A3A30] leading-relaxed">
              {lang === 'hi'
                ? 'दान पेज पर केवल सत्यापित संस्थागत बैंक/पेमेंट विवरण प्रदर्शित किए जाते हैं। रसीद और 80G कर-लाभ से संबंधित विवरण वास्तविक वैध अनुमोदनों के अनुसार ही जारी किए जाएंगे। औपचारिक CSR या दान समन्वय हेतु नीचे फॉर्म सबमिट करें अथवा govedaindiafoundation@gmail.com पर लिखें।'
                : 'Only verified institutional banking details are published on final portal integration. Donation receipts and tax-exemption statements strictly follow active statutory approvals. Submit the CSR & Partnership Inquiry form below or write to govedaindiafoundation@gmail.com.'}
            </p>
          )}
        </div>

        {/* CSR & Partnership Inquiry Portal */}
        <div id="csr-inquiry-portal">
          <RegistrationPortal
            lang={lang}
            records={records}
            onAddRecord={onAddRecord}
            initialCategory="csr-partner"
            allowedCategories={['csr-partner', 'ngo-institution', 'school-college', 'membership']}
            onSelectCategoryRoute={onNavigate ? (cat) => onNavigate(`/join/${cat}`) : undefined}
          />
        </div>
      </div>
    </div>
  );
}

interface ContactPageProps {
  lang: Language;
}

export function ContactPage({ lang }: ContactPageProps) {
  const { bootstrap } = usePublicPortal();
  const gov = bootstrap?.siteGovernance ?? null;

  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [topic, setTopic] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !emailOrPhone.trim() || !message.trim()) return;
    setSubmitting(true);
    setErrorMsg(null);
    setSubmittedAppId(null);

    try {
      const digits = emailOrPhone.replace(/\D/g, '').slice(-10);
      const mobileForRecord = digits.length === 10 ? digits : emailOrPhone.trim().slice(0, 24);

      const res = await submitPublicForm({
        formType: 'contact',
        applicantName: name.trim(),
        mobile: mobileForRecord,
        district: 'Bhilwara',
        villageOrOrg: topic,
        details: message.trim(),
        customFields: {
          inquiryTopic: topic,
          contactChannel: emailOrPhone.trim(),
        },
        consentAccepted: true,
      });

      setSubmittedAppId(res.submission.applicationId);
      setName('');
      setEmailOrPhone('');
      setMessage('');
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg(
          lang === 'hi'
            ? 'संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
            : 'Unable to submit your inquiry right now. Please try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const confirmedAddress =
    gov?.officeConfirmedForPublic
      ? lang === 'hi'
        ? gov.headOfficeAddressHi || gov.headOfficeAddressEn
        : gov.headOfficeAddressEn || gov.headOfficeAddressHi
      : '';
  const confirmedPhone = gov?.officeConfirmedForPublic ? gov.officialPhone?.trim() : '';

  return (
    <div className="bg-white">
      <ScenicPageHeader
        kicker={lang === 'hi' ? 'संपर्क एवं सहायता' : 'Contact Us'}
        title={lang === 'hi' ? 'GOVEDA संपर्क एवं जिला समन्वय' : 'Head Office, District Desks & Inquiries'}
        iconName="Recycle"
        variant="water"
        assetKey="waterJohadKund"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-[#1B5A32]/15 bg-[#F4F8F3] p-6 space-y-3">
              <h2 className="text-lg font-bold text-[#144527]">
                {BRAND_INFO.fullName}
              </h2>
              <p className="text-xs text-[#44544A]">{BRAND_INFO.entityType[lang]}</p>

              <div className="pt-2 space-y-2.5 text-sm text-[#1E2923]">
                <a
                  href={`mailto:${BRAND_INFO.email}`}
                  className="flex items-center gap-2.5 font-medium text-[#144527] hover:underline"
                >
                  <Mail className="w-4 h-4 text-[#368737]" />
                  <span>{BRAND_INFO.email}</span>
                </a>
                {confirmedPhone && (
                  <a
                    href={`tel:${confirmedPhone}`}
                    className="flex items-center gap-2.5 font-medium text-[#144527] hover:underline"
                  >
                    <Phone className="w-4 h-4 text-[#368737]" />
                    <span>{confirmedPhone}</span>
                  </a>
                )}
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#2A3A30]">
                  <MapPin className="w-4 h-4 text-[#368737] shrink-0 mt-0.5" />
                  <span>
                    {confirmedAddress
                      ? confirmedAddress
                      : lang === 'hi'
                      ? 'प्रथम चरण जिला केंद्र: भीलवाड़ा, चूरू, बीकानेर, फलोदी एवं जोधपुर (राजस्थान)। पूर्ण कार्यालय पता व दूरभाष अंतिम प्रशासनिक पुष्टि के उपरांत प्रकाशित।'
                      : 'Phase I District Hubs: Bhilwara, Churu, Bikaner, Phalodi & Jodhpur (Rajasthan). Authorised office address & phone numbers published upon final verification.'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1B5A32]/15 bg-white p-5 space-y-2 text-xs text-[#44544A]">
              <p className="font-bold text-[#144527]">
                {lang === 'hi' ? 'संपर्क श्रेणियाँ' : 'Available Support Desks'}
              </p>
              <p>
                Head Office Contact · Registered Office Information · District Contact · General Inquiry · Partnership Inquiry · Media Inquiry · Feedback &amp; Grievance
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-[#1B5A32]/15 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#144527] mb-4">
              {lang === 'hi' ? 'संदेश / पूछताछ भेजें' : 'Send an Inquiry or Feedback'}
            </h2>

            {submittedAppId && (
              <div
                role="status"
                className="mb-4 p-4 rounded-xl bg-[#E8F2E6] border border-[#368737]/30 text-xs sm:text-sm text-[#144527] flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-5 h-5 text-[#1B5A32] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p>
                    {lang === 'hi'
                      ? 'आपका संदेश सुरक्षित रूप से दर्ज हो गया है। संबंधित डेस्क शीघ्र ही आपसे संपर्क करेगा।'
                      : 'Your inquiry has been recorded securely. Our outreach desk will respond via official channels.'}
                  </p>
                  <p className="text-xs">
                    {lang === 'hi' ? 'संदर्भ संख्या:' : 'Reference ID:'}{' '}
                    <strong className="font-mono text-[#103820] select-all">
                      {submittedAppId}
                    </strong>
                  </p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900"
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-name" className="block text-xs font-semibold text-[#144527] mb-1">
                    {lang === 'hi' ? 'नाम *' : 'Name *'}
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#1B5A32]/25 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#368737]"
                  />
                </div>
                <div>
                  <label htmlFor="c-contact" className="block text-xs font-semibold text-[#144527] mb-1">
                    {lang === 'hi' ? 'ईमेल या मोबाइल *' : 'Email or Mobile *'}
                  </label>
                  <input
                    id="c-contact"
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#1B5A32]/25 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#368737]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="c-topic" className="block text-xs font-semibold text-[#144527] mb-1">
                  {lang === 'hi' ? 'विषय श्रेणी' : 'Inquiry Type'}
                </label>
                <select
                  id="c-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-xl border border-[#1B5A32]/25 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#368737]"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="District Outreach">District Outreach (Bhilwara/Churu/Bikaner/Phalodi/Jodhpur)</option>
                  <option value="Partnership Inquiry">Partnership / CSR Inquiry</option>
                  <option value="Media & Magazine">Media &amp; Harit Bharat Samvad Magazine</option>
                  <option value="Feedback & Grievance">Feedback &amp; Grievance</option>
                </select>
              </div>

              <div>
                <label htmlFor="c-msg" className="block text-xs font-semibold text-[#144527] mb-1">
                  {lang === 'hi' ? 'संदेश *' : 'Message *'}
                </label>
                <textarea
                  id="c-msg"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-[#1B5A32]/25 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#368737]"
                />
              </div>

              <SpringButton type="submit" variant="primary" size="md" disabled={submitting}>
                <span>
                  {submitting
                    ? lang === 'hi'
                      ? 'भेजा जा रहा है...'
                      : 'Submitting...'
                    : lang === 'hi'
                    ? 'संदेश भेजें'
                    : 'Submit Inquiry'}
                </span>
              </SpringButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
