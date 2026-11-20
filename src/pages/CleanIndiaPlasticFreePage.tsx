import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BatteryCharging,
  Box,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  FlaskConical,
  Flower2,
  Handshake,
  HeartHandshake,
  Landmark,
  Leaf,
  Lightbulb,
  MapPin,
  Megaphone,
  Package,
  PackageCheck,
  Pill,
  Recycle,
  School,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  Store,
  Trash2,
  Users,
  Utensils,
} from 'lucide-react';
import {
  InteractiveProcessDiagram,
  type DiagramFlowPath,
  type DiagramHotspot,
} from '../components/CleanEnergyInteractiveDiagrams';
import { EditorialSectionHeader, EditorialSafeguardCallout } from '../components/MissionEditorialShell';
import { ResilientImage } from '../components/ResilientImage';
import { usePublicPortal } from '../context/PublicPortalContext';
import { filterUnifiedProgrammes, summarizeWasteRecords } from '../utils/adminLogic';
import type { Language, RegistrationRecord } from '../types/goveda';

interface CleanIndiaPlasticFreePageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

/* ============================================================================
   SECTION 05 — INTERACTIVE 4-CATEGORY 3D ISOMETRIC WASTE SEGREGATION STATION
   Built as crisp architectural 3D dimensional containers with selectable callouts
   ============================================================================ */

interface WasteSpecimenItem {
  hi: string;
  en: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface WasteFlowStep {
  hi: string;
  en: string;
  stageHi: string;
  stageEn: string;
}

interface WasteStreamSpec {
  id: 'wet' | 'dry' | 'sanitary' | 'special';
  code: string;
  hiTitle: string;
  enTitle: string;
  hiShort: string;
  enShort: string;
  color: string;
  badgeBg: string;
  pinLeftPct: number;
  pinTopPct: number;
  specimens: WasteSpecimenItem[];
  flowSteps: WasteFlowStep[];
  hiGuardrail: string;
  enGuardrail: string;
}

const WASTE_STREAMS: WasteStreamSpec[] = [
  {
    id: 'wet',
    code: '01',
    hiTitle: 'गीला कचरा (जैविक)',
    enTitle: 'Wet Waste (Biodegradable)',
    hiShort: 'गीला कचरा',
    enShort: 'Wet Waste',
    color: '#17834D',
    badgeBg: '#EEF7F1',
    pinLeftPct: 17.5,
    pinTopPct: 67,
    specimens: [
      { hi: 'बचा हुआ भोजन', en: 'Food leftovers', icon: Utensils },
      { hi: 'फल व सब्ज़ी के छिलके', en: 'Fruit & veg peels', icon: Leaf },
      { hi: 'मंदिर/पूजा के फूल', en: 'Floral offerings', icon: Flower2 },
      { hi: 'जैविक-अपघटनीय सामग्री', en: 'Garden organics', icon: Sprout },
    ],
    flowSteps: [
      { stageHi: 'स्रोत', stageEn: 'Source', hi: 'हरा गीला डस्टबिन', en: 'Green Wet Bin' },
      { stageHi: 'प्रक्रिया', stageEn: 'Process', hi: 'वैज्ञानिक कम्पोस्टिंग / बायोगैस', en: 'Composting / Biogas' },
      { stageHi: 'उपयोग', stageEn: 'Outcome', hi: 'प्राकृतिक मिट्टी सुधारक खाद', en: 'Natural Soil Compost' },
    ],
    hiGuardrail: 'इसमें प्लास्टिक की थैली, रैपर या सैनिटरी कचरा बिल्कुल न मिलाएँ।',
    enGuardrail: 'Never mix plastic bags, wrappers, or sanitary waste into the wet organic bin.',
  },
  {
    id: 'dry',
    code: '02',
    hiTitle: 'सूखा कचरा (पुनर्चक्रण योग्य)',
    enTitle: 'Dry Waste (Recyclable)',
    hiShort: 'सूखा कचरा',
    enShort: 'Dry Waste',
    color: '#238396',
    badgeBg: '#EBF6F8',
    pinLeftPct: 40,
    pinTopPct: 67,
    specimens: [
      { hi: 'स्वच्छ प्लास्टिक बोतलें', en: 'Clean PET bottles', icon: Recycle },
      { hi: 'कागज़ और गत्ता', en: 'Paper & cardboard', icon: FileText },
      { hi: 'धातु के डिब्बे', en: 'Metal tins & cans', icon: Box },
      { hi: 'काँच की बोतल व जार', en: 'Glass bottles & jars', icon: Package },
    ],
    flowSteps: [
      { stageHi: 'स्रोत', stageEn: 'Source', hi: 'नीला सूखा डस्टबिन', en: 'Blue Dry Bin' },
      { stageHi: 'प्रक्रिया', stageEn: 'Process', hi: 'MRF छँटाई व बेलिंग', en: 'MRF Sorting & Baling' },
      { stageHi: 'उपयोग', stageEn: 'Outcome', hi: 'अधिकृत पुनर्चक्रण साझेदार', en: 'Authorised Recycling' },
    ],
    hiGuardrail: 'कचरे को सूखा और साफ रखें ताकि अधिकृत रीसाइक्लिंग में इसका पुनः उपयोग संभव हो सके।',
    enGuardrail: 'Keep dry recyclables clean and moisture-free so they remain recoverable.',
  },
  {
    id: 'sanitary',
    code: '03',
    hiTitle: 'सैनिटरी कचरा (पृथक संग्रहण)',
    enTitle: 'Sanitary Waste (Wrapped Separate)',
    hiShort: 'सैनिटरी कचरा',
    enShort: 'Sanitary Waste',
    color: '#B23E4D',
    badgeBg: '#FBF0F2',
    pinLeftPct: 62,
    pinTopPct: 67,
    specimens: [
      { hi: 'डायपर (लिपटा हुआ)', en: 'Wrapped diapers', icon: PackageCheck },
      { hi: 'सैनिटरी नैपकिन', en: 'Sanitary napkins', icon: ShieldAlert },
      { hi: 'घरेलू सैनिटरी सामग्री', en: 'Hygiene disposables', icon: ClipboardCheck },
      { hi: 'कागज़ में सीलबंद पैकेट', en: 'Sealed paper pouch', icon: Package },
    ],
    flowSteps: [
      { stageHi: 'स्रोत', stageEn: 'Source', hi: 'कागज़ में लिपटा पैकेट', en: 'Wrapped Paper Parcel' },
      { stageHi: 'प्रक्रिया', stageEn: 'Process', hi: 'पृथक निर्धारित संग्रहण', en: 'Separate Collection' },
      { stageHi: 'उपयोग', stageEn: 'Outcome', hi: 'अधिकृत सुरक्षित निस्तारण', en: 'Safe Authorised Disposal' },
    ],
    hiGuardrail: 'सैनिटरी कचरा कभी भी कम्पोस्टिंग या गीले जैविक कचरे में नहीं जाना चाहिए।',
    enGuardrail: 'Sanitary waste must NEVER enter composting pits or wet organic waste streams.',
  },
  {
    id: 'special',
    code: '04',
    hiTitle: 'विशेष देखभाल वाला कचरा',
    enTitle: 'Special-Care Waste (Hazardous)',
    hiShort: 'विशेष देखभाल',
    enShort: 'Special-Care',
    color: '#B57314',
    badgeBg: '#FCF5E5',
    pinLeftPct: 84.5,
    pinTopPct: 67,
    specimens: [
      { hi: 'पुरानी बैटरियाँ व सेल', en: 'Used batteries', icon: BatteryCharging },
      { hi: 'बल्ब व ट्यूबलाइट (CFL)', en: 'CFL / LED bulbs', icon: Lightbulb },
      { hi: 'एक्सपायर दवाइयाँ', en: 'Expired medicines', icon: Pill },
      { hi: 'रसायन व पेंट डिब्बे', en: 'Chemical / paint tins', icon: FlaskConical },
    ],
    flowSteps: [
      { stageHi: 'स्रोत', stageEn: 'Source', hi: 'सुरक्षित पृथक बॉक्स', en: 'Sealed Hazard Bin' },
      { stageHi: 'प्रक्रिया', stageEn: 'Process', hi: 'विशेष संग्रहण बिंदु', en: 'Special Drop-Off' },
      { stageHi: 'उपयोग', stageEn: 'Outcome', hi: 'अधिकृत उपचार केंद्र', en: 'Authorised Treatment' },
    ],
    hiGuardrail: 'इन्हें कभी भी सामान्य घरेलू कचरे में न मिलाएँ और न ही खुले में जलाएँ।',
    enGuardrail: 'Never mix into regular household bins and never dispose via open burning.',
  },
];

function FourStreamWasteSegregation3D({ lang }: { lang: Language }) {
  const hi = lang === 'hi';
  const [selectedId, setSelectedId] = useState<WasteStreamSpec['id']>('wet');
  const active = WASTE_STREAMS.find((s) => s.id === selectedId) ?? WASTE_STREAMS[0];

  return (
    <div className="rounded-3xl border border-[#DCE5D9] bg-white overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-[#FAF8F1] px-5 sm:px-8 pt-6 pb-4 border-b border-[#E5DEC9] flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#17834D]">
          {hi
            ? 'इंटरैक्टिव 3D कचरा पृथक्करण मॉडल · किसी भी 3D डस्टबिन पर टैप करें'
            : 'INTERACTIVE 3D SEGREGATION MODEL · TAP ANY 3D BIN TO INSPECT'}
        </p>
        <span className="text-xs font-bold text-[#76523A]">
          {hi ? '4 पूर्णतः पृथक श्रेणियाँ' : '4 Strictly Separate Streams'}
        </span>
      </div>

      {/* High-Craft 3D Studio Render Stage with Direct Clickable Bin Zones & Numbered Markers */}
      <div className="relative bg-[#FAF8F1] border-b border-[#E5DEC9] overflow-hidden select-none">
        <ResilientImage
          assetKey="ciFourBinSegregation3d"
          alt={
            hi
              ? 'चार अलग-अलग रंगों के आधुनिक 3D कचरा डस्टबिन — गीला कचरा (हरा), सूखा कचरा (नीला), सैनिटरी कचरा (गुलाबी-लाल) और विशेष देखभाल कचरा (एम्बर-ग्रे)'
              : 'Studio 3D visualization of four separate colour-coded waste segregation bins for wet organic, dry recyclable, sanitary wrapped, and special-care domestic hazardous waste'
          }
          className="w-full aspect-[16/9] object-cover block"
        />

        {/* Full-column touch zones + exact-centered markers on each 3D bin */}
        <div className="absolute inset-0 z-10">
          {WASTE_STREAMS.map((stream, idx) => {
            const isSel = stream.id === selectedId;
            return (
              <button
                key={stream.id}
                type="button"
                onClick={() => setSelectedId(stream.id)}
                aria-label={hi ? `${stream.code} ${stream.hiTitle}` : `${stream.code} ${stream.enTitle}`}
                aria-pressed={isSel}
                style={{ left: `${idx * 25}%`, width: '25%' }}
                className="absolute inset-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#123D2A] cursor-pointer group"
              />
            );
          })}

          {WASTE_STREAMS.map((stream) => {
            const isSel = stream.id === selectedId;
            return (
              <React.Fragment key={`${stream.id}-marker`}>
                {/* Crisp Interactive Numbered Medallion directly on the front face of each 3D bin */}
                <button
                  type="button"
                  onClick={() => setSelectedId(stream.id)}
                  aria-label={hi ? `${stream.code} ${stream.hiTitle}` : `${stream.code} ${stream.enTitle}`}
                  aria-pressed={isSel}
                  style={{
                    left: `${stream.pinLeftPct}%`,
                    top: `${stream.pinTopPct}%`,
                    backgroundColor: isSel ? '#123D2A' : '#FFFFFF',
                    color: isSel ? '#E9B84C' : stream.color,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full font-mono font-extrabold shadow-md transition-transform duration-200 cursor-pointer ${
                    isSel
                      ? 'w-9 h-9 sm:w-11 sm:h-11 text-xs sm:text-sm scale-110 ring-4 ring-white/95'
                      : 'w-7 h-7 sm:w-9 sm:h-9 text-[11px] sm:text-xs opacity-95 hover:scale-105 ring-2 ring-white/85'
                  }`}
                >
                  {stream.code}
                </button>

                {/* Clean Bin Title Tag centered directly beneath each 3D bin on the travertine ledge */}
                <button
                  type="button"
                  onClick={() => setSelectedId(stream.id)}
                  style={{ left: `${stream.pinLeftPct}%` }}
                  className={`absolute bottom-1.5 sm:bottom-3 -translate-x-1/2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[9.5px] sm:text-xs font-extrabold whitespace-nowrap transition-colors cursor-pointer ${
                    hi ? 'font-hindi' : ''
                  } ${
                    isSel
                      ? 'bg-[#123D2A] text-white shadow-sm'
                      : 'bg-white/92 text-[#123D2A] hover:bg-white'
                  }`}
                >
                  {hi ? stream.hiShort : stream.enShort}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Compact 4-Stream Segmented Selector + Visual Bento Breakdown (Zero Vertical Checklists) */}
      <div className="p-4 sm:p-7 space-y-5">
        {/* Clean 4-Tab Horizontal / 2x2 Switcher */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {WASTE_STREAMS.map((st) => {
            const isSel = st.id === selectedId;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedId(st.id)}
                className={`text-left rounded-2xl border p-3.5 sm:p-4 transition-colors cursor-pointer ${
                  isSel
                    ? 'bg-[#123D2A] text-white border-[#123D2A]'
                    : 'bg-[#FAF8F1] text-[#123D2A] border-[#E5DEC9] hover:border-[#17834D]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`font-mono text-xs font-extrabold tabular-nums ${
                      isSel ? 'text-[#E9B84C]' : ''
                    }`}
                    style={isSel ? undefined : { color: st.color }}
                  >
                    {st.code}
                  </span>
                  <span
                    className="h-1.5 w-8 rounded-full"
                    style={{ backgroundColor: isSel ? '#E9B84C' : st.color }}
                    aria-hidden="true"
                  />
                </div>
                <p className={`text-xs sm:text-sm font-extrabold leading-snug ${hi ? 'font-hindi' : ''}`}>
                  {hi ? st.hiTitle : st.enTitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Stream Bento Panel — Specimen Mosaic + 3-Step Visual Journey + Guardrail */}
        <div
          className="rounded-2xl border border-[#DCE5D9] p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
          style={{ backgroundColor: active.badgeBg }}
        >
          {/* Left 5 cols: 2x2 Visual Material Specimen Tiles (Not a Vertical List!) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: active.color }}>
                {hi ? `श्रेणी ${active.code} · पहचान व सामग्री` : `STREAM ${active.code} · WHAT BELONGS HERE`}
              </p>
              <h3 className={`text-lg sm:text-xl font-extrabold text-[#123D2A] mt-0.5 ${hi ? 'font-hindi' : 'font-editorial'}`}>
                {hi ? active.hiTitle : active.enTitle}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {active.specimens.map((spec) => {
                const SpecIcon = spec.icon;
                return (
                  <div
                    key={spec.en}
                    className="rounded-xl bg-white border border-[#DCE5D9] p-3 flex flex-col gap-2"
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: active.badgeBg, color: active.color }}
                    >
                      <SpecIcon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className={`text-xs font-extrabold text-[#123D2A] leading-snug ${hi ? 'font-hindi' : ''}`}>
                      {hi ? spec.hi : spec.en}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 7 cols: Visual 3-Step Horizontal Flow Track + Guardrail */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-3.5">
            <div className="rounded-2xl bg-white border border-[#DCE5D9] p-4 sm:p-5 space-y-3.5 flex-1">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#17834D]">
                {hi ? 'वैज्ञानिक निस्तारण यात्रा (3 चरण)' : 'SCIENTIFIC HANDLING FLOW (3 STAGES)'}
              </p>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 items-stretch">
                {active.flowSteps.map((step, sIdx) => (
                  <div
                    key={step.en}
                    className="relative rounded-xl bg-[#FAF8F1] border border-[#E5DEC9] p-2.5 sm:p-3.5 flex flex-col justify-between gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="text-[10px] font-mono font-extrabold tabular-nums"
                        style={{ color: active.color }}
                      >
                        0{sIdx + 1} · {hi ? step.stageHi : step.stageEn}
                      </span>
                      {sIdx < 2 && (
                        <ArrowRight className="w-3 h-3 text-[#8A6548] shrink-0" aria-hidden="true" />
                      )}
                    </div>
                    <p className={`text-[11px] sm:text-xs font-extrabold text-[#123D2A] leading-snug ${hi ? 'font-hindi' : ''}`}>
                      {hi ? step.hi : step.en}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white/90 border border-[#E5DEC9] p-4 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: active.color }} aria-hidden="true" />
              <p className={`text-xs sm:text-[13px] font-bold text-[#26352E] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                {hi ? active.hiGuardrail : active.enGuardrail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   INTERACTIVE DIAGRAM DATASETS (SECTION 06 & SECTION 07)
   ============================================================================ */

const RESOURCE_PATHWAY_HOTSPOTS: DiagramHotspot[] = [
  {
    id: 'rp-organic-in',
    number: '01',
    x: 150,
    y: 128,
    color: '#17834D',
    hiTitle: 'मार्ग A: उपयुक्त जैविक कचरा',
    enTitle: 'Path A: Suitable Organic Waste',
    hiShort: 'छिलके व फूल अलग',
    enShort: 'Peels & Flowers',
    hiInput: 'पृथक रसोई का गीला कचरा, सब्ज़ी छिलके और मंदिरों के फूल।',
    enInput: 'Segregated kitchen scraps, fruit/vegetable peels, and biodegradable floral offerings.',
    hiProcess: 'हवादार कम्पोस्टिंग यूनिट में नियंत्रित नमी और ऑक्सीजन के साथ प्राकृतिक अपघटन।',
    enProcess: 'Controlled aerobic decomposition inside structured composting units with balanced moisture.',
    hiOutput: 'पोषक तत्वों से भरपूर प्राकृतिक जैविक खाद (Organic Soil Amendment)।',
    enOutput: 'Dark, nutrient-rich organic compost soil amendment.',
    hiUse: 'उद्यानों, नर्सरी, पौधारोपण और स्थानीय कृषि भूमि की मिट्टी सुधारने में।',
    enUse: 'Enriching nurseries, saplings, kitchen gardens, and local farmland soil.',
  },
  {
    id: 'rp-compost-out',
    number: '02',
    x: 820,
    y: 134,
    color: '#17834D',
    hiTitle: 'कम्पोस्टिंग से जैविक मिट्टी सुधारक',
    enTitle: 'Finished Compost & Plant Health',
    hiShort: 'जैविक खाद निर्माण',
    enShort: 'Organic Compost',
    hiInput: 'पूर्णतः अपघटित जैविक सामग्री (बिना प्लास्टिक या काँच के)।',
    enInput: 'Fully stabilised organic matter free of plastic or hazardous contamination.',
    hiProcess: 'छनाई और गुणवत्ता जाँच के बाद उपयोग हेतु तैयार।',
    enProcess: 'Screened and cured into stable, odour-free organic compost.',
    hiOutput: 'स्थानीय स्तर पर उपयोगी मिट्टी सुधारक।',
    enOutput: 'Locally usable soil amendment.',
    hiUse: 'रासायनिक उर्वरकों पर निर्भरता घटाने और पौधों की जड़ों को पोषण देने में।',
    enUse: 'Supporting saplings and urban/rural soil restoration.',
  },
  {
    id: 'rp-dry-sort',
    number: '03',
    x: 420,
    y: 282,
    color: '#2B95A8',
    hiTitle: 'मार्ग B: सूखा पुनर्चक्रण छँटाई',
    enTitle: 'Path B: Recyclable Dry Sorting',
    hiShort: 'प्लास्टिक/कागज़/धातु',
    enShort: 'Dry Sorting Line',
    hiInput: 'साफ एवं सूखा प्लास्टिक, कागज़, गत्ता, धातु और काँच।',
    enInput: 'Clean, segregated plastic bottles, paper, cardboard, metal cans, and glass.',
    hiProcess: 'मटेरियल रिकवरी सुविधा (MRF) की छँटाई मेज पर अलग-अलग श्रेणियों में वर्गीकरण।',
    enProcess: 'Sorted cleanly by material grade along an organised recovery table.',
    hiOutput: 'संपीड़ित एवं शुद्ध पुनर्चक्रण योग्य गट्ठे (Recyclable Bales)।',
    enOutput: 'Clean, compressed recyclable material bales.',
    hiUse: 'अधिकृत रीसाइक्लिंग इकाइयों को कच्चे माल के रूप में भेजना।',
    enUse: 'Dispatched strictly to authorised recycling partners.',
  },
  {
    id: 'rp-dry-bales',
    number: '04',
    x: 860,
    y: 288,
    color: '#2B95A8',
    hiTitle: 'अधिकृत रीसाइक्लिंग हेतु तैयार बंडल्स',
    enTitle: 'Bales for Authorised Recycling',
    hiShort: 'पुनर्चक्रण बंडल',
    enShort: 'Recyclable Bales',
    hiInput: 'श्रेणीवार अलग किए गए सूखे पुनर्चक्रण पदार्थ।',
    enInput: 'Grade-separated dry recyclables.',
    hiProcess: 'हाइड्रोलिक बेलिंग से सुरक्षित भंडारण व परिवहन आसान बनता है।',
    enProcess: 'Baled for safe, efficient transport to registered recyclers.',
    hiOutput: 'लैंडफिल में जाने वाले कचरे में ठोस कमी।',
    enOutput: 'Measurable diversion away from open dumps and landfills.',
    hiUse: 'अधिकृत पुनर्चक्रण उद्योगों में नए उपयोगी उत्पाद निर्माण हेतु।',
    enUse: 'Re-entering circular industrial manufacturing via authorised channels.',
  },
  {
    id: 'rp-special-in',
    number: '05',
    x: 240,
    y: 438,
    color: '#8A6548',
    hiTitle: 'मार्ग C: सैनिटरी व विशेष देखभाल कचरा',
    enTitle: 'Path C: Sanitary & Special-Care Stream',
    hiShort: 'बैटरी/बल्ब/दवाइयाँ',
    enShort: 'Separate Safe Stream',
    hiInput: 'सीलबंद सैनिटरी पैकेट, पुरानी बैटरियाँ, बल्ब, दवाइयाँ और रसायन डिब्बे।',
    enInput: 'Wrapped sanitary waste, batteries, CFL bulbs, expired medicines, and chemical tins.',
    hiProcess: 'सामान्य कचरे से पूरी तरह अलग संग्रहण और सुरक्षित बंद कंटेनरों में परिवहन।',
    enProcess: 'Collected completely separately in sealed containers without mixing.',
    hiOutput: 'मिट्टी व भूजल को विषैले रिसाव से सुरक्षा।',
    enOutput: 'Prevention of toxic soil and groundwater contamination.',
    hiUse: 'केवल अधिकृत उपचार एवं वैज्ञानिक निस्तारण केंद्रों तक हस्तांतरण।',
    enUse: 'Routed solely to authorised treatment or disposal facilities.',
  },
  {
    id: 'rp-special-treat',
    number: '06',
    x: 610,
    y: 432,
    color: '#8A6548',
    hiTitle: 'बंद अधिकृत उपचार प्रणाली (खुले में जलाना वर्जित)',
    enTitle: 'Enclosed Authorised Treatment (No Open Burning)',
    hiShort: 'सुरक्षित अधिकृत उपचार',
    enShort: 'Authorised Treatment',
    hiInput: 'पृथक विशेष देखभाल व सैनिटरी अपशिष्ट।',
    enInput: 'Segregated special-care and sanitary waste.',
    hiProcess: 'नियंत्रित, अधिकृत और मानक-अनुरूप उपचार तकनीक — खुले में जलाना या फेंकना पूर्णतः वर्जित।',
    enProcess: 'Handled via regulated, authorised treatment protocols—never open burning or uncontrolled dumping.',
    hiOutput: 'जनस्वास्थ्य और पर्यावरण की वैज्ञानिक सुरक्षा।',
    enOutput: 'Protection of community health and local ecosystems.',
    hiUse: 'स्थानीय निकाय व अधिकृत एजेंसियों के समन्वय से सुरक्षित निस्तारण।',
    enUse: 'Managed in compliance with statutory local body and recycler norms.',
  },
];

const RESOURCE_PATHWAY_FLOWS: DiagramFlowPath[] = [
  { id: 'f-org', d: 'M 150 128 L 820 134', color: '#17834D', relatedIds: ['rp-organic-in', 'rp-compost-out'] },
  { id: 'f-dry', d: 'M 140 282 L 860 288', color: '#35AFC0', relatedIds: ['rp-dry-sort', 'rp-dry-bales'] },
  { id: 'f-spc', d: 'M 160 438 L 610 432', color: '#8A6548', relatedIds: ['rp-special-in', 'rp-special-treat'] },
];

const RESOURCE_PATHWAY_LEGEND = [
  { color: '#17834D', hi: 'मार्ग A: जैविक कम्पोस्टिंग', en: 'Path A: Organic Composting' },
  { color: '#35AFC0', hi: 'मार्ग B: सूखा पुनर्चक्रण (MRF)', en: 'Path B: Recyclable Dry (MRF)' },
  { color: '#8A6548', hi: 'मार्ग C: पृथक अधिकृत उपचार', en: 'Path C: Separate Authorised Disposal' },
];

const MRF_HOTSPOTS: DiagramHotspot[] = [
  {
    id: 'mrf-01',
    number: '01',
    x: 140,
    y: 410,
    color: '#17834D',
    hiTitle: '01 · पृथक संग्रहण (Collection)',
    enTitle: '01 · Segregated Collection',
    hiShort: 'पृथक सूखा कचरा आगमन',
    enShort: 'Collection Arrival',
    hiInput: 'घरों, बाजारों और संस्थानों से अलग किया गया सूखा पुनर्चक्रण योग्य कचरा।',
    enInput: 'Source-segregated dry waste arriving from households, markets, and campuses.',
    hiProcess: 'स्वच्छ वाहन से रिसीविंग बे पर सुरक्षित उतराई और प्रारंभिक जाँच।',
    enProcess: 'Clean unloading at the receiving bay with initial contamination screening.',
    hiOutput: 'छँटाई लाइन के लिए तैयार सूखी सामग्री।',
    enOutput: 'Dry feedstock ready for sorting.',
    hiUse: 'स्रोत पर पृथक्करण होने से रीसाइक्लिंग गुणवत्ता कई गुना बढ़ती है।',
    enUse: 'Clean source segregation directly improves material recovery quality.',
  },
  {
    id: 'mrf-02',
    number: '02',
    x: 320,
    y: 280,
    color: '#2B95A8',
    hiTitle: '02 · सुरक्षित छँटाई (Sorting)',
    enTitle: '02 · Safe Conveyor Sorting',
    hiShort: 'कन्वेयर पर सुरक्षित छँटाई',
    enShort: 'Safe Sorting',
    hiInput: 'रिसीविंग बे से कन्वेयर बेल्ट पर आने वाला मिश्रित सूखा कचरा।',
    enInput: 'Mixed dry recyclables moving steadily up the inclined sorting conveyor.',
    hiProcess: 'सुरक्षा दस्ताने, हेलमेट व जैकेट पहने प्रशिक्षित कर्मी गैर-पुनर्चक्रण वस्तुएँ अलग करते हैं।',
    enProcess: 'Workers wearing proper safety gear manually inspect and sort clean material streams.',
    hiOutput: 'शुद्ध और मानक-अनुरूप सामग्री प्रवाह।',
    enOutput: 'Clean, contaminant-free sorting flow.',
    hiUse: 'कर्मियों की सुरक्षा और स्वच्छ कार्य-वातावरण सुनिश्चित करना।',
    enUse: 'Protects sanitation workers while improving recovery efficiency.',
  },
  {
    id: 'mrf-03',
    number: '03',
    x: 500,
    y: 348,
    color: '#0F766E',
    hiTitle: '03 · सामग्री पृथक्करण (Material Separation)',
    enTitle: '03 · Multi-Stream Separation',
    hiShort: 'प्लास्टिक, कागज़, धातु, काँच',
    enShort: '4 Material Bays',
    hiInput: 'कन्वेयर से छँटकर आने वाली विविध सूखी सामग्रियाँ।',
    enInput: 'Sorted dry streams descending separate chutes.',
    hiProcess: 'प्लास्टिक, कागज़/गत्ता, धातु और काँच को चार अलग रंग-कोडित बॉक्स में विभाजित किया जाता है।',
    enProcess: 'Separated into dedicated colour-coded bays for plastic, paper, metal, and glass.',
    hiOutput: 'चार शुद्ध एकल-श्रेणी पुनर्चक्रण भंडार।',
    enOutput: 'Four pure single-material recovery stocks.',
    hiUse: 'प्रत्येक सामग्री अपने उपयुक्त रीसाइक्लिंग उद्योग तक पहुँचती है।',
    enUse: 'Each stream routes to the right specialised recycler.',
  },
  {
    id: 'mrf-04',
    number: '04',
    x: 690,
    y: 298,
    color: '#D99A1E',
    hiTitle: '04 · रीसाइक्लिंग हेतु तैयारी (Baling & Prep)',
    enTitle: '04 · Preparation & Baling',
    hiShort: 'संपीड़ित बंडल्स निर्माण',
    enShort: 'Baling Press',
    hiInput: 'श्रेणीवार पृथक प्लास्टिक, कागज़ व धातु।',
    enInput: 'Grade-wise separated recyclables.',
    hiProcess: 'बेलिंग मशीन द्वारा सामग्री को साफ, सघन गट्ठों (Bales) में संपीड़ित कर पैलेट पर रखा जाता है।',
    enProcess: 'Compressed by a hydraulic baler into tidy, stackable bales on wooden pallets.',
    hiOutput: 'परिवहन हेतु तैयार मानक बंडल्स।',
    enOutput: 'Transport-ready, weighed recyclable bales.',
    hiUse: 'भंडारण स्थान और परिवहन ईंधन दोनों की बचत।',
    enUse: 'Reduces transport trips and keeps storage orderly.',
  },
  {
    id: 'mrf-05',
    number: '05',
    x: 870,
    y: 214,
    color: '#17834D',
    hiTitle: '05 · अधिकृत रीसाइक्लिंग साझेदार',
    enTitle: '05 · Authorised Recycling Partner',
    hiShort: 'अधिकृत परिवहन व रीसाइक्लिंग',
    enShort: 'Authorised Dispatch',
    hiInput: 'सत्यापित एवं तौले गए पुनर्चक्रण बंडल्स।',
    enInput: 'Weighed and documented recyclable pallets.',
    hiProcess: 'अधिकृत एवं पंजीकृत रीसाइक्लिंग साझेदार के वाहन द्वारा सुरक्षित प्रेषण।',
    enProcess: 'Dispatched via authorised recycling partners with transparent quantity logs.',
    hiOutput: 'कचरे का जिम्मेदार पुनर्चक्रण चक्र पूर्ण।',
    enOutput: 'Responsible circular recycling completed.',
    hiUse: 'नागरिक जागरूकता हेतु प्रक्रिया समझ — GOVEDA वर्तमान में स्वयं MRF प्लांट संचालन का दावा नहीं करती।',
    enUse: 'Educational awareness diagram—GOVEDA does not claim to currently own or operate an MRF plant.',
  },
];

const MRF_FLOWS: DiagramFlowPath[] = [
  { id: 'mrf-f1', d: 'M 140 410 Q 240 340 320 280', color: '#17834D', relatedIds: ['mrf-01', 'mrf-02'] },
  { id: 'mrf-f2', d: 'M 320 280 Q 415 315 500 348', color: '#35AFC0', relatedIds: ['mrf-02', 'mrf-03'] },
  { id: 'mrf-f3', d: 'M 500 348 Q 600 318 690 298', color: '#E9B84C', relatedIds: ['mrf-03', 'mrf-04'] },
  { id: 'mrf-f4', d: 'M 690 298 Q 785 260 870 214', color: '#17834D', relatedIds: ['mrf-04', 'mrf-05'] },
];

const MRF_LEGEND = [
  { color: '#17834D', hi: 'पृथक आगमन व अधिकृत प्रेषण', en: 'Segregated Arrival & Dispatch' },
  { color: '#35AFC0', hi: 'कन्वेयर छँटाई व 4-श्रेणी पृथक्करण', en: 'Conveyor Sorting & 4-Bay Separation' },
  { color: '#E9B84C', hi: 'बेलिंग व पैलेट तैयारी', en: 'Baling & Pallet Preparation' },
];

const PLASTIC_MUKT_CARDS = [
  { icon: ShoppingBag, hi: 'पुनः उपयोग योग्य कपड़े के थैले', en: 'Reusable Cloth Bags' },
  { icon: ShoppingBag, hi: 'टिकाऊ जूट के थैले', en: 'Durable Jute Bags' },
  { icon: ClipboardCheck, hi: 'प्लास्टिक कमी संकल्प (Pledge)', en: 'Plastic Reduction Pledge' },
  { icon: Store, hi: 'जिम्मेदार बाज़ार खरीदारी', en: 'Responsible Shopping' },
  { icon: Utensils, hi: 'आयोजनों में पुनः उपयोग बर्तन', en: 'Reusable Event Utensils' },
  { icon: Sparkles, hi: 'रिफिल योग्य पानी की आदत', en: 'Refill-Friendly Water Practices' },
  { icon: School, hi: 'स्कूल एवं कॉलेज जागरूकता', en: 'School & College Awareness' },
];

const CLOTH_BAG_CARDS = [
  { icon: Users, hi: 'महिला स्वयं सहायता समूह (SHG)', en: 'Women’s Self-Help Groups' },
  { icon: ShoppingBag, hi: 'कपड़े के थैले निर्माण', en: 'Cloth Bag Production' },
  { icon: ShoppingBag, hi: 'जूट के थैले निर्माण', en: 'Jute Bag Production' },
  { icon: Recycle, hi: 'पर्यावरण-अनुकूल पुनः उपयोग उत्पाद', en: 'Reusable Eco Products' },
  { icon: Store, hi: 'स्थानीय बाज़ार सहभागिता', en: 'Local Market Participation' },
  { icon: Handshake, hi: 'संस्थागत आपूर्ति पूछताछ', en: 'Institutional Supply Enquiries' },
];

const VILLAGE_CARDS = [
  { icon: ClipboardCheck, hi: 'ग्राम स्वच्छता सर्वेक्षण', en: 'Village Cleanliness Survey' },
  { icon: Trash2, hi: '4-श्रेणी कचरा पृथक्करण जागरूकता', en: 'Waste Segregation Awareness' },
  { icon: Users, hi: 'ग्राम स्वच्छता स्वयंसेवक नेटवर्क', en: 'Village Volunteer Network' },
  { icon: School, hi: 'विद्यालयों में स्वच्छता संवाद', en: 'School Awareness Drives' },
  { icon: Leaf, hi: 'तालाब, रास्ते व सार्वजनिक स्थल स्वच्छता', en: 'Public-Space Cleanliness' },
  { icon: Handshake, hi: 'स्थानीय ग्राम पंचायत के साथ समन्वय', en: 'Gram Panchayat Coordination' },
];

const CITY_CARDS = [
  { icon: Store, hi: 'बाज़ारों व दुकानदारों का पृथक्करण प्रशिक्षण', en: 'Shopkeeper Source-Segregation Guidance' },
  { icon: Utensils, hi: 'होटल व रेस्टोरेंट जैविक कचरा प्रबंधन', en: 'Hotel & Restaurant Organic Waste' },
  { icon: ShoppingBag, hi: 'सब्जी मंडी में थैला व गीला कचरा जागरूकता', en: 'Vegetable Mandi Waste Awareness' },
  { icon: Users, hi: 'नागरिक व वार्ड स्वयंसेवक संवाद', en: 'Citizen & Volunteer Ward Outreach' },
  { icon: Recycle, hi: 'अधिकृत प्लास्टिक संग्रहण एजेंसियों से सहयोग', en: 'Authorised Plastic Collection Linkage' },
  { icon: Building2, hi: 'नगर निकायों व अधिकृत संस्थाओं के साथ समन्वय', en: 'Municipal & Statutory Body Coordination' },
];

const PARTICIPATION_CARDS = [
  {
    icon: Recycle,
    hi: 'स्वच्छ भारत मिशन से जुड़ें',
    en: 'Join Clean India Mission',
    descHi: 'नागरिक या परिवार के रूप में स्वच्छता पहल का हिस्सा बनें।',
    descEn: 'Participate as a citizen or household in local awareness.',
    route: '/join/volunteer?campaign=CLEAN-INDIA-MISSION',
  },
  {
    icon: MapPin,
    hi: 'अपना गाँव पंजीकृत करें',
    en: 'Register Your Village',
    descHi: 'ग्राम पंचायत या ग्रामीण समूह के रूप में स्वच्छ ग्राम पहल हेतु अनुरोध।',
    descEn: 'Request Clean Village awareness for your Gram Panchayat.',
    route: '/join/ngo-institution?campaign=CLEAN-VILLAGE-REG',
  },
  {
    icon: School,
    hi: 'अपना विद्यालय पंजीकृत करें',
    en: 'Register Your School',
    descHi: 'छात्रों के लिए स्वच्छता व प्लास्टिक-मुक्ति सत्र आयोजित कराएँ।',
    descEn: 'Host student waste-segregation and plastic awareness sessions.',
    route: '/join/school-college?campaign=CLEAN-INDIA-SCHOOL',
  },
  {
    icon: Store,
    hi: 'व्यापार / बाज़ार संघ पंजीकरण',
    en: 'Register Market Association',
    descHi: 'अपने बाज़ार को पुनः उपयोग थैला-अनुकूल और स्वच्छ बनाएँ।',
    descEn: 'Partner to transition local shops toward reusable bags.',
    route: '/join/ngo-institution?campaign=MARKET-ASSOCIATION',
  },
  {
    icon: HeartHandshake,
    hi: 'स्वयंसेवक पंजीकरण',
    en: 'Volunteer Registration',
    descHi: 'युवा, कॉलेज विद्यार्थी और जागरूक नागरिक स्वयंसेवक बनें।',
    descEn: 'Join local waste-awareness and segregation volunteer circles.',
    route: '/join/volunteer?campaign=CLEAN-INDIA-VOLUNTEER',
  },
  {
    icon: ClipboardCheck,
    hi: 'प्लास्टिक कमी संकल्प लें',
    en: 'Plastic Reduction Pledge',
    descHi: 'अनावश्यक सिंगल-यूज़ प्लास्टिक कम करने का स्वैच्छिक संकल्प।',
    descEn: 'Take a voluntary pledge to carry reusable bags & bottles.',
    route: '/join/volunteer?campaign=PLASTIC-REDUCTION-PLEDGE',
  },
  {
    icon: Megaphone,
    hi: 'जागरूकता कार्यक्रम का अनुरोध',
    en: 'Request an Awareness Programme',
    descHi: 'मंदिर, कॉलोनी, संस्था या वार्ड में कार्यशाला हेतु आवेदन।',
    descEn: 'Invite a structured waste-awareness workshop to your community.',
    route: '/join/ngo-institution?campaign=AWARENESS-PROGRAMME-REQ',
  },
];

const PROGRESS_INDICATOR_FRAMEWORK = [
  { hi: 'सक्रिय रूप से जुड़े गाँव और शहरी वार्ड', en: 'Villages & wards participating steadily' },
  { hi: 'कचरा पृथक्करण में प्रशिक्षित परिवार', en: 'Families trained in 4-stream segregation' },
  { hi: 'सहभागी विद्यालय एवं कॉलेज', en: 'Participating schools & colleges' },
  { hi: 'सहभागी बाज़ार व व्यापार संघ', en: 'Participating market associations' },
  { hi: 'श्रेणीवार एकत्रित कचरे की सत्यापित मात्रा', en: 'Verified waste collected by category' },
  { hi: 'अधिकृत रीसाइक्लिंग को भेजी गई सामग्री', en: 'Materials transferred to authorised recycling' },
  { hi: 'वैज्ञानिक रूप से प्रसंस्कृत जैविक कचरा', en: 'Organic waste scientifically composted' },
  { hi: 'बेसलाइन व फॉलो-अप से घटे डंपिंग स्थल', en: 'Repeat dumping spots reduced (baseline + follow-up)' },
];

const FAQS = [
  {
    qHi: 'क्या हर कपड़े या जूट का थैला अपने आप प्लास्टिक से बेहतर होता है?',
    qEn: 'Does every cloth or jute bag automatically have a lower environmental impact than plastic?',
    aHi: 'नहीं — वैज्ञानिक रूप से कपड़े या जूट के थैले का पर्यावरणीय लाभ तभी सार्थक होता है जब आप उसी थैले का बार-बार लंबे समय तक पुनः उपयोग करें। इसका वास्तविक प्रभाव उत्पादन, उपयोग की संख्या और अंत में निस्तारण पर निर्भर करता है।',
    aEn: 'Not automatically. A cloth or jute bag reduces overall environmental impact only when reused repeatedly over time; its footprint depends on production, number of reuses, and end-of-life disposal.',
  },
  {
    qHi: 'क्या GOVEDA नगर पालिका या ग्राम पंचायत की जगह कचरा संग्रहण करती है?',
    qEn: 'Does GOVEDA replace municipal or Gram Panchayat waste collection systems?',
    aHi: 'नहीं। वैधानिक कचरा संग्रहण, परिवहन और निस्तारण की जिम्मेदारी संबंधित नगर निकायों, ग्राम पंचायतों और अधिकृत एजेंसियों की ही रहती है। GOVEDA नागरिक जागरूकता, स्रोत-पृथक्करण प्रशिक्षण, SHG थैला विकल्प और संस्थागत समन्वय में सहयोग करती है।',
    aEn: 'No. Statutory municipal and Gram Panchayat waste collection and disposal responsibilities remain strictly with the relevant local bodies and authorised agencies. GOVEDA supports citizen awareness, segregation training, reusable alternatives, and coordination.',
  },
  {
    qHi: 'स्वच्छता प्रगति के आँकड़े वेबसाइट पर कब और कैसे दिखाए जाते हैं?',
    qEn: 'When and how are cleanliness progress numbers published on this page?',
    aHi: 'हम किसी एक दिन के सफाई अभियान की तस्वीर को स्थायी स्वच्छता का प्रमाण नहीं मानते और न ही अनुमानित आँकड़े गढ़ते हैं। प्रगति आँकड़े केवल ज़मीनी सत्यापन, श्रेणीवार तौल और समीक्षा के बाद ही प्रकाशित किए जाते हैं।',
    aEn: 'We never treat a one-day clean-up photograph as proof of permanent cleanliness and never publish invented numbers. Metrics appear only after field review, weighment, and formal verification.',
  },
];

export function CleanIndiaPlasticFreePage({ lang, onNavigate }: CleanIndiaPlasticFreePageProps) {
  const hi = lang === 'hi';
  const { bootstrap } = usePublicPortal();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Section 12 — Live published CMS programmes linked to clean-india
  const { projects, campaigns, events } = useMemo(() => {
    const allPublished = filterUnifiedProgrammes(bootstrap?.programmes ?? [], {
      missionSlug: 'clean-india',
      onlyPublished: true,
    });
    return {
      projects: allPublished.filter((p) => p.type === 'project'),
      campaigns: allPublished.filter((p) => p.type === 'campaign'),
      events: allPublished.filter((p) => p.type === 'event'),
    };
  }, [bootstrap?.programmes]);

  const hasAnyProgrammes = projects.length > 0 || campaigns.length > 0 || events.length > 0;

  // Section 13 — Live verified waste progress (strictly zero invented data)
  const verifiedWasteRecords = bootstrap?.wasteRecords ?? [];
  const verifiedWastePartners = bootstrap?.wastePartners ?? [];
  const wasteSummary = useMemo(() => summarizeWasteRecords(verifiedWasteRecords), [verifiedWasteRecords]);
  const hasVerifiedProgress = verifiedWasteRecords.length > 0 || verifiedWastePartners.length > 0;

  const categoryTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (const rec of verifiedWasteRecords) {
      const key = rec.category || 'Other';
      map.set(key, (map.get(key) ?? 0) + (Number(rec.quantity) || 0));
    }
    const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    const maxVal = Math.max(1, ...entries.map((e) => e[1]));
    return { entries, maxVal };
  }, [verifiedWasteRecords]);

  return (
    <div className="bg-[#FAF8F1] text-[#123D2A]">
      {/* ====================================================================
          SECTION 01 — CINEMATIC HERO: CLEAN AND PLASTIC-FREE INDIA
         ==================================================================== */}
      <section className="relative overflow-hidden bg-[#FAF8F1] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Editorial Typography Column */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#17834D]">
                <span className="w-7 h-px bg-[#17834D]" aria-hidden="true" />
                <span>GOVEDA ENVIRONMENTAL INITIATIVE</span>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-extrabold tracking-wide text-[#8A6548]">
                  {hi
                    ? 'स्वच्छ भारत एवं प्लास्टिक-मुक्त अभियान · Clean and Plastic-Free India'
                    : 'Clean and Plastic-Free India · स्वच्छ भारत एवं प्लास्टिक-मुक्त अभियान'}
                </p>
                <h1
                  className={`text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold text-[#123D2A] leading-[1.12] tracking-tight ${
                    hi ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {hi
                    ? 'स्वच्छ भारत, प्लास्टिक-मुक्त भविष्य'
                    : 'Clean Communities. Responsible Waste. A Better Tomorrow.'}
                </h1>
                <p className="text-sm sm:text-base font-semibold text-[#17834D]">
                  {hi
                    ? 'Clean Communities. Responsible Waste. A Better Tomorrow.'
                    : 'स्वच्छ भारत, प्लास्टिक-मुक्त भविष्य'}
                </p>
              </div>

              <p
                className={`text-sm sm:text-[15.5px] text-[#26352E] leading-relaxed ${
                  hi ? 'font-hindi' : ''
                }`}
              >
                {hi
                  ? 'गाँवों, शहरों, बाजारों, स्कूलों और सार्वजनिक स्थानों में स्वच्छता जागरूकता, प्लास्टिक के अनावश्यक उपयोग में कमी और वैज्ञानिक कचरा प्रबंधन को बढ़ावा देने की पहल।'
                  : 'An environmental initiative promoting cleanliness awareness, reduction of unnecessary single-use plastic, reusable alternatives, and scientific 4-stream waste management across villages, cities, markets, schools, and temples.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById('ci-community-participation')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-[#123D2A] hover:bg-[#17834D] text-white px-6 py-3 text-sm font-extrabold transition-colors cursor-pointer"
                >
                  <span className={hi ? 'font-hindi' : ''}>
                    {hi ? 'अभियान से जुड़ें' : 'Join the Campaign'}
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById('ci-why-matters')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-[#EDF5EC] text-[#123D2A] border border-[#C9D6C8] px-5 py-3 text-sm font-bold transition-colors cursor-pointer"
                >
                  <span className={hi ? 'font-hindi' : ''}>
                    {hi ? 'हमारी पहल जानें' : 'Explore Our Initiative'}
                  </span>
                </button>
              </div>
            </div>

            {/* Dominant 3-Environment 2.5D Hero Illustration */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl overflow-hidden border border-[#DCE5D9] bg-[#123D2A]">
                <ResilientImage
                  assetKey="ciHeroCleanIndia"
                  alt={
                    hi
                      ? 'स्वच्छ भारत एवं प्लास्टिक-मुक्त अभियान — स्वच्छ भारतीय गाँव, कपड़े के थैले वाला बाज़ार और आधुनिक रीसाइक्लिंग परिसर'
                      : 'Clean and Plastic-Free India — connected Indian village segregation, reusable cloth bag market, and civic recycling awareness'
                  }
                  className="w-full aspect-[16/9] object-cover"
                />
                <div className="bg-[#123D2A] text-white px-4 py-3 grid grid-cols-3 gap-2 text-[11px] font-semibold border-t border-white/15">
                  <button
                    type="button"
                    onClick={() => document.getElementById('ci-clean-village')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-1.5 text-left hover:text-[#E9B84C] transition-colors cursor-pointer"
                  >
                    <Leaf className="w-3.5 h-3.5 text-[#75B843] shrink-0" aria-hidden="true" />
                    <span className="truncate">{hi ? 'स्वच्छ ग्राम' : 'Clean Villages'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('ci-plastic-mukt')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-1.5 text-left hover:text-[#E9B84C] transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#E9B84C] shrink-0" aria-hidden="true" />
                    <span className="truncate">{hi ? 'प्लास्टिक-मुक्त बाज़ार' : 'Reusable Markets'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('ci-segregation')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-1.5 text-left hover:text-[#E9B84C] transition-colors cursor-pointer"
                  >
                    <Recycle className="w-3.5 h-3.5 text-[#35AFC0] shrink-0" aria-hidden="true" />
                    <span className="truncate">{hi ? 'वैज्ञानिक पृथक्करण' : '4-Stream Recycling'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 02 — WHY THIS MISSION MATTERS (CONTRAST VISUAL STORYTELLING)
         ==================================================================== */}
      <section id="ci-why-matters" className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="01"
            kickerHi="यह अभियान क्यों आवश्यक है · WHY IT MATTERS"
            kickerEn="Why This Mission Matters"
            titleHi="मिश्रित कचरे और सिंगल-यूज़ प्लास्टिक से स्वच्छ, जिम्मेदार परिवेश की ओर"
            titleEn="From Mixed Dumping & Single-Use Plastic to Responsible Community Stewardship"
            leadHi="जब गीला, सूखा, प्लास्टिक और खतरनाक कचरा एक साथ मिल जाता है, तो उपयोगी संसाधन भी बेकार होकर नालियों, मिट्टी, जलस्रोतों और पशुधन के लिए संकट बन जाते हैं। समाधान की शुरुआत हर घर और दुकान पर सही पृथक्करण से होती है।"
            leadEn="When wet, dry, plastic, and hazardous waste are dumped together, recoverable materials turn into blocked drains, degraded soil, and health hazards. Real transformation starts at the source."
            lang={lang}
          />

          <div className="rounded-3xl overflow-hidden border border-[#DCE5D9] bg-[#FAF8F1]">
            <div className="relative">
              <ResilientImage
                assetKey="ciWhyContrast"
                alt={
                  hi
                    ? 'मिश्रित कचरा और सिंगल-यूज़ प्लास्टिक बनाम स्वच्छ पृथक कचरा प्रबंधन एवं कपड़े के थैलों का तुलनात्मक दृश्य'
                    : 'Editorial contrast between poorly managed mixed plastic waste and a clean sunlit neighbourhood with segregated bins and reusable cloth bags'
                }
                className="w-full aspect-[16/9] object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5DEC9]">
              {/* Left Challenge */}
              <div className="p-6 sm:p-7 space-y-3 bg-[#F6F3EC]">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#8A6548]">
                  {hi ? 'चुनौती · बिना पृथक्करण का परिणाम' : 'THE CHALLENGE · UNMANAGED WASTE'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { hi: 'सिंगल-यूज़ प्लास्टिक', en: 'Single-use Plastic' },
                    { hi: 'मिश्रित कचरा', en: 'Mixed Waste' },
                    { hi: 'खुले में डंपिंग', en: 'Open Dumping' },
                  ].map((item) => (
                    <div
                      key={item.en}
                      className="rounded-xl bg-white border border-[#E5DEC9] px-3.5 py-2.5 text-xs font-extrabold text-[#26352E]"
                    >
                      {hi ? item.hi : item.en}
                    </div>
                  ))}
                </div>
                <p className={`text-xs sm:text-[13.5px] text-[#4C5852] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                  {hi
                    ? 'अनावश्यक प्लास्टिक थैलियाँ और मिश्रित कचरा नालियाँ जाम करता है, रीसाइक्लिंग को कठिन बनाता है और गाँवों-शहरों के सार्वजनिक स्थानों को अस्वच्छ करता है।'
                    : 'Unnecessary disposable bags and mixed litter clog drains, spoil recyclable materials, and degrade everyday neighbourhood dignity.'}
                </p>
              </div>

              {/* Right Opportunity */}
              <div className="p-6 sm:p-7 space-y-3 bg-[#F0F7F1]">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#17834D]">
                  {hi ? 'अवसर · जिम्मेदार कचरा प्रबंधन' : 'THE OPPORTUNITY · RESPONSIBLE HABITS'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { hi: 'जिम्मेदार पृथक्करण', en: 'Responsible Segregation' },
                    { hi: 'पुनः उपयोग व रीसाइक्लिंग', en: 'Reuse & Recycling' },
                    { hi: 'स्वच्छ सार्वजनिक स्थल', en: 'Cleaner Public Spaces' },
                  ].map((item) => (
                    <div
                      key={item.en}
                      className="rounded-xl bg-white border border-[#CFE2D3] px-3.5 py-2.5 text-xs font-extrabold text-[#123D2A]"
                    >
                      {hi ? item.hi : item.en}
                    </div>
                  ))}
                </div>
                <p className={`text-xs sm:text-[13.5px] text-[#2D4336] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                  {hi
                    ? 'स्रोत पर 4-श्रेणी पृथक्करण, बार-बार उपयोग होने वाले थैले और अधिकृत रीसाइक्लिंग साझेदारी से स्थायी स्वच्छता और संसाधन संरक्षण संभव होता है।'
                    : 'Four-stream source segregation, repeatedly used cloth/jute bags, and authorised recycling partners turn daily discipline into lasting cleanliness.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 03 — PLASTIC-MUKT ABHIYAN
         ==================================================================== */}
      <section id="ci-plastic-mukt" className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="rounded-3xl overflow-hidden border border-[#DCE5D9] bg-white">
                <ResilientImage
                  assetKey="ciPlasticMuktMarket"
                  alt={
                    hi
                      ? 'प्लास्टिक-मुक्त भारतीय बाज़ार — दुकानदार व ग्राहक कपड़े और जूट के थैले तथा स्टील के टिफिन-बोतल का उपयोग करते हुए'
                      : 'Vibrant Indian market embracing reusable cloth and jute carry bags, steel tiffins, refillable water bottles and volunteer outreach'
                  }
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <EditorialSectionHeader
                index="02"
                kickerHi="बाज़ार एवं दैनिक जीवन में बदलाव · PLASTIC REDUCTION"
                kickerEn="Reducing Unnecessary Single-Use Plastic"
                titleHi="प्लास्टिक-मुक्त अभियान"
                titleEn="Plastic-Mukt Abhiyan"
                leadHi="दुकानदारों, ग्राहकों, विद्यालयों और सामाजिक आयोजनों में अनावश्यक सिंगल-यूज़ प्लास्टिक के स्थान पर टिकाऊ और बार-बार उपयोग होने वाले विकल्पों को बढ़ावा देना।"
                leadEn="Inspiring shopkeepers, shoppers, schools, and public events to replace unnecessary single-use plastics with durable, repeatedly used alternatives."
                lang={lang}
              />

              {/* Editorial Callout */}
              <div className="rounded-2xl bg-[#123D2A] text-white p-5 space-y-2">
                <p className={`text-lg sm:text-xl font-extrabold text-[#E9B84C] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                  {hi ? 'छोटे बदलाव, बड़ी पर्यावरणीय जिम्मेदारी।' : 'Small Daily Shifts, Lasting Environmental Responsibility.'}
                </p>
                <p className={`text-xs text-white/85 leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                  {hi
                    ? 'वैज्ञानिक स्पष्टता: कपड़े या जूट का थैला तभी प्लास्टिक की तुलना में कम पर्यावरणीय प्रभाव डालता है जब उसे बार-बार लंबे समय तक उपयोग किया जाए। इसका वास्तविक लाभ उत्पादन, उपयोग की संख्या और निस्तारण पर निर्भर करता है।'
                    : 'Scientific Clarity: Reusable cloth or jute bags deliver meaningful environmental benefits only through repeated long-term use—their actual footprint depends on production, number of uses, and disposal.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {PLASTIC_MUKT_CARDS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.en}
                  className="rounded-2xl bg-white border border-[#E5DEC9] p-4 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-xl bg-[#EAF4E8] text-[#17834D] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#8A6548] tabular-nums">
                      0{idx + 1}
                    </span>
                  </div>
                  <span className={`text-xs sm:text-[13px] font-extrabold text-[#123D2A] leading-snug ${hi ? 'font-hindi' : ''}`}>
                    {hi ? card.hi : card.en}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 04 — THE CLOTH & JUTE BAG INITIATIVE (WOMEN SHG LIVELIHOODS)
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
              <EditorialSectionHeader
                index="03"
                kickerHi="पर्यावरण संरक्षण + महिला आजीविका · SHG ENTERPRISE"
                kickerEn="Plastic Reduction Linked to Women’s Livelihoods"
                titleHi="कपड़ा एवं जूट थैला पहल"
                titleEn="The Cloth & Jute Bag Initiative"
                leadHi="महिला स्वयं सहायता समूहों (SHG) और ग्रामीण कारीगर महिलाओं को टिकाऊ कपड़े व जूट के थैले निर्माण, पैकेजिंग और स्थानीय बाज़ारों व संस्थानों की आपूर्ति पूछताछ से जोड़ने की पहल।"
                leadEn="Connecting rural Women’s Self-Help Groups with reusable cotton and jute tote production, local market supply, and institutional procurement enquiries."
                lang={lang}
              />

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {CLOTH_BAG_CARDS.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div
                      key={c.en}
                      className="rounded-2xl bg-[#FAF8F1] border border-[#E5DEC9] p-3.5 flex flex-col gap-2"
                    >
                      <span className="w-8 h-8 rounded-lg bg-white border border-[#E5DEC9] text-[#8A6548] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <span className={`text-xs font-extrabold text-[#123D2A] leading-snug ${hi ? 'font-hindi' : ''}`}>
                        {hi ? c.hi : c.en}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('/join/women-shg?campaign=CLOTH-JUTE-PRODUCER')}
                  className="inline-flex items-center gap-2 rounded-full bg-[#123D2A] hover:bg-[#17834D] text-white px-6 py-3 text-sm font-extrabold transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#E9B84C]" aria-hidden="true" />
                  <span className={hi ? 'font-hindi' : ''}>
                    {hi ? 'कपड़ा / जूट थैला उत्पादक के रूप में पंजीकरण करें' : 'Register as a Cloth / Jute Bag Producer'}
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="rounded-3xl overflow-hidden border border-[#DCE5D9] bg-[#FAF8F1]">
                <ResilientImage
                  assetKey="ciClothJuteWorkshop"
                  alt={
                    hi
                      ? 'महिला स्वयं सहायता समूह कार्यशाला में कपड़े व जूट के थैले की कटिंग, सिलाई और स्टॉल प्रदर्शन'
                      : 'Women Self-Help Group cooperative workshop cutting jute, stitching cotton tote bags and displaying finished reusable bags'
                  }
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 05 — UNDERSTANDING WASTE SEGREGATION (4-CATEGORY 3D STATION)
         ==================================================================== */}
      <section id="ci-segregation" className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <EditorialSectionHeader
            index="04"
            kickerHi="वैज्ञानिक 4-श्रेणी पृथक्करण · SOURCE SEGREGATION"
            kickerEn="Understanding 4-Category Waste Segregation"
            titleHi="कचरा पृथक्करण को समझें — 4 स्पष्ट और पृथक श्रेणियाँ"
            titleEn="Four Separate Waste Categories — Every Material Has Its Own Safe Path"
            leadHi="घर, स्कूल, दुकान या मंदिर में कचरे को इन चार श्रेणियों में अलग रखने से ही वैज्ञानिक कम्पोस्टिंग, अधिकृत रीसाइक्लिंग और खतरनाक सामग्री का सुरक्षित निस्तारण संभव होता है।"
            leadEn="Separating waste into four distinct streams at home, school, or shop is the foundation that enables safe composting, real recycling, and hazard containment."
            lang={lang}
          />

          <FourStreamWasteSegregation3D lang={lang} />
        </div>
      </section>

      {/* ====================================================================
          SECTION 06 — FROM WASTE TO USEFUL RESOURCES (3 SEPARATE PATHWAYS)
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <EditorialSectionHeader
            index="05"
            kickerHi="कचरे से संसाधन तक · 3 SEPARATE MATERIAL PATHWAYS"
            kickerEn="From Waste to Useful Resources"
            titleHi="तीन अलग-अलग वैज्ञानिक मार्ग — हर कचरे का निस्तारण एक जैसा नहीं होता"
            titleEn="Three Distinct Scientific Pathways — Different Materials Need Different Handling"
            leadHi="नीचे दिए 3D आरेख में किसी भी क्रमांक (01–06) पर क्लिक करें और देखें कि जैविक, पुनर्चक्रण योग्य और विशेष देखभाल कचरा कैसे तीन पूर्णतः अलग मार्गों से सुरक्षित रूप से प्रबंधित होता है।"
            leadEn="Click any numbered marker (01–06) on the 3D diagram below to trace how organic, recyclable dry, and special-care waste travel along three strictly separated pathways."
            lang={lang}
          />

          <InteractiveProcessDiagram
            lang={lang}
            assetKey="ciResourcePathways3d"
            imageAltHi="तीन पृथक कचरा प्रबंधन मार्ग — ऊपर जैविक कम्पोस्टिंग, मध्य सूखा रीसाइक्लिंग बेलिंग, नीचे सुरक्षित बंद विशेष उपचार"
            imageAltEn="3D isometric diagram showing three separate pathways: organic composting, recyclable dry sorting and baling, and enclosed authorised special-care treatment"
            hotspots={RESOURCE_PATHWAY_HOTSPOTS}
            flows={RESOURCE_PATHWAY_FLOWS}
            legend={RESOURCE_PATHWAY_LEGEND}
            captionHi="चित्र 01: जैविक खाद, अधिकृत रीसाइक्लिंग और विशेष देखभाल उपचार — तीनों मार्ग पूर्णतः पृथक हैं; खुले में कचरा जलाना या सब कुछ एक उत्पाद में बदलना वैज्ञानिक रूप से गलत है।"
            captionEn="Figure 01: Organic composting, authorised dry recycling, and enclosed special-care treatment remain strictly separated—never mixed and never handled via open burning."
          />
        </div>
      </section>

      {/* ====================================================================
          SECTION 07 — RECYCLING AWARENESS & MATERIAL RECOVERY FACILITY (MRF)
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <EditorialSectionHeader
            index="06"
            kickerHi="रीसाइक्लिंग जागरूकता · MATERIAL RECOVERY FACILITY (MRF)"
            kickerEn="Recycling Awareness & Material Recovery"
            titleHi="पुनर्चक्रण योग्य कचरे की यात्रा — 01 से 05 तक स्पष्ट प्रक्रिया"
            titleEn="Inside a Modern Material Recovery Facility — From Collection to Authorised Recycler"
            leadHi="नागरिकों को यह समझने में मदद करने के लिए कि घर से अलग किया गया सूखा कचरा आगे कैसे छँटता, बंडल बनता और अधिकृत रीसाइक्लिंग तक पहुँचता है।"
            leadEn="An educational 3D isometric look at how segregated dry recyclables are sorted safely, separated by stream, baled, and dispatched to authorised recycling partners."
            lang={lang}
          />

          <InteractiveProcessDiagram
            lang={lang}
            assetKey="ciMrfIsometric"
            imageAltHi="आधुनिक मटेरियल रिकवरी सुविधा (MRF) का 3D आइसोमेट्रिक कटअवे — संग्रहण, कन्वेयर छँटाई, 4 सामग्री बॉक्स, बेलिंग और अधिकृत ट्रक"
            imageAltEn="3D isometric cutaway of a modern Material Recovery Facility showing collection arrival, conveyor sorting, 4 material bays, baling press and authorised transport"
            hotspots={MRF_HOTSPOTS}
            flows={MRF_FLOWS}
            legend={MRF_LEGEND}
            captionHi="चित्र 02: नागरिक जागरूकता आरेख (01 संग्रहण → 02 छँटाई → 03 सामग्री पृथक्करण → 04 बेलिंग → 05 अधिकृत रीसाइक्लिंग साझेदार)। यह प्रक्रिया समझाने हेतु है — GOVEDA वर्तमान में स्वयं MRF प्लांट संचालन का दावा नहीं करती।"
            captionEn="Figure 02: Educational awareness model (01 Collection → 02 Sorting → 03 Material Separation → 04 Baling → 05 Authorised Recycler). Shown for public understanding—GOVEDA does not claim to currently operate an MRF facility."
          />
        </div>
      </section>

      {/* ====================================================================
          SECTION 08 — CLEAN VILLAGE CAMPAIGN (RURAL COMPOSITION)
         ==================================================================== */}
      <section id="ci-clean-village" className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-[#DCE5D9] bg-[#FAF8F1] aspect-[4/3]">
                <ResilientImage
                  assetKey="ciHeroCleanIndia"
                  alt={
                    hi
                      ? 'स्वच्छ ग्राम अभियान — राजस्थान के गाँव की स्वच्छ गली में ग्रामीणों व स्वयंसेवक द्वारा कचरा पृथक्करण'
                      : 'Clean Village Campaign in Rajasthan showing spotless sandstone street, residents and community waste-segregation awareness'
                  }
                  className="w-full h-full object-cover"
                  objectPosition="8% 50%"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <EditorialSectionHeader
                index="07"
                kickerHi="ग्रामीण स्वच्छता एवं पंचायत समन्वय · RURAL CAMPAIGN"
                kickerEn="Clean Village Campaign"
                titleHi="स्वच्छ ग्राम अभियान"
                titleEn="Clean Village Campaign"
                leadHi="गाँव की गलियों, तालाबों, विद्यालयों और सार्वजनिक चौपालों को स्थायी रूप से स्वच्छ बनाए रखने हेतु ग्राम पंचायत, ग्रामीण परिवारों और स्थानीय युवा स्वयंसेवकों के साथ साझा प्रयास।"
                leadEn="Partnering with Gram Panchayats, village households, schools, and local youth volunteers to build lasting street, pond, and community cleanliness."
                lang={lang}
              />

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {VILLAGE_CARDS.map((vc) => {
                  const Icon = vc.icon;
                  return (
                    <div
                      key={vc.en}
                      className="rounded-2xl bg-[#FAF8F1] border border-[#E5DEC9] p-3.5 flex flex-col gap-2"
                    >
                      <span className="w-8 h-8 rounded-lg bg-[#EAF4E8] text-[#17834D] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <span className={`text-xs font-extrabold text-[#123D2A] leading-snug ${hi ? 'font-hindi' : ''}`}>
                        {hi ? vc.hi : vc.en}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 09 — CLEAN CITY CAMPAIGN (DISTINCT URBAN DARK-SLATE BAND)
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-[#1B2B25] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-6 space-y-5 order-2 lg:order-1">
              <div className="flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#35AFC0]">
                <span className="w-6 h-px bg-[#35AFC0]" aria-hidden="true" />
                <span>08 · {hi ? 'शहरी बाज़ार, वार्ड एवं निकाय समन्वय' : 'URBAN MARKETS & CIVIC COORDINATION'}</span>
              </div>
              <h2
                className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight ${
                  hi ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {hi ? 'स्वच्छ शहर अभियान' : 'Clean City Campaign'}
              </h2>
              <p className={`text-sm text-white/80 leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                {hi
                  ? 'शहरी बाज़ारों, दुकानदारों, होटल-रेस्टोरेंट, सब्जी मंडियों और कॉलोनियों में स्रोत पृथक्करण और प्लास्टिक-कमी संवाद — स्थानीय नगर निकायों और अधिकृत एजेंसियों के सहयोग से।'
                  : 'Structured urban outreach across commercial markets, hotels, restaurants, vegetable mandis, and residential wards—working respectfully alongside municipal authorities.'}
              </p>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {CITY_CARDS.map((cc) => {
                  const Icon = cc.icon;
                  return (
                    <div
                      key={cc.en}
                      className="rounded-2xl bg-white/7 border border-white/12 p-3.5 flex flex-col gap-2"
                    >
                      <Icon className="w-4 h-4 text-[#35AFC0] shrink-0" aria-hidden="true" />
                      <span className={`text-xs font-semibold text-white/95 leading-snug ${hi ? 'font-hindi' : ''}`}>
                        {hi ? cc.hi : cc.en}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl bg-white/8 border border-[#35AFC0]/30 p-4 text-xs text-white/85 leading-relaxed">
                <strong className="text-[#E9B84C]">
                  {hi ? 'वैधानिक भूमिका स्पष्टता: ' : 'Statutory Clarity: '}
                </strong>
                <span className={hi ? 'font-hindi' : ''}>
                  {hi
                    ? 'शहरों में वैधानिक कचरा संग्रहण, परिवहन एवं निस्तारण की जिम्मेदारी संबंधित नगर निगम, नगर पालिका और अधिकृत एजेंसियों की ही रहती है।'
                    : 'Statutory municipal waste collection, transport, and disposal responsibilities remain exclusively with the relevant urban local bodies and authorised agencies.'}
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="rounded-3xl overflow-hidden border border-white/15 bg-[#12201B] aspect-[4/3]">
                <ResilientImage
                  assetKey="ciWhyContrast"
                  alt={
                    hi
                      ? 'स्वच्छ भारतीय शहरी मोहल्ला — स्वच्छ सड़कें, रंग-कोडित पृथक्करण डस्टबिन और कपड़े के थैलों के साथ नागरिक'
                      : 'Clean modern Indian urban streetscape with colour-coded recycling stations, green avenue trees and citizens carrying reusable bags'
                  }
                  className="w-full h-full object-cover"
                  objectPosition="96% 50%"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 10 — TEMPLE WASTE MANAGEMENT (RESPECTFUL CULTURAL CARE)
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="rounded-3xl overflow-hidden border border-[#E5DEC9] bg-white grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ResilientImage
                assetKey="ciTempleWaste"
                alt={
                  hi
                    ? 'मंदिर परिसर स्वच्छता — श्रद्धालुओं द्वारा पुष्प अर्पण को सम्मानपूर्वक अलग टोकरी में एकत्रित करना'
                    : 'Respectful temple courtyard where devotees place marigold and rose offerings into dedicated clean floral baskets guided by volunteers'
                }
                className="w-full h-full min-h-[260px] object-cover"
              />
            </div>

            <div className="lg:col-span-5 p-6 sm:p-9 flex flex-col justify-center space-y-5">
              <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#8A6548]">
                <Landmark className="w-4 h-4 text-[#E9B84C]" aria-hidden="true" />
                <span>{hi ? '09 · पवित्र स्थलों की गरिमा एवं स्वच्छता' : '09 · SACRED SPACES & RESPECTFUL CARE'}</span>
              </div>

              <h2
                className={`text-2xl sm:text-3xl font-extrabold text-[#123D2A] leading-snug ${
                  hi ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {hi ? 'मंदिर परिसर कचरा प्रबंधन' : 'Temple Waste Management'}
              </h2>

              <p className={`text-sm text-[#394C42] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                {hi
                  ? 'धार्मिक एवं आध्यात्मिक स्थलों की पवित्रता का पूर्ण सम्मान करते हुए अर्पित फूलों और जैविक सामग्री को अन्य पैकेजिंग कचरे से अलग एकत्रित करने की विनम्र सामुदायिक व्यवस्था।'
                  : 'Honouring the sanctity of temples by placing dedicated, respectful collection baskets for floral offerings separate from dry packaging and general waste.'}
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {[
                  {
                    hi: 'पुष्प एवं जैविक अर्पण के लिए स्वच्छ व सम्मानजनक अलग टोकरी',
                    en: 'Dedicated, dignified baskets for fresh floral offerings',
                  },
                  {
                    hi: 'प्लास्टिक थैली, अगरबत्ती पैकेट व सूखे कचरे का पृथक संग्रहण',
                    en: 'Strictly separate dry bins for wrappers and packaging',
                  },
                  {
                    hi: 'मंदिर समिति व स्वयंसेवकों के सहयोग से श्रद्धालु मार्गदर्शन',
                    en: 'Polite visitor guidance coordinated with temple committees',
                  },
                  {
                    hi: 'उपयुक्त जैविक फूलों का कम्पोस्ट या प्राकृतिक उपयोग हेतु प्रबंधन',
                    en: 'Suitable biodegradable flowers routed responsibly to composting',
                  },
                ].map((pt, idx) => (
                  <div
                    key={pt.en}
                    className="rounded-2xl bg-[#FAF8F1] border border-[#E5DEC9] p-3.5 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <Flower2 className="w-4 h-4 text-[#8A6548]" aria-hidden="true" />
                      <span className="font-mono text-[10px] font-bold text-[#8A6548]">0{idx + 1}</span>
                    </div>
                    <p className={`text-[11.5px] sm:text-xs font-semibold text-[#26352E] leading-snug ${hi ? 'font-hindi' : ''}`}>
                      {hi ? pt.hi : pt.en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 11 — COMMUNITY PARTICIPATION (CONNECTED TO FORM BUILDER)
         ==================================================================== */}
      <section id="ci-community-participation" className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="10"
            kickerHi="जनभागीदारी · EVERY CITIZEN HAS A ROLE"
            kickerEn="Community Participation"
            titleHi="सामुदायिक सहभागिता — गाँव, विद्यालय, बाज़ार और नागरिक एक साथ"
            titleEn="Join as a Village, School, Market Association, Volunteer or Citizen"
            leadHi="स्थायी स्वच्छता किसी एक संस्था से नहीं, बल्कि परिवारों, विद्यार्थियों, दुकानदारों, महिला समूहों और स्थानीय निकायों के सामूहिक संकल्प से बनती है।"
            leadEn="Lasting cleanliness grows when households, schools, shopkeepers, Women’s Self-Help Groups, and youth volunteers act together."
            lang={lang}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {PARTICIPATION_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.en}
                  className="rounded-2xl bg-[#FAF8F1] border border-[#E5DEC9] p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <span className="w-10 h-10 rounded-xl bg-[#EAF4E8] text-[#17834D] flex items-center justify-center">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <h3 className={`text-base font-extrabold text-[#123D2A] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                      {hi ? card.hi : card.en}
                    </h3>
                    <p className={`text-xs text-[#394C42] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                      {hi ? card.descHi : card.descEn}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate(card.route)}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#123D2A] hover:text-[#17834D] cursor-pointer"
                  >
                    <span>{hi ? 'फॉर्म खोलें' : 'Open Form'}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 12 — DYNAMIC PROJECTS, CAMPAIGNS & EVENTS (HIDDEN WHEN EMPTY)
         ==================================================================== */}
      {hasAnyProgrammes && (
        <section className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
            <EditorialSectionHeader
              index="11"
              kickerHi="लाइव प्रकाशित कार्यक्रम · GOVEDA CMS"
              kickerEn="Live Published Programmes · Admin CMS Connected"
              titleHi="स्वच्छ भारत अभियान से जुड़ी परियोजनाएँ, अभियान और कार्यक्रम"
              titleEn="Published Projects, Campaigns & Events"
              lang={lang}
            />

            {[
              { key: 'projects', items: projects, hi: 'परियोजनाएँ (Projects)', en: 'Projects' },
              { key: 'campaigns', items: campaigns, hi: 'अभियान (Campaigns)', en: 'Campaigns' },
              { key: 'events', items: events, hi: 'आगामी कार्यक्रम (Events)', en: 'Events' },
            ]
              .filter((grp) => grp.items.length > 0)
              .map((grp) => (
                <div key={grp.key} className="space-y-4">
                  <h3 className={`text-lg font-extrabold text-[#123D2A] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                    {hi ? grp.hi : grp.en}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grp.items.map((prog) => {
                      const cover =
                        prog.media.find((m) => m.isCover && m.url) ??
                        prog.media.find((m) => m.mediaType === 'photo' && m.url);
                      const loc = prog.locations[0];
                      const locText = loc
                        ? [loc.localityName, loc.district, loc.stateName].filter(Boolean).join(', ')
                        : hi
                        ? 'राजस्थान'
                        : 'Rajasthan';
                      const formKey = prog.linkedFormTypes?.[0] || prog.linkedFormType;

                      return (
                        <article
                          key={prog.id}
                          className="rounded-2xl bg-white border border-[#E5DEC9] overflow-hidden flex flex-col justify-between"
                        >
                          <div>
                            {cover?.url && (
                              <div className="aspect-[16/9] w-full overflow-hidden bg-[#EAE4D3]">
                                <img
                                  src={cover.url}
                                  alt={cover.altText || (hi ? prog.titleHi || prog.titleEn : prog.titleEn)}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="p-5 space-y-2.5">
                              <div className="flex items-center gap-2 text-xs font-bold text-[#17834D]">
                                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                <span>{locText}</span>
                                <span aria-hidden="true">·</span>
                                <span className="text-[#8A6548]">{prog.operationalStatus}</span>
                              </div>
                              <h4 className={`text-base font-extrabold text-[#123D2A] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                                {hi ? prog.titleHi || prog.titleEn : prog.titleEn}
                              </h4>
                              <p className={`text-xs sm:text-sm text-[#394C42] leading-relaxed line-clamp-3 ${hi ? 'font-hindi' : ''}`}>
                                {hi ? prog.summaryHi || prog.summaryEn : prog.summaryEn}
                              </p>
                              {prog.startDate && (
                                <p className="inline-flex items-center gap-1.5 text-xs text-[#5A6C61]">
                                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>{prog.startDate}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="px-5 pb-5 pt-2 flex flex-wrap items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => onNavigate(`/projects?code=${encodeURIComponent(prog.programmeCode)}`)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F1] hover:bg-[#EDF4EA] text-[#123D2A] border border-[#D8D1BD] px-4 py-2 text-xs font-extrabold transition-colors cursor-pointer"
                            >
                              <span>{hi ? 'विवरण देखें' : 'View Details'}</span>
                              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            {formKey && (
                              <button
                                type="button"
                                onClick={() =>
                                  onNavigate(
                                    `/join/${encodeURIComponent(formKey)}?campaign=${encodeURIComponent(
                                      prog.programmeCode
                                    )}&campaignTitle=${encodeURIComponent(prog.titleEn)}`
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-full bg-[#123D2A] hover:bg-[#17834D] text-white px-4 py-2 text-xs font-extrabold transition-colors cursor-pointer"
                              >
                                <span>{hi ? 'पंजीकरण करें' : 'Register'}</span>
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* ====================================================================
          SECTION 13 — VERIFIED ENVIRONMENTAL PROGRESS (ZERO INVENTED DATA)
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <EditorialSectionHeader
            index={hasAnyProgrammes ? '12' : '11'}
            kickerHi="सत्यापित डेटा एवं पारदर्शिता · VERIFIED METRICS ONLY"
            kickerEn="Verified Environmental Progress"
            titleHi="सत्यापित पर्यावरणीय प्रगति"
            titleEn="Verified Environmental Progress"
            leadHi="एक दिन के सफाई अभियान की तस्वीर स्थायी स्वच्छता का प्रमाण नहीं है। आँकड़े केवल ज़मीनी समीक्षा, श्रेणीवार तौल और सत्यापन के बाद ही यहाँ प्रकाशित किए जाते हैं।"
            leadEn="A one-day clean-up photo is never treated as proof of long-term cleanliness. Figures are published here strictly after field review and verification."
            lang={lang}
          />

          {hasVerifiedProgress ? (
            <div className="space-y-6">
              {/* Verified KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-[#FAF8F1] border border-[#DCE5D9] p-5">
                  <p className="text-xs font-bold text-[#5A6C61]">
                    {hi ? 'सत्यापित कचरा प्रबंधन' : 'Verified Waste Handled'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] mt-1 tabular-nums">
                    {wasteSummary.verifiedTotalKg.toLocaleString('en-IN')} kg
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FAF8F1] border border-[#DCE5D9] p-5">
                  <p className="text-xs font-bold text-[#5A6C61]">
                    {hi ? 'सत्यापित क्षेत्रीय अभियान' : 'Verified Field Drives'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#17834D] mt-1 tabular-nums">
                    {wasteSummary.verifiedRecordsCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FAF8F1] border border-[#DCE5D9] p-5">
                  <p className="text-xs font-bold text-[#5A6C61]">
                    {hi ? 'प्रशिक्षित परिवार व दुकानें' : 'Households & Shops Reached'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] mt-1 tabular-nums">
                    {wasteSummary.verifiedHouseholds.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FAF8F1] border border-[#DCE5D9] p-5">
                  <p className="text-xs font-bold text-[#5A6C61]">
                    {hi ? 'अधिकृत साझेदार इकाइयाँ' : 'Authorised Partners'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#2B95A8] mt-1 tabular-nums">
                    {verifiedWastePartners.length}
                  </p>
                </div>
              </div>

              {/* Category-Wise Bar Visualization */}
              {categoryTotals.entries.length > 0 && (
                <div className="rounded-2xl bg-[#FAF8F1] border border-[#E5DEC9] p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#123D2A]">
                    <BarChart3 className="w-4 h-4 text-[#17834D]" aria-hidden="true" />
                    <span>{hi ? 'श्रेणीवार सत्यापित मात्रा विवरण' : 'Verified Volume by Waste Category'}</span>
                  </div>
                  <div className="space-y-3">
                    {categoryTotals.entries.map(([cat, qty]) => {
                      const pct = Math.max(8, Math.round((qty / categoryTotals.maxVal) * 100));
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-[#26352E]">
                            <span>{cat}</span>
                            <span className="font-mono tabular-nums text-[#123D2A]">{qty.toLocaleString('en-IN')} kg</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-[#E5DEC9] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#17834D]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl bg-[#FAF8F1] border border-[#DCE5D9] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-[#E5DEC9] pb-5">
                <span className="w-12 h-12 rounded-2xl bg-[#EAF4E8] text-[#17834D] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" aria-hidden="true" />
                </span>
                <div className="space-y-1">
                  <p className={`text-base sm:text-lg font-extrabold text-[#123D2A] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                    {hi
                      ? 'गतिविधियाँ लागू और प्रमाणित होने के बाद सत्यापित प्रगति विवरण यहाँ प्रकाशित किया जाएगा।'
                      : 'Verified progress information will be published as activities are implemented and documented.'}
                  </p>
                  <p className="text-xs text-[#5A6C61]">
                    {hi
                      ? 'Verified progress information will be published as activities are implemented and documented.'
                      : 'हम कोई भी अनुमानित या असत्यापित स्वच्छता आँकड़ा प्रदर्शित नहीं करते।'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#8A6548]">
                  {hi ? 'सत्यापन के बाद प्रकाशित किए जाने वाले मापनीय संकेतक' : 'MEASURABLE INDICATORS TRACKED ONCE VERIFIED'}
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                  {PROGRESS_INDICATOR_FRAMEWORK.map((ind, idx) => (
                    <div
                      key={ind.en}
                      className="rounded-2xl bg-white border border-[#E5DEC9] p-3.5 flex flex-col justify-between gap-2"
                    >
                      <span className="font-mono text-[11px] font-extrabold text-[#17834D] tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-xs font-bold text-[#26352E] leading-snug ${hi ? 'font-hindi' : ''}`}>
                        {hi ? ind.hi : ind.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <EditorialSafeguardCallout
            lang={lang}
            titleHi="चरण 1 (Phase 1) सूचनात्मक दायरा एवं प्रामाणिकता नीति"
            titleEn="Phase 1 Scope & Environmental Integrity Commitment"
            bodyHi="यह मॉड्यूल नागरिक जागरूकता, 4-श्रेणी कचरा पृथक्करण शिक्षा, सामुदायिक पंजीकरण और सत्यापित प्रगति प्रकाशन हेतु है। यह किसी नगर निगम कचरा-प्रबंधन ERP, लाइव GPS वाहन ट्रैकिंग या स्मार्ट-बिन IoT का दावा नहीं करता।"
            bodyEn="This Phase 1 module provides public education, 4-stream segregation guidance, community participation forms, and verified progress reporting—without claiming GPS waste routing, IoT smart-bins, or municipal ERP operations."
          />
        </div>
      </section>

      {/* ====================================================================
          FAQs
         ==================================================================== */}
      <section className="py-14 bg-[#FAF8F1] border-b border-[#E5DEC9]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
          <EditorialSectionHeader
            index={hasAnyProgrammes ? '13' : '12'}
            kickerHi="स्पष्ट प्रश्नोत्तर · FAQS"
            kickerEn="Frequently Asked Questions"
            titleHi="स्वच्छ भारत एवं प्लास्टिक-मुक्त अभियान से जुड़े प्रश्न"
            titleEn="Key Questions on Segregation, Reusable Bags & Verification"
            lang={lang}
          />
          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.qEn} className="rounded-2xl border border-[#E5DEC9] bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm sm:text-[15px] text-[#123D2A] cursor-pointer"
                  >
                    <span className={hi ? 'font-hindi' : ''}>{hi ? faq.qHi : faq.qEn}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div
                      className={`px-5 pb-4 pt-2 border-t border-[#E5DEC9] text-xs sm:text-sm text-[#394C42] leading-relaxed ${
                        hi ? 'font-hindi' : ''
                      }`}
                    >
                      {hi ? faq.aHi : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 14 — JOIN THE CLEAN AND PLASTIC-FREE INDIA MISSION
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-[#123D2A] text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#E9B84C]">
                <Recycle className="w-4 h-4" aria-hidden="true" />
                <span>{hi ? 'स्वच्छ भारत एवं प्लास्टिक-मुक्त अभियान' : 'CLEAN AND PLASTIC-FREE INDIA'}</span>
              </div>

              <h2
                className={`text-3xl sm:text-4xl font-extrabold text-white leading-tight ${
                  hi ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {hi ? 'स्वच्छता की शुरुआत, हमारी भागीदारी से।' : 'Be Part of a Cleaner, More Responsible India.'}
              </h2>

              <p className="text-sm sm:text-base font-semibold text-[#E9B84C]">
                {hi
                  ? 'Be Part of a Cleaner, More Responsible India.'
                  : 'स्वच्छता की शुरुआत, हमारी भागीदारी से।'}
              </p>

              <p className={`text-sm text-white/80 leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                {hi
                  ? 'आज ही स्वयंसेवक, विद्यालय, ग्राम पंचायत, बाज़ार संघ या महिला स्वयं सहायता समूह के रूप में जुड़कर स्वच्छ और प्लास्टिक-मुक्त भारत की सार्थक शुरुआत करें।'
                  : 'Connect through GOVEDA’s official registration forms as a citizen, volunteer, school, Gram Panchayat, market association, or Women’s SHG producer.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/join/volunteer?campaign=CLEAN-INDIA-MISSION')}
                  className="inline-flex items-center gap-2 rounded-full bg-[#E9B84C] hover:bg-[#F3C867] text-[#123D2A] px-6 py-3 text-sm font-extrabold transition-colors cursor-pointer"
                >
                  <span className={hi ? 'font-hindi' : ''}>
                    {hi ? 'अभियान से जुड़ें' : 'Join the Mission'}
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/join/volunteer?campaign=CLEAN-INDIA-VOLUNTEER')}
                  className="inline-flex items-center gap-2 rounded-full bg-white/12 hover:bg-white/20 border border-white/25 text-white px-5 py-3 text-sm font-bold transition-colors cursor-pointer"
                >
                  <span className={hi ? 'font-hindi' : ''}>
                    {hi ? 'स्वयंसेवक बनें' : 'Become a Volunteer'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/join/ngo-institution?campaign=CLEAN-INDIA-INSTITUTION')}
                  className="inline-flex items-center gap-2 rounded-full bg-white/8 hover:bg-white/15 border border-white/15 text-white/95 px-5 py-3 text-sm font-bold transition-colors cursor-pointer"
                >
                  <span className={hi ? 'font-hindi' : ''}>
                    {hi ? 'संस्थान पंजीकृत करें' : 'Register Your Institution'}
                  </span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-white/15 bg-[#0E2E20] aspect-[16/10]">
                <ResilientImage
                  assetKey="ciHeroCleanIndia"
                  alt={
                    hi
                      ? 'स्वच्छ भारत सामुदायिक सहभागिता — विद्यार्थी, नागरिक, दुकानदार और स्वयंसेवक स्वच्छता अभियान में'
                      : 'Community members, students, shopkeepers and volunteers collaborating in a spotless Indian civic plaza'
                  }
                  className="w-full h-full object-cover"
                  objectPosition="94% 50%"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
