import React from 'react';
import type { Language } from '../types/goveda';

/* ============================================================================
   LARGE MODERN EXPLANATORY SVG ILLUSTRATIONS — PART B
   1. WomenShgEnterpriseSvg        — SHG Collective Value Chain & Skill vs Women Distinction
   2. HaritPlantationLifecycleSvg  — 10-Step Scientific Plantation Lifecycle + Grassland Guardrail
   3. HaritHeatCarbonNetworkSvg    — Harit Mitra Hub, Heat Resilience & Carbon Eligibility Gate
   4. HeritageWaterCutawaySvg      — Shekhawati Haveli, Rooftop Rainwater & Baori Aquifer Cutaway
   5. WaterEightFactorBlueprintSvg — 8-Factor Scientific Water Methodology Blueprint
   6. SkillPathwayIllustrationSvg  — Youth & Women Vocational, Language & Green Skills Pathway
   ============================================================================ */

export function WomenShgEnterpriseSvg({ lang }: { lang: Language }) {
  const hi = lang === 'hi';
  return (
    <svg
      viewBox="0 0 1120 480"
      className="w-full h-auto block"
      role="img"
      aria-label={
        hi
          ? 'महिला स्वयं सहायता समूह उद्यमिता मूल्य श्रृंखला एवं कौशल विकास मिशन से स्पष्ट अंतर'
          : 'Women Self-Help Group collective enterprise pathway and clear distinction from Skill Development Mission'
      }
    >
      <rect x="0" y="0" width="1120" height="480" rx="22" fill="#FAF9F4" />

      <text x="36" y="40" fill="#144721" fontSize="13" fontWeight="800" letterSpacing="1.4">
        {hi ? 'महिला स्वयं सहायता समूह (SHG) से आत्मनिर्भर उद्यमिता यात्रा' : 'WOMEN SHG COLLECTIVE ENTERPRISE & EMPOWERMENT PATHWAY'}
      </text>

      {/* Flowing connecting botanical ribbon behind 5 stages */}
      <path
        d="M110 154 C240 100, 340 205, 470 154 C600 102, 720 204, 860 154 C940 124, 985 154, 1020 154"
        fill="none"
        stroke="#C7DEA9"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {[
        {
          x: 34,
          num: '01',
          color: '#1E6631',
          bg: '#EDF6E7',
          hiT: 'SHG समूह गठन',
          enT: 'SHG Collective',
          hiD1: 'महिला नेतृत्व व',
          hiD2: 'सामुदायिक साझेदारी',
          enD1: 'Women leadership &',
          enD2: 'peer solidarity',
        },
        {
          x: 248,
          num: '02',
          color: '#A66C14',
          bg: '#FBF3DF',
          hiT: 'उत्पाद निर्माण',
          enT: 'Eco Production',
          hiD1: 'कपड़े/जूट थैले, हस्तशिल्प',
          hiD2: 'खाद्य व जैविक उत्पाद',
          enD1: 'Cloth/jute bags, crafts,',
          enD2: 'food & bio-inputs',
        },
        {
          x: 462,
          num: '03',
          color: '#2B6E5B',
          bg: '#E8F5F0',
          hiT: 'पैकेजिंग व ब्रांडिंग',
          enT: 'Branding & Pack',
          hiD1: 'स्वच्छ गुणवत्ता मानक',
          hiD2: 'एवं उत्पाद पहचान',
          enD1: 'Clean packaging &',
          enD2: 'trusted local identity',
        },
        {
          x: 676,
          num: '04',
          color: '#1D5E8C',
          bg: '#E9F3FA',
          hiT: 'डिजिटल व वित्तीय ज्ञान',
          enT: 'Digital & Finance',
          hiD1: 'सुरक्षित UPI भुगतान,',
          hiD2: 'बचत व खाता-बही',
          enD1: 'Safe UPI payments,',
          enD2: 'bookkeeping & literacy',
        },
        {
          x: 890,
          num: '05',
          color: '#7B3455',
          bg: '#F9EDF3',
          hiT: 'बाजार व CSR नेटवर्क',
          enT: 'Market & CSR',
          hiD1: 'स्थानीय बाजार, मेले',
          hiD2: 'व संस्थागत जुड़ाव',
          enD1: 'Local markets, fairs',
          enD2: '& CSR buyer networks',
        },
      ].map((st) => (
        <g key={st.num}>
          <rect x={st.x} y="66" width="196" height="196" rx="18" fill="#FFFFFF" stroke="#E2DAC8" strokeWidth="1.5" />
          <circle cx={st.x + 98} cy="118" r="28" fill={st.bg} />
          <text x={st.x + 98} y="124" textAnchor="middle" fill={st.color} fontSize="16" fontWeight="800">
            {st.num}
          </text>
          <text x={st.x + 98} y="176" textAnchor="middle" fill="#144721" fontSize="14.5" fontWeight="800">
            {hi ? st.hiT : st.enT}
          </text>
          <text x={st.x + 98} y="204" textAnchor="middle" fill="#44584B" fontSize="12">
            {hi ? st.hiD1 : st.enD1}
          </text>
          <text x={st.x + 98} y="222" textAnchor="middle" fill="#44584B" fontSize="12">
            {hi ? st.hiD2 : st.enD2}
          </text>
        </g>
      ))}

      {/* BOTTOM COMPARISON PANEL: SKILL DEVELOPMENT VS WOMEN EMPOWERMENT (PDF 5.3) */}
      <rect x="34" y="290" width="1052" height="162" rx="18" fill="#FFFFFF" stroke="#DFD6C0" strokeWidth="1.6" />
      <text x="58" y="322" fill="#144721" fontSize="13.5" fontWeight="800" letterSpacing="1.1">
        {hi
          ? 'स्पष्ट अंतर — कौशल विकास मिशन बनाम महिला सशक्तीकरण एवं आजीविका मिशन'
          : 'CLEAR MISSION BOUNDARY — SKILL DEVELOPMENT VS WOMEN EMPOWERMENT'}
      </text>
      <line x1="58" y1="334" x2="1062" y2="334" stroke="#EBE3D0" strokeWidth="1.2" />

      {/* Left Column: Skill Development */}
      <rect x="58" y="348" width="478" height="86" rx="12" fill="#F5F7F2" stroke="#D5DFCC" />
      <text x="76" y="372" fill="#1F592C" fontSize="14" fontWeight="800">
        {hi ? 'कौशल विकास मिशन (Skill Development)' : 'Skill Development Mission'}
      </text>
      <text x="76" y="394" fill="#3C5042" fontSize="12.2">
        {hi ? 'सभी पात्र युवाओं और वयस्कों के लिए रोजगार व व्यावसायिक प्रशिक्षण।' : 'Vocational & employment skills for all eligible youth and adults.'}
      </text>
      <text x="76" y="416" fill="#2B6E29" fontSize="12" fontWeight="700">
        {hi ? 'उदाहरण: सिलाई प्रशिक्षण सीखना कौशल विकास के अंतर्गत आता है।' : 'Example: Learning tailoring skills sits under Skill Development.'}
      </text>

      {/* Right Column: Women Empowerment */}
      <rect x="562" y="348" width="500" height="86" rx="12" fill="#144721" />
      <text x="582" y="372" fill="#D5F29E" fontSize="14" fontWeight="800">
        {hi ? 'महिला सशक्तीकरण एवं आजीविका मिशन' : 'Women Empowerment & Livelihoods Mission'}
      </text>
      <text x="582" y="394" fill="#FFFFFF" fontSize="12.2">
        {hi ? 'विशेष रूप से महिलाओं की आर्थिक भागीदारी, उद्यमिता, नेतृत्व व सुरक्षा।' : 'Dedicated to women’s economic agency, enterprise, leadership & dignity.'}
      </text>
      <text x="582" y="416" fill="#F4D374" fontSize="12" fontWeight="700">
        {hi ? 'उदाहरण: SHG बनाकर उत्पाद तैयार करना, ब्रांडिंग व बाजार से जोड़ना।' : 'Example: Forming a Women SHG to produce, brand & sell products.'}
      </text>
    </svg>
  );
}

/* ============================================================================
   2. HARIT RAJASTHAN — 10-STEP SCIENTIFIC TREE PLANTATION LIFECYCLE (PDF 6.2)
   ============================================================================ */

export function HaritPlantationLifecycleSvg({ lang }: { lang: Language }) {
  const hi = lang === 'hi';
  const steps = [
    { n: '01', hi: 'भूमि व वैध सहमति', en: 'Land & Consent' },
    { n: '02', hi: 'जलवायु व मिट्टी अध्ययन', en: 'Soil & Climate' },
    { n: '03', hi: 'देशज प्रजाति चयन', en: 'Native Species' },
    { n: '04', hi: 'जल उपलब्धता जांच', en: 'Water Availability' },
    { n: '05', hi: 'उचित दूरी व रोपण', en: 'Spacing & Planting' },
    { n: '06', hi: 'ट्री-गार्ड व सुरक्षा', en: 'Protection & Care' },
    { n: '07', hi: 'जीवितता दर मापन', en: 'Survival Tracking' },
    { n: '08', hi: 'नियमित निरीक्षण', en: 'Regular Inspection' },
    { n: '09', hi: 'आवश्यक प्रतिस्थापन', en: 'Gap Replacement' },
    { n: '10', hi: 'दीर्घकालिक संरक्षण', en: 'Long-Term Care' },
  ];

  return (
    <svg
      viewBox="0 0 1120 510"
      className="w-full h-auto block"
      role="img"
      aria-label={
        hi
          ? 'हरित राजस्थान का 10-चरणीय वैज्ञानिक वृक्षारोपण मॉडल और शुष्क घासभूमि संरक्षण नियम'
          : 'Harit Rajasthan 10-step scientific tree plantation lifecycle and arid grassland ecological safeguard'
      }
    >
      <rect x="0" y="0" width="1120" height="510" rx="22" fill="#FAF9F4" />

      <text x="36" y="40" fill="#144721" fontSize="13.5" fontWeight="800" letterSpacing="1.3">
        {hi
          ? 'केवल पौधे लगाना पर्याप्त नहीं — 10-चरणीय वैज्ञानिक वृक्षारोपण एवं जीवितता चक्र'
          : 'PLANTING ALONE IS NOT ENOUGH — 10-STEP SCIENTIFIC SURVIVAL LIFECYCLE'}
      </text>

      {/* S-Curve Flow Connectors */}
      <path d="M128 118 L992 118 C1050 118, 1050 264, 992 264 L128 264" fill="none" stroke="#C5DBA8" strokeWidth="8" strokeLinecap="round" />

      {/* Row 1: Steps 1 to 5 (Left to Right) */}
      {steps.slice(0, 5).map((st, idx) => {
        const cx = 128 + idx * 216;
        return (
          <g key={st.n}>
            <rect x={cx - 94} y="68" width="188" height="106" rx="16" fill="#FFFFFF" stroke="#D3E2C6" strokeWidth="1.6" />
            <circle cx={cx - 64} cy="98" r="16" fill="#144721" />
            <text x={cx - 64} y="103" textAnchor="middle" fill="#D5F29E" fontSize="11.5" fontWeight="800">
              {st.n}
            </text>
            <text x={cx - 40} y="103" fill="#2E6F36" fontSize="11" fontWeight="700">
              {hi ? 'चरण' : 'STEP'} {idx + 1}
            </text>
            <text x={cx - 78} y="138" fill="#144721" fontSize="14" fontWeight="800">
              {hi ? st.hi : st.en}
            </text>
            <line x1={cx - 78} y1="154" x2={cx + 76} y2="154" stroke="#E9F2E1" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      })}

      {/* Row 2: Steps 6 to 10 (Left to Right visually clean, numbered 06 -> 10) */}
      {steps.slice(5, 10).map((st, idx) => {
        const cx = 128 + idx * 216;
        return (
          <g key={st.n}>
            <rect x={cx - 94} y="210" width="188" height="106" rx="16" fill="#FFFFFF" stroke="#D9CFAF" strokeWidth="1.6" />
            <circle cx={cx - 64} cy="240" r="16" fill="#3B7D2A" />
            <text x={cx - 64} y="245" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="800">
              {st.n}
            </text>
            <text x={cx - 40} y="245" fill="#7D5814" fontSize="11" fontWeight="700">
              {hi ? 'चरण' : 'STEP'} {idx + 6}
            </text>
            <text x={cx - 78} y="280" fill="#144721" fontSize="14" fontWeight="800">
              {hi ? st.hi : st.en}
            </text>
            <line x1={cx - 78} y1="296" x2={cx + 76} y2="296" stroke="#F4ECCF" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      })}

      {/* BOTTOM ECOLOGICAL SAFEGUARD + NATIVE SPECIES BAND */}
      <rect x="34" y="346" width="530" height="136" rx="16" fill="#144721" />
      <text x="56" y="378" fill="#D5F29E" fontSize="13" fontWeight="800">
        {hi ? 'राजस्थान के लिए देशज एवं पारिस्थितिक सुरक्षित प्रजातियाँ' : 'CLIMATE-FIT NATIVE RAJASTHAN SPECIES'}
      </text>
      <text x="56" y="405" fill="#FFFFFF" fontSize="13">
        {hi ? '• खेजड़ी (राज्य वृक्ष) — कम जल, चारा व मिट्टी नाइट्रोजन संवर्धन' : '• Khejri (State Tree) — drought resilience & soil nitrogen'}
      </text>
      <text x="56" y="430" fill="#FFFFFF" fontSize="13">
        {hi ? '• नीम, रोहिड़ा व स्थानीय बबूल — प्राकृतिक छाया व जैव विविधता' : '• Neem, Rohida & Native Acacia — shade & desert biodiversity'}
      </text>
      <text x="56" y="455" fill="#D8EBD9" fontSize="13">
        {hi ? '• आंवला, जामुन व सहजन — किसान मेड़ व हरित विद्यालय परिसर' : '• Amla, Jamun & Moringa — farm borders & school green campuses'}
      </text>

      <rect x="586" y="346" width="500" height="136" rx="16" fill="#FBF5E4" stroke="#E0CFA1" strokeWidth="1.6" />
      <text x="610" y="378" fill="#7A500B" fontSize="13" fontWeight="800">
        {hi ? 'शुष्क पारिस्थितिकी एवं घासभूमि सुरक्षा सिद्धांत (Ecological Rule)' : 'ARID GRASSLAND ECOLOGICAL SAFEGUARD'}
      </text>
      <text x="610" y="406" fill="#4A3B1E" fontSize="12.5">
        {hi ? 'शुष्क राजस्थान में जल सीमा व स्थानीय जैव-विविधता सर्वोपरि है।' : 'Arid Rajasthan water limits and native biodiversity come first.'}
      </text>
      <text x="610" y="429" fill="#4A3B1E" fontSize="12.5">
        {hi ? 'प्राकृतिक घासभूमि (ओरण/गोचर) या मूल्यवान पारिस्थितिकी तंत्र को' : 'Natural grasslands (Orans) or sensitive desert habitats must NEVER'}
      </text>
      <text x="610" y="452" fill="#7A500B" fontSize="12.5" fontWeight="800">
        {hi ? 'बिना वैज्ञानिक अध्ययन के वृक्षारोपण क्षेत्र में नहीं बदला जाएगा।' : 'be converted into tree plantations without ecological study.'}
      </text>
    </svg>
  );
}

/* ============================================================================
   3. HARIT MITRA NETWORK, HEATWAVE RESILIENCE & CARBON BOUNDARY SVG (PDF 6.3-6.6)
   ============================================================================ */

export function HaritHeatCarbonNetworkSvg({ lang }: { lang: Language }) {
  const hi = lang === 'hi';
  return (
    <svg
      viewBox="0 0 1120 430"
      className="w-full h-auto block"
      role="img"
      aria-label={
        hi
          ? 'हरित मित्र ग्राम नेटवर्क, बढ़ती गर्मी से बचाव और कार्बन क्रेडिट पात्रता सीमा का चित्रण'
          : 'Harit Mitra village network, heatwave resilience measures and Carbon Credit eligibility boundary'
      }
    >
      <rect x="0" y="0" width="1120" height="430" rx="22" fill="#FAF9F4" />

      {/* Left Panel: Harit Mitra Village Hub */}
      <rect x="30" y="28" width="340" height="374" rx="18" fill="#FFFFFF" stroke="#CBE0BE" strokeWidth="1.6" />
      <text x="52" y="60" fill="#144721" fontSize="15.5" fontWeight="800">
        {hi ? 'हरित मित्र ग्राम नेटवर्क' : 'Harit Mitra Village Network'}
      </text>
      <text x="52" y="80" fill="#4A6252" fontSize="11.8">
        {hi ? 'प्रत्येक चयनित गाँव में 7 प्रमुख भूमिकाएँ' : '7 Community Stewardship Roles per Village'}
      </text>
      {[
        hi ? '1. किसानों से नियमित संवाद व संपर्क' : '1. Regular farmer outreach & dialogue',
        hi ? '2. पौधारोपण हेतु वैध सहमति में सहायता' : '2. Supporting informed plantation consent',
        hi ? '3. प्रशिक्षण कार्यक्रमों की जानकारी पहुँचाना' : '3. Sharing field training schedules',
        hi ? '4. पौधों की देखभाल व जल सिंचाई जागरूकता' : '4. Sapling watering & protection care',
        hi ? '5. गतिविधियों का पारदर्शी रिकॉर्ड रखना' : '5. Transparent field activity logging',
        hi ? '6. स्थानीय पर्यावरणीय समस्या रिपोर्टिंग' : '6. Reporting local field challenges',
        hi ? '7. स्वच्छता व जल संरक्षण में सहयोग' : '7. Supporting clean-village & water drives',
      ].map((r, i) => (
        <g key={r}>
          <rect x="50" y={98 + i * 40} width="300" height="32" rx="8" fill="#F4F9F0" />
          <text x="64" y={118 + i * 40} fill="#1E4627" fontSize="12" fontWeight="600">
            {r}
          </text>
        </g>
      ))}

      {/* Middle Panel: Extreme Heatwave Resilience */}
      <rect x="390" y="28" width="340" height="374" rx="18" fill="#FFFFFF" stroke="#E8D2A6" strokeWidth="1.6" />
      <text x="412" y="60" fill="#8A4B0F" fontSize="15.5" fontWeight="800">
        {hi ? 'बढ़ती गर्मी (Heatwave) से बचाव' : 'Extreme Heat Resilience'}
      </text>
      <text x="412" y="80" fill="#664C2F" fontSize="11.8">
        {hi ? 'स्थानीय शीतलन एवं Heat Action Plan सहयोग' : 'Local Cooling & Heat Action Plan Support'}
      </text>

      {/* Sun + Shade Tree + Cool Roof Graphic */}
      <rect x="412" y="96" width="296" height="92" rx="12" fill="#FDF6E4" />
      <circle cx="458" cy="126" r="18" fill="#E89A24" />
      <circle cx="540" cy="134" r="24" fill="#2F7A33" />
      <rect x="537" y="152" width="6" height="24" fill="#6E4725" />
      <rect x="606" y="138" width="76" height="38" rx="4" fill="#FFFFFF" stroke="#C4B699" strokeWidth="1.8" />
      <rect x="602" y="132" width="84" height="8" rx="3" fill="#DDEEF8" stroke="#629BC4" />

      {[
        hi ? '• स्थानीय छायादार वृक्षों का संरक्षण' : '• Preserving mature native shade trees',
        hi ? '• स्कूलों व सार्वजनिक स्थानों पर छाया व्यवस्था' : '• Shaded canopies in schools & public spaces',
        hi ? '• गर्मी के संवेदनशील हॉटस्पॉट की पहचान' : '• Mapping heat-vulnerable rural/urban zones',
        hi ? '• उपयुक्त कूल रूफ व भवन ऊर्जा दक्षता' : '• Cool roofs & passive building cooling',
        hi ? '• वर्षा जल, शहरी हरियाली व हीटवेव जागरूकता' : '• Rainwater care, urban greens & awareness',
      ].map((h, i) => (
        <text key={h} x="412" y={218 + i * 28} fill="#443828" fontSize="12.2">
          {h}
        </text>
      ))}
      <text x="412" y="374" fill="#8A4B0F" fontSize="11" fontWeight="700">
        {hi ? '* एक परियोजना से पूरे शहर का तापमान घटने का दावा नहीं।' : '* No claim that a single project cools an entire city.'}
      </text>

      {/* Right Panel: Carbon Credit Boundary Gate */}
      <rect x="750" y="28" width="340" height="374" rx="18" fill="#134420" />
      <text x="774" y="62" fill="#D5F29E" fontSize="15.5" fontWeight="800">
        {hi ? 'कार्बन क्रेडिट से स्पष्ट संबंध' : 'Carbon Credit Eligibility Gate'}
      </text>
      <text x="774" y="84" fill="#D7EBD9" fontSize="12">
        {hi ? 'हर वृक्षारोपण स्वतः कार्बन क्रेडिट नहीं बनता।' : 'Not every plantation becomes a carbon credit.'}
      </text>

      <rect x="774" y="104" width="292" height="148" rx="14" fill="#1E5B2D" stroke="#458754" />
      <text x="790" y="128" fill="#F4D374" fontSize="12" fontWeight="800">
        {hi ? 'कार्बन पात्रता के आवश्यक मानक:' : 'REQUIRED CARBON STANDARDS:'}
      </text>
      {[
        hi ? '✓ मानक पात्रता व अतिरिक्तता (Additionality)' : '✓ Standards Eligibility & Additionality',
        hi ? '✓ वैज्ञानिक बेसलाइन एवं दीर्घकालिक MRV' : '✓ Scientific Baseline & Multi-Year MRV',
        hi ? '✓ स्वतंत्र तृतीय-पक्ष सत्यापन (Verification)' : '✓ Independent Third-Party Verification',
        hi ? '✓ स्पष्ट भूमि, कार्बन अधिकार व स्थायित्व' : '✓ Clear Land/Carbon Rights & Permanence',
      ].map((c, i) => (
        <text key={c} x="790" y={154 + i * 24} fill="#FFFFFF" fontSize="11.8">
          {c}
        </text>
      ))}

      <rect x="774" y="272" width="292" height="106" rx="14" fill="#10361A" stroke="#346E42" />
      <text x="790" y="298" fill="#F2B880" fontSize="12" fontWeight="800">
        {hi ? 'मॉड्यूल पृथक्करण नियम (Boundary):' : 'MODULE BOUNDARY RULE:'}
      </text>
      <text x="790" y="322" fill="#E3F2E5" fontSize="12">
        {hi ? 'गौशाला, वृद्धाश्रम एवं कौशल विकास मिशन' : 'Gaushala, Senior Citizen Care & Skill'}
      </text>
      <text x="790" y="342" fill="#E3F2E5" fontSize="12">
        {hi ? 'को कार्बन क्रेडिट मॉड्यूल के भीतर नहीं' : 'Development are strictly kept outside'}
      </text>
      <text x="790" y="362" fill="#D5F29E" fontSize="12" fontWeight="700">
        {hi ? 'रखा जाता — प्रत्येक मिशन की स्वतंत्र पहचान है।' : 'the Carbon Credit verification module.'}
      </text>
    </svg>
  );
}

/* ============================================================================
   4. HERITAGE CONSERVATION & WATER SECURITY — SHEKHAWATI CUTAWAY SVG (PDF 7.2)
   ============================================================================ */

export function HeritageWaterCutawaySvg({ lang }: { lang: Language }) {
  const hi = lang === 'hi';
  return (
    <svg
      viewBox="0 0 1120 500"
      className="w-full h-auto block"
      role="img"
      aria-label={
        hi
          ? 'शेखावाटी हवेली, रूफटॉप रेनवाटर हार्वेस्टिंग, पारंपरिक बावड़ी-जोहड़ और भूजल पुनर्भरण का वास्तुशिल्प चित्र'
          : 'Shekhawati haveli architecture, rooftop rainwater harvesting, traditional baori and johad recharging underground aquifer'
      }
    >
      <defs>
        <linearGradient id="herSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EEF5FA" />
          <stop offset="100%" stopColor="#FAF3E3" />
        </linearGradient>
        <linearGradient id="aquiferSoil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C49A6C" />
          <stop offset="100%" stopColor="#8F673E" />
        </linearGradient>
        <linearGradient id="aquiferWater" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1B6CA8" />
          <stop offset="100%" stopColor="#3B9AD9" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="1120" height="275" rx="22" fill="url(#herSky)" />
      {/* Rain Cloud */}
      <g opacity="0.9">
        <circle cx="240" cy="64" r="24" fill="#CFE2EE" />
        <circle cx="268" cy="56" r="28" fill="#D8E9F4" />
        <circle cx="298" cy="66" r="22" fill="#CFE2EE" />
        {[232, 254, 276, 298].map((rx) => (
          <line key={rx} x1={rx} y1="92" x2={rx - 6} y2="112" stroke="#4D9BD1" strokeWidth="2.4" strokeLinecap="round" />
        ))}
      </g>

      {/* LEFT: SHEKHAWATI SANDSTONE HAVELI WITH JHAROKHAS & ROOFTOP RAINWATER */}
      <g>
        {/* Main Sandstone Haveli Facade */}
        <rect x="96" y="138" width="290" height="137" fill="#E6C99E" stroke="#B68E57" strokeWidth="2" />
        {/* Rooftop Parapet & Chhatri Dome */}
        <rect x="88" y="128" width="306" height="12" rx="3" fill="#CFA874" />
        <path d="M132 128 Q154 96 176 128 Z" fill="#C48E28" />
        <path d="M308 128 Q330 96 352 128 Z" fill="#C48E28" />
        {/* Carved Jharokha Arches */}
        {[134, 212, 290].map((jx) => (
          <g key={jx}>
            <path d={`M${jx} 198 L${jx} 166 Q${jx + 22} 148 ${jx + 44} 166 L${jx + 44} 198 Z`} fill="#8B5A2B" />
            <path d={`M${jx + 6} 198 L${jx + 6} 170 Q${jx + 22} 156 ${jx + 38} 170 L${jx + 38} 198 Z`} fill="#FBF2DE" />
          </g>
        ))}
        {/* Haveli Grand Entrance Arch */}
        <path d="M206 275 L206 226 Q241 206 276 226 L276 275 Z" fill="#6F4420" />
        {/* Rooftop Rainwater Gutter Pipe -> Silt Filter -> Underground Tanka */}
        <path d="M386 138 L412 138 L412 296 L448 296" fill="none" stroke="#1E78B4" strokeWidth="6" strokeLinejoin="round" />
        <rect x="398" y="236" width="28" height="32" rx="5" fill="#2E7D32" />
      </g>

      {/* CENTER: STEPPED TRADITIONAL BAORI / KUND */}
      <g>
        <path d="M510 275 L540 275 L540 296 L568 296 L568 318 L596 318 L596 342 L724 342 L724 318 L752 318 L752 296 L780 296 L780 275 L810 275" fill="#D9BD90" stroke="#9C7A49" strokeWidth="2.5" />
        {/* Baori Water Level */}
        <rect x="596" y="316" width="128" height="38" fill="#2F8AC8" opacity="0.88" />
        <line x1="606" y1="326" x2="714" y2="326" stroke="#A7DBF7" strokeWidth="2" />
        {/* Traditional Chhatri Pavilion beside Baori */}
        <rect x="518" y="220" width="46" height="55" fill="#E3C495" />
        <path d="M512 220 Q541 188 570 220 Z" fill="#B57B20" />
      </g>

      {/* RIGHT: VILLAGE JOHAD / TALAB + TREES */}
      <g>
        <path d="M842 275 Q945 236 1058 275 Z" fill="#9BC279" />
        <circle cx="888" cy="218" r="28" fill="#2E6F2B" />
        <rect x="884" y="242" width="8" height="28" fill="#6E4725" />
        <ellipse cx="964" cy="276" rx="88" ry="18" fill="#3B9AD9" />
        <ellipse cx="964" cy="274" rx="68" ry="10" fill="#82C9F2" opacity="0.65" />
      </g>

      {/* UNDERGROUND EARTH & AQUIFER RECHARGE LAYER */}
      <path d="M0 275 L510 275 L596 354 L724 354 L810 275 L1120 275 L1120 478 Q1120 500 1098 500 L22 500 Q0 500 0 478 Z" fill="url(#aquiferSoil)" />

      {/* Underground Tanka Chamber (connected to Haveli roof) */}
      <rect x="448" y="294" width="66" height="62" rx="10" fill="#2B84C2" stroke="#DCECF7" strokeWidth="2.2" />
      <text x="481" y="328" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="800">
        {hi ? 'टांका' : 'TANKA'}
      </text>

      {/* Percolation Arrows recharging deep Groundwater Aquifer */}
      {[481, 636, 684, 938, 988].map((px) => (
        <g key={px}>
          <line x1={px} y1="364" x2={px} y2="404" stroke="#A7DBF7" strokeWidth="2.5" strokeDasharray="4 3" />
          <polygon points={`${px - 5},400 ${px + 5},400 ${px},409`} fill="#A7DBF7" />
        </g>
      ))}

      {/* Deep Recharged Groundwater Aquifer Band */}
      <path d="M24 416 Q280 400 560 418 T1096 414 L1096 474 Q1096 486 1082 486 L38 486 Q24 486 24 474 Z" fill="url(#aquiferWater)" />
      <text x="560" y="458" textAnchor="middle" fill="#FFFFFF" fontSize="14.5" fontWeight="800" letterSpacing="1">
        {hi
          ? 'पुनर्भरित भूजल स्तर (GROUNDWATER AQUIFER RECHARGE) · जल साक्षरता एवं सामुदायिक जल बजट'
          : 'RECHARGED GROUNDWATER AQUIFER · VILLAGE WATER LITERACY & COMMUNITY WATER BUDGET'}
      </text>

      {/* Crisp Top Callouts */}
      <rect x="414" y="30" width="290" height="62" rx="12" fill="#FFFFFF" stroke="#DDD2BA" />
      <text x="430" y="54" fill="#144721" fontSize="13" fontWeight="800">
        {hi ? 'शेखावाटी हवेली व रूफटॉप रेनवाटर' : 'Shekhawati Haveli & Rooftop Capture'}
      </text>
      <text x="430" y="75" fill="#46584D" fontSize="11.5">
        {hi ? 'पारंपरिक वास्तुकला, कारीगर कौशल व स्वच्छ वर्षा संचयन' : 'Traditional craft, filtered rain channels & tankas'}
      </text>

      <rect x="734" y="30" width="352" height="62" rx="12" fill="#FFFFFF" stroke="#CBDCE8" />
      <text x="750" y="54" fill="#124769" fontSize="13" fontWeight="800">
        {hi ? 'बावड़ी, पारंपरिक जोहड़, तालाब व जलग्रहण संरक्षण' : 'Baoris, Johads, Talabs & Catchment Revival'}
      </text>
      <text x="750" y="75" fill="#415868" fontSize="11.5">
        {hi ? 'स्थानीय वर्षा रिकॉर्ड और गाद सफाई से स्थायी भूजल सुधार' : 'Catchment care & desilting for long-term water security'}
      </text>
    </svg>
  );
}

/* ============================================================================
   5. 8-FACTOR SCIENTIFIC WATER METHODOLOGY BLUEPRINT SVG (PDF 7.3)
   ============================================================================ */

export function WaterEightFactorBlueprintSvg({ lang }: { lang: Language }) {
  const hi = lang === 'hi';
  const factors = [
    { n: '01', hiT: 'स्थानीय वर्षा रिकॉर्ड', enT: 'Local Rainfall Record', hiD: 'दीर्घकालिक वर्षा डेटा विश्लेषण', enD: 'Historical monsoon rainfall data' },
    { n: '02', hiT: 'जलग्रहण क्षेत्र', enT: 'Catchment Area', hiD: 'बहाव मार्ग व जल-आवक मानचित्रण', enD: 'Runoff flow & catchment mapping' },
    { n: '03', hiT: 'मिट्टी की पारगम्यता', enT: 'Soil Permeability', hiD: 'जल रिसाव व अवशोषण क्षमता', enD: 'Infiltration & percolation rate' },
    { n: '04', hiT: 'भूजल स्तर', enT: 'Groundwater Level', hiD: 'मौसमी जल-तल मापन (Depth)', enD: 'Pre & post-monsoon water table' },
    { n: '05', hiT: 'पानी की गुणवत्ता', enT: 'Water Quality', hiD: 'TDS, फ्लोराइड व स्वच्छता जाँच', enD: 'TDS, salinity & potability lab check' },
    { n: '06', hiT: 'गाद व प्रदूषण स्थिति', enT: 'Silt & Pollution', hiD: 'कचरा अवरोध व गाद मूल्यांकन', enD: 'Silt load & inflow contamination' },
    { n: '07', hiT: 'संरचना की सुरक्षा', enT: 'Structural Safety', hiD: 'कुंड/बावड़ी की दीवार व नींव जाँच', enD: 'Heritage masonry & safety check' },
    { n: '08', hiT: 'विभागीय अनुमतियाँ', enT: 'Dept. Permissions', hiD: 'स्वामित्व व विरासत कानून अनुपालन', enD: 'Ownership & heritage clearances' },
  ];

  return (
    <svg
      viewBox="0 0 1120 350"
      className="w-full h-auto block"
      role="img"
      aria-label={
        hi
          ? 'जल संरक्षण परियोजनाओं की 8-चरणीय वैज्ञानिक कार्यप्रणाली'
          : '8-factor scientific methodology required for water conservation projects'
      }
    >
      <rect x="0" y="0" width="1120" height="350" rx="22" fill="#FAF9F4" />
      <text x="36" y="40" fill="#124769" fontSize="13.5" fontWeight="800" letterSpacing="1.3">
        {hi
          ? 'प्रत्येक जल संरक्षण कार्य से पूर्व अनिवार्य 8 वैज्ञानिक एवं वैधानिक अध्ययन'
          : '8 MANDATORY SCIENTIFIC & STATUTORY ASSESSMENTS BEFORE EVERY WATER PROJECT'}
      </text>

      {factors.map((f, idx) => {
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        const x = 36 + col * 266;
        const y = 62 + row * 134;
        return (
          <g key={f.n}>
            <rect x={x} y={y} width="248" height="114" rx="16" fill="#FFFFFF" stroke="#D2DFEA" strokeWidth="1.5" />
            <rect x={x + 16} y={y + 16} width="34" height="24" rx="7" fill="#124769" />
            <text x={x + 33} y={y + 32} textAnchor="middle" fill="#D6F0FF" fontSize="11.5" fontWeight="800">
              {f.n}
            </text>
            <text x={x + 16} y={y + 66} fill="#144721" fontSize="14.5" fontWeight="800">
              {hi ? f.hiT : f.enT}
            </text>
            <text x={x + 16} y={y + 90} fill="#4A5D54" fontSize="11.8">
              {hi ? f.hiD : f.enD}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================================
   6. SKILL DEVELOPMENT & EMPLOYMENT PATHWAY SVG (Using Uploaded Hero Context)
   ============================================================================ */

export function SkillPathwayIllustrationSvg({ lang }: { lang: Language }) {
  const hi = lang === 'hi';
  return (
    <svg
      viewBox="0 0 1120 390"
      className="w-full h-auto block"
      role="img"
      aria-label={
        hi
          ? 'कौशल विकास, भाषा प्रशिक्षण, डिजिटल साक्षरता और हरित रोजगार मार्ग चित्र'
          : 'Skill development pathway across languages, digital skills, green trades and workplace safety'
      }
    >
      <rect x="0" y="0" width="1120" height="390" rx="22" fill="#FAF9F4" />
      <text x="36" y="40" fill="#144721" fontSize="13.5" fontWeight="800" letterSpacing="1.3">
        {hi
          ? 'व्यावहारिक कौशल से सम्मानजनक आजीविका एवं उद्योग साझेदारी तक'
          : 'FROM PRACTICAL VOCATIONAL TRAINING TO DIGNIFIED LIVELIHOODS'}
      </text>

      {[
        { x: 36, num: '01', bg: '#EDF6E7', stroke: '#C6DDB9', hiT: 'विदेशी व अंग्रेजी भाषा', enT: 'Language Fluency', hiD1: 'जर्मन (A1–A2), दैनिक अंग्रेजी', hiD2: 'संवाद एवं साक्षात्कार तैयारी', enD1: 'German (A1–A2), spoken English', enD2: '& interview readiness' },
        { x: 304, num: '02', bg: '#EAF3FA', stroke: '#BDD7EA', hiT: 'डिजिटल व ई-गवर्नेंस', enT: 'Digital & Office', hiD1: 'कंप्यूटर, स्प्रेडशीट, साइबर सुरक्षा', hiD2: 'एवं ऑनलाइन नागरिक सेवाएँ', enD1: 'Office tools, spreadsheets,', enD2: 'cyber safety & e-services' },
        { x: 572, num: '03', bg: '#FBF4E1', stroke: '#E2D0A4', hiT: 'हरित ग्रामीण कौशल', enT: 'Green Rural Trades', hiD1: 'नर्सरी, वर्मीकम्पोस्ट, सोलर रखरखाव', hiD2: 'एवं व्यावहारिक सिलाई प्रशिक्षण', enD1: 'Nurseries, compost, solar upkeep', enD2: '& practical vocational trades' },
        { x: 840, num: '04', bg: '#F8ECEC', stroke: '#E4C0C0', hiT: 'कार्यस्थल सुरक्षा व उद्योग', enT: 'Safety & Industry', hiD1: 'औद्योगिक सुरक्षा, प्राथमिक उपचार', hiD2: 'एवं स्थानीय उद्योग साझेदारी', enD1: 'Occupational safety, first aid', enD2: '& local industry readiness' },
      ].map((c) => (
        <g key={c.num}>
          <rect x={c.x} y="64" width="244" height="190" rx="18" fill="#FFFFFF" stroke={c.stroke} strokeWidth="1.6" />
          <rect x={c.x + 18} y="82" width="44" height="30" rx="8" fill={c.bg} />
          <text x={c.x + 40} y="102" textAnchor="middle" fill="#144721" fontSize="13" fontWeight="800">
            {c.num}
          </text>
          <text x={c.x + 18} y="142" fill="#144721" fontSize="15.5" fontWeight="800">
            {hi ? c.hiT : c.enT}
          </text>
          <text x={c.x + 18} y="172" fill="#3D5244" fontSize="12.2">
            {hi ? c.hiD1 : c.enD1}
          </text>
          <text x={c.x + 18} y="192" fill="#3D5244" fontSize="12.2">
            {hi ? c.hiD2 : c.enD2}
          </text>
        </g>
      ))}

      {/* Bottom Outcome Ribbon */}
      <rect x="36" y="280" width="1048" height="82" rx="16" fill="#144721" />
      <text x="60" y="313" fill="#D5F29E" fontSize="13" fontWeight="800">
        {hi ? 'ईमानदार रोजगार नीति (Honest Career Readiness Policy)' : 'HONEST CAREER READINESS POLICY'}
      </text>
      <text x="60" y="340" fill="#FFFFFF" fontSize="12.5">
        {hi
          ? 'GOVEDA व्यावहारिक प्रशिक्षण, प्रमाणित कौशल मार्गदर्शन और उद्योग संपर्क प्रदान करती है — विदेश में नौकरी, वीज़ा या निश्चित वेतन की कोई भ्रामक गारंटी नहीं दी जाती।'
          : 'GOVEDA delivers structured practical training, exam preparation, and industry linkages — never issuing misleading job, salary, or overseas visa guarantees.'}
      </text>
    </svg>
  );
}
