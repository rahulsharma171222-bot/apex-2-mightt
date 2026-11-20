import React from 'react';
import type { Language } from '../types/goveda';

/* ============================================================================
   LARGE MODERN EXPLANATORY SVG ILLUSTRATIONS — PART A
   1. CleanIndiaWasteFlowSvg       — 4-Stream Scientific Waste Classification & Recovery
   2. CleanIndiaVillageCitySvg     — Clean Village, Clean City & Cloth-Bag Reuse Loop
   3. OrganicSoilCutawaySvg        — Living Soil, SOC vs SOM, Rainwater & Drip Farm Cutaway
   4. OrganicComparisonTrialSvg    — Natural vs Organic Farming + 4-Plot Field Trial
   5. CleanEnergyEcosystemSvg      — Rural Solar, Biogas Digester & CBG Architecture + 6 Safeguards
   ============================================================================ */

export function CleanIndiaWasteFlowSvg({ lang }: { lang: Language }) {
  const hi = lang === 'hi';
  return (
    <svg
      viewBox="0 0 1120 500"
      className="w-full h-auto block"
      role="img"
      aria-label={
        hi
          ? 'कचरे का चार-स्तरीय वैज्ञानिक वर्गीकरण और संसाधन पुनर्प्राप्ति प्रवाह चित्र'
          : '4-stream scientific waste classification and resource recovery pathway diagram'
      }
    >
      <defs>
        <linearGradient id="ciBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FCFBF6" />
          <stop offset="100%" stopColor="#F3F6EE" />
        </linearGradient>
        <linearGradient id="wetGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2E7D32" />
          <stop offset="100%" stopColor="#66A832" />
        </linearGradient>
        <linearGradient id="dryGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1D6FA3" />
          <stop offset="100%" stopColor="#4193C9" />
        </linearGradient>
        <linearGradient id="sanGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B85D19" />
          <stop offset="100%" stopColor="#DC8433" />
        </linearGradient>
        <linearGradient id="hazGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9B2C2C" />
          <stop offset="100%" stopColor="#C94A4A" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1120" height="500" rx="22" fill="url(#ciBg)" />

      {/* Header strip inside diagram */}
      <text x="40" y="42" fill="#144721" fontSize="13" fontWeight="800" letterSpacing="1.6">
        {hi ? 'स्रोत पर 4-श्रेणी वैज्ञानिक पृथक्करण' : 'STAGE 01 · 4-STREAM SOURCE SEGREGATION'}
      </text>
      <text x="660" y="42" fill="#144721" fontSize="13" fontWeight="800" letterSpacing="1.6">
        {hi ? 'वैज्ञानिक संसाधन एवं सुरक्षित निस्तारण' : 'STAGE 02 · SCIENTIFIC RECOVERY & SAFE TREATMENT'}
      </text>
      <line x1="40" y1="54" x2="1080" y2="54" stroke="#E2DAC6" strokeWidth="1.2" />

      {/* STREAM 1: WET ORGANIC WASTE -> COMPOST & BIOGAS */}
      <g>
        <rect x="40" y="76" width="410" height="82" rx="16" fill="#FFFFFF" stroke="#CBE0BE" strokeWidth="1.6" />
        {/* Illustrated Green Bin */}
        <rect x="60" y="96" width="44" height="46" rx="7" fill="#2E7D32" />
        <rect x="56" y="90" width="52" height="9" rx="4" fill="#1E5C22" />
        <path d="M74 126 C74 114, 90 110, 92 121 C85 123, 80 127, 74 126 Z" fill="#D5F2A7" />
        <path d="M82 118 C82 109, 91 106, 94 112" stroke="#D5F2A7" strokeWidth="2" fill="none" />
        <text x="122" y="106" fill="#144721" fontSize="16" fontWeight="800">
          {hi ? '1. गीला जैविक कचरा (Wet Waste)' : '1. Wet Organic Waste'}
        </text>
        <text x="122" y="128" fill="#415848" fontSize="12.5">
          {hi ? 'भोजन अवशेष, फल-सब्जी के छिलके, फूल व जैविक सामग्री' : 'Food scraps, vegetable & fruit peels, flowers, garden organics'}
        </text>
        <text x="122" y="146" fill="#2E7D32" fontSize="11.5" fontWeight="700">
          {hi ? 'स्रोत पर अलग रखें · प्लास्टिक न मिलाएँ' : 'Keep pure at source · Never mix with plastic'}
        </text>

        {/* Flow Connector */}
        <path d="M450 117 L646 117" stroke="#3D8B37" strokeWidth="3.5" fill="none" strokeDasharray="7 5" />
        <polygon points="644,110 660,117 644,124" fill="#3D8B37" />

        {/* Destination Card: Compost + Biogas */}
        <rect x="664" y="76" width="416" height="82" rx="16" fill="#EEF7E8" stroke="#BDD9AC" strokeWidth="1.6" />
        <circle cx="702" cy="117" r="22" fill="#2E7D32" />
        <path d="M692 123 Q702 103 712 123 Z" fill="#D7F4A4" />
        <circle cx="702" cy="107" r="4" fill="#F8D264" />
        <text x="738" y="106" fill="#144721" fontSize="15.5" fontWeight="800">
          {hi ? 'कम्पोस्ट खाद एवं नियंत्रित बायोगैस' : 'Scientific Compost & Controlled Biogas'}
        </text>
        <text x="738" y="127" fill="#324B39" fontSize="12">
          {hi ? 'एरोबिक कम्पोस्टिंग से उपजाऊ खाद तथा ऑक्सीजन-रहित' : 'Aerobic composting into fertile humus or anaerobic digestion'}
        </text>
        <text x="738" y="145" fill="#324B39" fontSize="12">
          {hi ? 'प्रक्रिया से स्वच्छ बायोगैस ऊर्जा का निर्माण' : 'into clean biogas energy for village kitchens'}
        </text>
      </g>

      {/* STREAM 2: DRY RECYCLABLE -> MRF */}
      <g>
        <rect x="40" y="174" width="410" height="82" rx="16" fill="#FFFFFF" stroke="#BDD9EA" strokeWidth="1.6" />
        {/* Illustrated Blue Bin */}
        <rect x="60" y="194" width="44" height="46" rx="7" fill="#1D6FA3" />
        <rect x="56" y="188" width="52" height="9" rx="4" fill="#134E75" />
        <path d="M74 218 L82 206 L90 218 Z" fill="none" stroke="#D9F0FF" strokeWidth="2.2" strokeLinejoin="round" />
        <text x="122" y="204" fill="#124769" fontSize="16" fontWeight="800">
          {hi ? '2. सूखा कचरा (Dry Recyclable)' : '2. Dry Recyclable Waste'}
        </text>
        <text x="122" y="226" fill="#3D5261" fontSize="12.5">
          {hi ? 'स्वच्छ प्लास्टिक, कागज, गत्ता, धातु व काँच सामग्री' : 'Clean plastic, paper, cardboard, metal cans, glass'}
        </text>
        <text x="122" y="244" fill="#1D6FA3" fontSize="11.5" fontWeight="700">
          {hi ? 'सूखा व साफ रखें ताकि पुनर्चक्रण संभव हो' : 'Keep dry & clean for authorised recycling'}
        </text>

        <path d="M450 215 L646 215" stroke="#2478AE" strokeWidth="3.5" fill="none" strokeDasharray="7 5" />
        <polygon points="644,208 660,215 644,222" fill="#2478AE" />

        <rect x="664" y="174" width="416" height="82" rx="16" fill="#ECF5FA" stroke="#B7D6E8" strokeWidth="1.6" />
        <circle cx="702" cy="215" r="22" fill="#1D6FA3" />
        <rect x="691" y="206" width="22" height="17" rx="3" fill="none" stroke="#E0F3FF" strokeWidth="2.2" />
        <line x1="691" y1="214" x2="713" y2="214" stroke="#E0F3FF" strokeWidth="2" />
        <text x="738" y="204" fill="#124769" fontSize="15.5" fontWeight="800">
          {hi ? 'मटीरियल रिकवरी फैसिलिटी (MRF)' : 'Material Recovery Facility (MRF)'}
        </text>
        <text x="738" y="225" fill="#324857" fontSize="12">
          {hi ? 'अधिकृत पुनर्चक्रण केंद्रों द्वारा प्लास्टिक, धातु, कागज व काँच' : 'Sorting and channelling plastic, paper, metal & glass to'}
        </text>
        <text x="738" y="243" fill="#324857" fontSize="12">
          {hi ? 'का वर्गीकरण एवं चक्रीय पुनः उपयोग' : 'authorised recyclers instead of dumpsites'}
        </text>
      </g>

      {/* STREAM 3: SANITARY WASTE -> AUTHORISED TREATMENT */}
      <g>
        <rect x="40" y="272" width="410" height="82" rx="16" fill="#FFFFFF" stroke="#E9C9A8" strokeWidth="1.6" />
        {/* Illustrated Amber/Wrapped Sanitary Bin */}
        <rect x="60" y="292" width="44" height="46" rx="7" fill="#B85D19" />
        <rect x="56" y="286" width="52" height="9" rx="4" fill="#8C420E" />
        <rect x="73" y="306" width="18" height="18" rx="4" fill="#FBE6CE" />
        <line x1="78" y1="315" x2="86" y2="315" stroke="#B85D19" strokeWidth="2.5" />
        <line x1="82" y1="311" x2="82" y2="319" stroke="#B85D19" strokeWidth="2.5" />
        <text x="122" y="302" fill="#7A3809" fontSize="16" fontWeight="800">
          {hi ? '3. सैनिटरी कचरा (Sanitary Waste)' : '3. Sanitary Waste'}
        </text>
        <text x="122" y="324" fill="#5A4636" fontSize="12.5">
          {hi ? 'डायपर, सैनिटरी नैपकिन व व्यक्तिगत स्वच्छता सामग्री' : 'Diapers, sanitary napkins & personal hygiene waste'}
        </text>
        <text x="122" y="342" fill="#B85D19" fontSize="11.5" fontWeight="700">
          {hi ? 'कागज में लपेटकर निर्धारित विधि से अलग सौंपें' : 'Wrap securely & hand over separately as prescribed'}
        </text>

        <path d="M450 313 C535 313, 560 338, 646 350" stroke="url(#sanGrad)" strokeWidth="3.8" fill="none" strokeDasharray="7 5" />
        <polygon points="644,343 659,351 644,357" fill="#C97024" />
      </g>

      {/* STREAM 4: SPECIAL CARE HOUSEHOLD HAZARDOUS -> AUTHORISED TREATMENT */}
      <g>
        <rect x="40" y="370" width="410" height="82" rx="16" fill="#FFFFFF" stroke="#E8BFBF" strokeWidth="1.6" />
        {/* Illustrated Red Special Care Bin */}
        <rect x="60" y="390" width="44" height="46" rx="7" fill="#9B2C2C" />
        <rect x="56" y="384" width="52" height="9" rx="4" fill="#701D1D" />
        <polygon points="82,402 93,422 71,422" fill="none" stroke="#FFE2E2" strokeWidth="2.2" />
        <line x1="82" y1="409" x2="82" y2="416" stroke="#FFE2E2" strokeWidth="2.2" />
        <text x="122" y="400" fill="#7D1E1E" fontSize="16" fontWeight="800">
          {hi ? '4. विशेष देखभाल कचरा (Special Care)' : '4. Special Care / Household Hazardous'}
        </text>
        <text x="122" y="422" fill="#5C3D3D" fontSize="12.5">
          {hi ? 'बैटरियाँ, CFL/LED बल्ब, एक्सपायर्ड दवाइयाँ, रसायन डिब्बे' : 'Batteries, CFL/LED bulbs, expired medicines, chemical tins'}
        </text>
        <text x="122" y="440" fill="#9B2C2C" fontSize="11.5" fontWeight="700">
          {hi ? 'अलग सुरक्षित बॉक्स में रखें · सामान्य कचरे में न डालें' : 'Store separately · Never mix in general household bins'}
        </text>

        <path d="M450 411 C535 411, 560 388, 646 376" stroke="url(#hazGrad)" strokeWidth="3.8" fill="none" strokeDasharray="7 5" />
        <polygon points="644,369 659,375 644,383" fill="#B53B3B" />
      </g>

      {/* Combined Authorised Safe Disposal Box for Streams 3 & 4 */}
      <g>
        <rect x="664" y="278" width="416" height="174" rx="18" fill="#FDF3EF" stroke="#E5C0B2" strokeWidth="1.8" />
        <circle cx="702" cy="322" r="22" fill="#9B2C2C" />
        <path d="M694 322 L700 328 L712 315" stroke="#FFF1EE" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="738" y="316" fill="#7A1D1D" fontSize="16" fontWeight="800">
          {hi ? 'अधिकृत एवं सुरक्षित उपचार केंद्र' : 'Authorised Safe Treatment & Disposal'}
        </text>
        <text x="738" y="337" fill="#5B3832" fontSize="12.2">
          {hi ? 'वैधानिक नगर निकाय एवं प्रमाणित एजेंसी द्वारा उपचार' : 'Handled strictly via authorised civic & certified facilities'}
        </text>

        {/* Hard Scientific Warning Sub-panel */}
        <rect x="684" y="358" width="376" height="76" rx="12" fill="#FFFFFF" stroke="#E4B8A8" strokeWidth="1.2" />
        <text x="702" y="382" fill="#9B2C2C" fontSize="12.5" fontWeight="800">
          {hi ? 'कठोर पर्यावरणीय नियम:' : 'STRICT ENVIRONMENTAL GUARDRAIL:'}
        </text>
        <text x="702" y="402" fill="#4E342E" fontSize="12">
          {hi ? 'खतरनाक, सैनिटरी या विशेष कचरे को कभी भी सामान्य खाद' : 'Never mix hazardous, sanitary, or special-care waste into'}
        </text>
        <text x="702" y="420" fill="#4E342E" fontSize="12">
          {hi ? 'बनाने अथवा खुले में जलाने की प्रक्रिया में नहीं मिलाना है।' : 'compost piles or open-air burning under any circumstance.'}
        </text>
      </g>

      {/* Footer footnote */}
      <text x="40" y="482" fill="#5A6C5F" fontSize="11.5" fontWeight="600">
        {hi
          ? 'स्रोत: GOVEDA स्वच्छ भारत एवं प्लास्टिक-मुक्त अभियान मास्टर प्लान — 4-श्रेणी वैज्ञानिक कचरा प्रबंधन ढाँचा'
          : 'Source: GOVEDA Clean India & Plastic-Free Master Plan — 4-Stream Scientific Waste Governance'}
      </text>
    </svg>
  );
}

/* ============================================================================
   2. CLEAN VILLAGE + CLEAN CITY & CLOTH BAG REUSE LOOP SVG
   ============================================================================ */

export function CleanIndiaVillageCitySvg({ lang }: { lang: Language }) {
  const hi = lang === 'hi';
  return (
    <svg
      viewBox="0 0 1120 390"
      className="w-full h-auto block"
      role="img"
      aria-label={
        hi
          ? 'स्वच्छ ग्राम, स्वच्छ शहर और प्लास्टिक-मुक्त पुनः उपयोग चक्र'
          : 'Clean Village, Clean City and reusable cloth-bag plastic reduction ecosystem'
      }
    >
      <rect x="0" y="0" width="1120" height="390" rx="22" fill="#FAF9F4" />

      {/* Panel A: Clean Village (Swachh Gram) */}
      <rect x="30" y="28" width="335" height="332" rx="18" fill="#FFFFFF" stroke="#DCE6D3" strokeWidth="1.6" />
      <rect x="30" y="28" width="335" height="88" rx="18" fill="#EAF4E3" />
      {/* Minimal Modern Village Architectural Graphic */}
      <path d="M72 95 L98 73 L124 95 Z" fill="#C48E28" />
      <rect x="78" y="95" width="40" height="20" fill="#E6D6B8" />
      <path d="M132 95 L154 78 L176 95 Z" fill="#B57B20" />
      <rect x="137" y="95" width="34" height="20" fill="#F0E3CA" />
      <circle cx="215" cy="84" r="18" fill="#3D8232" />
      <rect x="212" y="96" width="6" height="19" fill="#6F4E29" />
      <ellipse cx="290" cy="105" rx="34" ry="9" fill="#6BAFD1" opacity="0.65" />

      <text x="52" y="146" fill="#144721" fontSize="17" fontWeight="800">
        {hi ? 'A. स्वच्छ ग्राम अभियान' : 'A. Clean Village Campaign'}
      </text>
      <text x="52" y="166" fill="#46604E" fontSize="12" fontWeight="600">
        {hi ? 'चयनित ग्राम पंचायत व स्थानीय प्रशासन के साथ' : 'With Gram Panchayats & local administration'}
      </text>

      {[
        hi ? '• गाँव की स्वच्छता समस्या व हॉटस्पॉट सर्वेक्षण' : '• Village sanitation & open-dump hotspot survey',
        hi ? '• घर-घर 4-श्रेणी कचरा पृथक्करण जागरूकता' : '• Door-to-door source segregation awareness',
        hi ? '• ग्राम स्वच्छता स्वयंसेवक एवं स्कूल शिक्षा' : '• Village volunteer network & school eco-clubs',
        hi ? '• तालाब, रास्ते व सार्वजनिक स्थलों की स्वच्छता' : '• Pond, lane & public commons cleanliness',
        hi ? '• संग्रहण व नियमित निगरानी हेतु पंचायत समन्वय' : '• Panchayat coordination & regular monitoring',
      ].map((line, i) => (
        <text key={line} x="52" y={198 + i * 28} fill="#2B4232" fontSize="12.5">
          {line}
        </text>
      ))}

      {/* Panel B: Center Circular Plastic-Free Bridge */}
      <rect x="392" y="28" width="336" height="332" rx="18" fill="#144721" />
      <text x="560" y="64" textAnchor="middle" fill="#D5F29E" fontSize="11.5" fontWeight="800" letterSpacing="1.5">
        {hi ? 'प्लास्टिक-मुक्त चक्रीय विकल्प' : 'PLASTIC-FREE REUSE CYCLE'}
      </text>

      {/* Circular Loop Graphic */}
      <circle cx="560" cy="172" r="74" fill="none" stroke="#629E43" strokeWidth="3" strokeDasharray="8 6" />
      <circle cx="560" cy="172" r="46" fill="#1E5D2D" />
      {/* Stylized Cloth Bag Icon inside center circle */}
      <rect x="541" y="158" width="38" height="34" rx="5" fill="#F6E9C9" />
      <path d="M550 158 C550 144, 570 144, 570 158" fill="none" stroke="#F6E9C9" strokeWidth="3.2" />
      <path d="M554 176 C557 170, 566 170, 567 178 C562 180, 557 180, 554 176 Z" fill="#2E7D32" />

      {/* 3 Orbit Nodes */}
      <circle cx="560" cy="98" r="10" fill="#E3B341" />
      <circle cx="624" cy="209" r="10" fill="#8BC94B" />
      <circle cx="496" cy="209" r="10" fill="#8BC94B" />

      <text x="560" y="274" textAnchor="middle" fill="#FFFFFF" fontSize="15.5" fontWeight="800">
        {hi ? 'बार-बार उपयोग = वास्तविक लाभ' : 'Repeated Reuse = Real Impact'}
      </text>
      <text x="560" y="298" textAnchor="middle" fill="#D4E8D7" fontSize="12">
        {hi ? 'महिला SHG के सूती व जूट थैले, आयोजनों में' : 'Women SHG cotton/jute bags, refill water,'}
      </text>
      <text x="560" y="317" textAnchor="middle" fill="#D4E8D7" fontSize="12">
        {hi ? 'रिफिल पानी व पुनः उपयोग योग्य बर्तन तथा' : 'reusable event utensils & voluntary'}
      </text>
      <text x="560" y="336" textAnchor="middle" fill="#D5F29E" fontSize="12" fontWeight="700">
        {hi ? 'बाजारों में स्वैच्छिक Plastic Reduction Pledge' : 'market Plastic Reduction Pledge'}
      </text>

      {/* Panel C: Clean City (Swachh Shahar) */}
      <rect x="755" y="28" width="335" height="332" rx="18" fill="#FFFFFF" stroke="#D5E3EB" strokeWidth="1.6" />
      <rect x="755" y="28" width="335" height="88" rx="18" fill="#EAF3F8" />
      {/* Minimal Modern Rajasthan Town Skyline */}
      <rect x="795" y="76" width="36" height="39" rx="3" fill="#D9C3A3" />
      <rect x="838" y="64" width="44" height="51" rx="3" fill="#C9AE87" />
      <path d="M846 64 Q860 50 874 64 Z" fill="#B57B20" />
      <rect x="890" y="78" width="42" height="37" rx="3" fill="#E3D2B6" />
      <rect x="964" y="88" width="18" height="27" rx="3" fill="#2E7D32" />
      <rect x="986" y="88" width="18" height="27" rx="3" fill="#D19A24" />
      <rect x="1008" y="88" width="18" height="27" rx="3" fill="#1D6FA3" />

      <text x="777" y="146" fill="#124769" fontSize="17" fontWeight="800">
        {hi ? 'B. स्वच्छ शहर अभियान' : 'B. Clean City Campaign'}
      </text>
      <text x="777" y="166" fill="#465D6D" fontSize="12" fontWeight="600">
        {hi ? 'नगर निगम, नगर परिषद व नगर पालिका सहयोग से' : 'Supporting Municipal Corporations & Councils'}
      </text>

      {[
        hi ? '• बाजार व सार्वजनिक स्थलों पर जागरूकता अभियान' : '• Market & public-space cleanliness drives',
        hi ? '• दुकानदारों हेतु स्रोत पृथक्करण प्रशिक्षण' : '• Shopkeeper waste segregation training',
        hi ? '• होटल, रेस्टोरेंट व सब्जी मंडी जैविक कचरा मार्गदर्शन' : '• Hotel, restaurant & mandi organic waste guide',
        hi ? '• प्लास्टिक संग्रहण हेतु अधिकृत एजेंसियों से संपर्क' : '• Authorised plastic recycling agency linkage',
        hi ? '• संवेदनशील कचरा बिंदु पहचान व नागरिक सहभागिता' : '• Litter hotspot mapping & civic participation',
      ].map((line, i) => (
        <text key={line} x="777" y={198 + i * 28} fill="#2B3F4E" fontSize="12.5">
          {line}
        </text>
      ))}
    </svg>
  );
}

/* ============================================================================
   3. ORGANIC FARMING — LIVING SOIL & WATER-SMART FARM CUTAWAY SVG
   ============================================================================ */

export function OrganicSoilCutawaySvg({ lang }: { lang: Language }) {
  const hi = lang === 'hi';
  return (
    <svg
      viewBox="0 0 1120 500"
      className="w-full h-auto block"
      role="img"
      aria-label={
        hi
          ? 'जीवित मिट्टी, जैविक कार्बन बनाम जैविक पदार्थ, वर्षा जल संचयन और ड्रिप सिंचाई का वैज्ञानिक चित्र'
          : 'Living soil cross-section showing organic carbon vs organic matter, rainwater kund, drip irrigation and vermicompost'
      }
    >
      <defs>
        <linearGradient id="farmSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFF7EC" />
          <stop offset="100%" stopColor="#FAF6E6" />
        </linearGradient>
        <linearGradient id="soilTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6E4725" />
          <stop offset="100%" stopColor="#4A2E16" />
        </linearGradient>
        <linearGradient id="soilSub" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A5E35" />
          <stop offset="100%" stopColor="#B08456" />
        </linearGradient>
      </defs>

      {/* Sky Backdrop */}
      <rect x="0" y="0" width="1120" height="255" rx="22" fill="url(#farmSky)" />
      {/* Sun */}
      <circle cx="990" cy="68" r="32" fill="#F4C753" opacity="0.88" />
      <circle cx="990" cy="68" r="46" fill="#F4C753" opacity="0.22" />

      {/* Aravalli Distant Ridge */}
      <path d="M0 205 Q180 128 380 185 T780 165 T1120 198 L1120 255 L0 255 Z" fill="#C9DBBC" />
      <path d="M0 225 Q260 172 540 212 T1120 202 L1120 255 L0 255 Z" fill="#9BC279" />

      {/* Left Agroforestry Tree */}
      <rect x="92" y="138" width="14" height="92" rx="4" fill="#6F4A26" />
      <circle cx="99" cy="116" r="40" fill="#2E6F2B" />
      <circle cx="72" cy="134" r="26" fill="#468D34" />
      <circle cx="126" cy="132" r="27" fill="#3B7E2D" />

      {/* Vermicompost Shaded Bed (Left-mid) */}
      <rect x="195" y="182" width="136" height="46" rx="8" fill="#8C5B2E" stroke="#5A3718" strokeWidth="2" />
      <path d="M203 182 Q263 158 323 182 Z" fill="#4E3118" />
      <line x1="195" y1="198" x2="331" y2="198" stroke="#6E441F" strokeWidth="2" />
      <line x1="195" y1="214" x2="331" y2="214" stroke="#6E441F" strokeWidth="2" />

      {/* Diverse Crop Rows + Mulching + Drip Line (Center) */}
      {[390, 445, 500, 555, 610, 665].map((x, idx) => (
        <g key={x}>
          <path d={`M${x} 238 L${x} ${188 - (idx % 2) * 14}`} stroke="#2C6E28" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx={x - 9} cy={204 - (idx % 2) * 10} rx="10" ry="5" fill="#5EA336" transform={`rotate(-25 ${x - 9} ${204 - (idx % 2) * 10})`} />
          <ellipse cx={x + 9} cy={196 - (idx % 2) * 10} rx="10" ry="5" fill="#42892C" transform={`rotate(25 ${x + 9} ${196 - (idx % 2) * 10})`} />
          <circle cx={x} cy={184 - (idx % 2) * 14} r="5" fill={idx % 2 === 0 ? '#E3A42B' : '#D44B34'} />
          {/* Drip water drops */}
          <circle cx={x + 12} cy={244} r="3" fill="#2E8BC0" />
        </g>
      ))}
      {/* Drip Pipe */}
      <line x1="370" y1="238" x2="740" y2="238" stroke="#1E3A4C" strokeWidth="4" strokeLinecap="round" />

      {/* Rainwater Farm Kund / Pond (Right) */}
      <path d="M785 208 L945 208 L930 245 L800 245 Z" fill="#C4B294" stroke="#8C7B60" strokeWidth="2" />
      <ellipse cx="865" cy="212" rx="70" ry="12" fill="#4EA2CE" />
      <path d="M740 238 L795 220" stroke="#2E8BC0" strokeWidth="3" strokeDasharray="5 3" />

      {/* Straw Mulch Band */}
      <rect x="0" y="245" width="1120" height="16" fill="#D5B25C" />

      {/* UNDERGROUND CUTAWAY: TOPSOIL + LIVING RHIZOSPHERE */}
      <rect x="0" y="261" width="1120" height="122" fill="url(#soilTop)" />
      {/* Subsoil Aquifer Layer */}
      <path d="M0 383 L1120 383 L1120 478 Q1120 500 1098 500 L22 500 Q0 500 0 478 Z" fill="url(#soilSub)" />

      {/* Roots & Mycorrhizal Web */}
      {[390, 445, 500, 555, 610, 665].map((x) => (
        <g key={`root-${x}`} stroke="#E7D4AF" strokeWidth="1.8" fill="none" opacity="0.85">
          <path d={`M${x} 261 C${x - 6} 290, ${x - 22} 312, ${x - 30} 348`} />
          <path d={`M${x} 261 C${x + 4} 295, ${x + 18} 320, ${x + 26} 355`} />
          <path d={`M${x} 276 C${x - 12} 302, ${x - 4} 336, ${x - 6} 366`} />
        </g>
      ))}

      {/* Earthworms & Beneficial Soil Microbes */}
      <path d="M250 318 C264 308, 280 328, 296 314" stroke="#E89A78" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M712 332 C726 322, 742 340, 758 326" stroke="#E89A78" strokeWidth="5" strokeLinecap="round" fill="none" />
      {[210, 310, 430, 520, 640, 770].map((mx) => (
        <circle key={`m-${mx}`} cx={mx} cy={302 + ((mx * 7) % 44)} r="4" fill="#A6DB6C" opacity="0.85" />
      ))}

      {/* Clean Callout Badges Above Ground */}
      <g>
        <rect x="34" y="24" width="218" height="52" rx="12" fill="#FFFFFF" stroke="#D9D0BA" />
        <text x="48" y="45" fill="#144721" fontSize="12.5" fontWeight="800">
          {hi ? 'कृषि वानिकी एवं वर्मीकम्पोस्ट' : 'Agroforestry & Vermicompost'}
        </text>
        <text x="48" y="63" fill="#465C4E" fontSize="11">
          {hi ? 'गौशाला गोबर खाद व देशी छाया वृक्ष' : 'Gaushala compost & native border trees'}
        </text>

        <rect x="414" y="24" width="268" height="52" rx="12" fill="#FFFFFF" stroke="#D9D0BA" />
        <text x="428" y="45" fill="#144721" fontSize="12.5" fontWeight="800">
          {hi ? 'फसल विविधीकरण, मल्चिंग व ड्रिप' : 'Crop Diversity, Mulching & Drip'}
        </text>
        <text x="428" y="63" fill="#465C4E" fontSize="11">
          {hi ? 'कम पानी में अधिक नमी व मृदा सुरक्षा' : 'Moisture retention & precision irrigation'}
        </text>

        <rect x="742" y="24" width="206" height="52" rx="12" fill="#FFFFFF" stroke="#D9D0BA" />
        <text x="756" y="45" fill="#124769" fontSize="12.5" fontWeight="800">
          {hi ? 'वर्षा जल संचयन व जल बजट' : 'Rainwater Pond & Water Budget'}
        </text>
        <text x="756" y="63" fill="#435866" fontSize="11">
          {hi ? 'खेत ढलान अनुसार जल प्रबंधन' : 'Slope-based farm water capture'}
        </text>
      </g>

      {/* UNDERGROUND EXPLANATORY CARDS: SOC vs SOM + 6 SOIL LAB METRICS */}
      <rect x="34" y="398" width="490" height="84" rx="14" fill="#FCFBF6" stroke="#DFD5BC" strokeWidth="1.5" />
      <text x="52" y="422" fill="#144721" fontSize="13.5" fontWeight="800">
        {hi ? 'जैविक कार्बन (SOC) बनाम जैविक पदार्थ (SOM) — वैज्ञानिक अंतर' : 'Soil Organic Carbon (SOC) vs Soil Organic Matter (SOM)'}
      </text>
      <text x="52" y="443" fill="#374C3D" fontSize="11.8">
        {hi ? 'जैविक पदार्थ (SOM) में पादप-पशु अवशेष व सूक्ष्मजीव सभी शामिल हैं; जबकि' : 'Organic Matter (SOM) includes all living & decomposing plant/microbial'}
      </text>
      <text x="52" y="462" fill="#374C3D" fontSize="11.8">
        {hi ? 'जैविक कार्बन (SOC) उसका मुख्य कार्बन अंश (~58%) है जो मृदा उर्वरता मापता है।' : 'material; Organic Carbon (SOC) is its measurable carbon core (~58%).'}
      </text>

      <rect x="546" y="398" width="540" height="84" rx="14" fill="#144721" />
      <text x="566" y="422" fill="#D5F29E" fontSize="13.2" fontWeight="800">
        {hi ? 'मान्यता प्राप्त प्रयोगशाला में 6 मृदा जाँच मानक (Soil Health Lab)' : '6 Accredited Laboratory Soil Health Parameters'}
      </text>
      <text x="566" y="444" fill="#FFFFFF" fontSize="12">
        {hi
          ? '1. मिट्टी pH   ·   2. विद्युत चालकता (EC)   ·   3. उपलब्ध नाइट्रोजन, फॉस्फोरस, पोटाश (NPK)'
          : '1. Soil pH   ·   2. Electrical Conductivity (EC)   ·   3. Available N-P-K'}
      </text>
      <text x="566" y="465" fill="#D8EBD9" fontSize="12">
        {hi
          ? '4. जैविक कार्बन (SOC)   ·   5. आवश्यक सूक्ष्म पोषक तत्व   ·   6. फसल अनुसार पोषण प्रबंधन'
          : '4. Organic Carbon (SOC)   ·   5. Essential Micronutrients   ·   6. Crop-Specific Nutrition'}
      </text>
    </svg>
  );
}

/* ============================================================================
   4. ORGANIC VS NATURAL FARMING + 4-PLOT COMPARATIVE TRIAL SVG (PDF 3.2 & 3.3C)
   ============================================================================ */

export function OrganicComparisonTrialSvg({ lang }: { lang: Language }) {
  const hi = lang === 'hi';
  return (
    <svg
      viewBox="0 0 1120 420"
      className="w-full h-auto block"
      role="img"
      aria-label={
        hi
          ? 'प्राकृतिक खेती बनाम जैविक खेती का अंतर एवं 4-प्लॉट तुलनात्मक प्रदर्शन खेत मॉडल'
          : 'Distinction between Natural Farming and Organic Farming alongside 4-plot comparative field trial'
      }
    >
      <rect x="0" y="0" width="1120" height="420" rx="22" fill="#FAF9F4" />

      {/* LEFT SIDE: NATURAL VS ORGANIC DISTINCTION */}
      <text x="36" y="38" fill="#144721" fontSize="13" fontWeight="800" letterSpacing="1.4">
        {hi ? 'दोनों पद्धतियों में स्पष्ट अंतर (एक नहीं हैं)' : 'DISTINCT METHODS · NEVER CONFLATED'}
      </text>

      {/* Natural Farming Box */}
      <rect x="36" y="54" width="490" height="154" rx="16" fill="#FFFFFF" stroke="#C8DDBB" strokeWidth="1.6" />
      <circle cx="76" cy="96" r="22" fill="#E9F5E1" />
      <path d="M68 104 C68 88, 84 84, 88 96 C80 99, 75 104, 68 104 Z" fill="#2E7D32" />
      <text x="112" y="92" fill="#144721" fontSize="17" fontWeight="800">
        {hi ? 'प्राकृतिक खेती (Natural Farming)' : 'Natural Farming'}
      </text>
      <text x="112" y="112" fill="#2E7D32" fontSize="12" fontWeight="700">
        {hi ? 'स्थानीय पारिस्थितिक प्रक्रिया आधारित दृष्टिकोण' : 'Local Ecological Process-Based Approach'}
      </text>
      <text x="56" y="142" fill="#354B3C" fontSize="12.5">
        {hi ? '• खेत के स्थानीय जैविक संसाधनों, मल्चिंग और फसल विविधता का उपयोग' : '• Uses on-farm local bio-resources, mulching & multi-cropping'}
      </text>
      <text x="56" y="166" fill="#354B3C" fontSize="12.5">
        {hi ? '• जीवामृत, बीजामृत एवं स्थानीय सूक्ष्मजीव संवर्धन पर जोर' : '• Focuses on Jeevamrit, Beejamrit & native soil biology'}
      </text>
      <text x="56" y="190" fill="#354B3C" fontSize="12.5">
        {hi ? '• बाहरी खरीदे गए आदानों पर न्यूनतम निर्भरता' : '• Minimises dependency on externally purchased farm inputs'}
      </text>

      {/* Organic Farming Box */}
      <rect x="36" y="226" width="490" height="154" rx="16" fill="#FFFFFF" stroke="#E0D2B2" strokeWidth="1.6" />
      <circle cx="76" cy="268" r="22" fill="#FAF2DC" />
      <rect x="65" y="257" width="22" height="22" rx="5" fill="none" stroke="#B57D1E" strokeWidth="2.4" />
      <path d="M71 268 L75 272 L83 263" fill="none" stroke="#B57D1E" strokeWidth="2.4" strokeLinecap="round" />
      <text x="112" y="264" fill="#63420A" fontSize="17" fontWeight="800">
        {hi ? 'जैविक खेती (Organic Farming)' : 'Organic Farming'}
      </text>
      <text x="112" y="284" fill="#A67118" fontSize="12" fontWeight="700">
        {hi ? 'निर्धारित मानक एवं प्रमाणीकरण आधारित प्रणाली' : 'Standards-Based & Certifiable Farming System'}
      </text>
      <text x="56" y="314" fill="#463E2F" fontSize="12.5">
        {hi ? '• निर्धारित जैविक मानकों के अनुसार अनुमत खाद व बायो-इनपुट का उपयोग' : '• Uses permitted inputs under formal organic standards'}
      </text>
      <text x="56" y="338" fill="#463E2F" fontSize="12.5">
        {hi ? '• वैज्ञानिक मिट्टी प्रबंधन, कम्पोस्ट व जैविक कीट नियंत्रण प्रोटोकॉल' : '• Structured soil management, quality compost & bio-pest control'}
      </text>
      <text x="56" y="362" fill="#463E2F" fontSize="12.5">
        {hi ? '• आवश्यकतानुसार आधिकारिक जैविक प्रमाणन (NPOP / PGS-India) प्रक्रिया' : '• Supports formal certification (NPOP / PGS-India) where required'}
      </text>

      {/* RIGHT SIDE: 4-PLOT COMPARATIVE DEMONSTRATION FIELD */}
      <text x="562" y="38" fill="#144721" fontSize="13" fontWeight="800" letterSpacing="1.4">
        {hi ? 'किसान प्रदर्शन खेत · 4-प्लॉट तुलनात्मक परीक्षण' : 'DEMONSTRATION FARM · 4-PLOT SCIENTIFIC TRIAL'}
      </text>

      <rect x="562" y="54" width="522" height="326" rx="18" fill="#FFFFFF" stroke="#DCE3D6" strokeWidth="1.6" />

      {/* 2x2 Comparative Farm Grid */}
      {[
        { x: 584, y: 76, bg: '#F4F2EC', border: '#D7D0BE', tag: 'PLOT 01', hiT: 'वर्तमान खेती पद्धति', enT: 'Farmer Current Practice', hiS: 'आधारभूत तुलना (Baseline)', enS: 'Baseline benchmark plot' },
        { x: 842, y: 76, bg: '#EEF6E8', border: '#BDD7B0', tag: 'PLOT 02', hiT: 'उपयुक्त जैविक पद्धति', enT: 'Suitable Organic Method', hiS: 'मानक कम्पोस्ट व बायो-इनपुट', enS: 'Standard compost & bio-inputs' },
        { x: 584, y: 186, bg: '#F6F3E4', border: '#DFD2A6', tag: 'PLOT 03', hiT: 'प्राकृतिक खेती पद्धति', enT: 'Natural Farming Method', hiS: 'मल्चिंग, जीवामृत व बहुफसल', enS: 'Mulching, Jeevamrit & diversity' },
        { x: 842, y: 186, bg: '#ECF4F8', border: '#B8D4E3', tag: 'PLOT 04', hiT: 'समेकित पोषण व कीट प्रबंधन', enT: 'Integrated Nutrient & Pest', hiS: 'कृषि वैज्ञानिक सलाह अनुसार', enS: 'Agronomist-guided INM / IPM' },
      ].map((p) => (
        <g key={p.tag}>
          <rect x={p.x} y={p.y} width="222" height="94" rx="14" fill={p.bg} stroke={p.border} strokeWidth="1.4" />
          <text x={p.x + 16} y={p.y + 24} fill="#5C6C5F" fontSize="10.5" fontWeight="800" letterSpacing="1">
            {p.tag}
          </text>
          <text x={p.x + 16} y={p.y + 49} fill="#144721" fontSize="14" fontWeight="800">
            {hi ? p.hiT : p.enT}
          </text>
          <text x={p.x + 16} y={p.y + 72} fill="#44584B" fontSize="11.5">
            {hi ? p.hiS : p.enS}
          </text>
        </g>
      ))}

      {/* Comparative Measurement Footer Bar */}
      <rect x="584" y="298" width="480" height="62" rx="12" fill="#144721" />
      <text x="602" y="323" fill="#D5F29E" fontSize="12" fontWeight="800">
        {hi ? 'प्रत्येक प्लॉट का पारदर्शी तुलनात्मक रिकॉर्ड:' : 'MEASURED ACROSS ALL FOUR PLOTS:'}
      </text>
      <text x="602" y="344" fill="#FFFFFF" fontSize="12">
        {hi
          ? 'खेती लागत  ·  प्रति हेक्टेयर उत्पादन  ·  पानी की खपत  ·  श्रम  ·  शुद्ध लाभ'
          : 'Total Cost  ·  Yield / Ha  ·  Irrigation Water  ·  Labour  ·  Net Income'}
      </text>
    </svg>
  );
}

/* ============================================================================
   5. CLEAN ENERGY — INTEGRATED SOLAR, BIOGAS & CBG ECOSYSTEM SVG (PDF PART 4)
   ============================================================================ */

export function CleanEnergyEcosystemSvg({ lang }: { lang: Language }) {
  const hi = lang === 'hi';
  return (
    <svg
      viewBox="0 0 1120 500"
      className="w-full h-auto block"
      role="img"
      aria-label={
        hi
          ? 'सौर ऊर्जा, बायोगैस डाइजेस्टर, CBG शुद्धिकरण और 6 वैज्ञानिक सुरक्षा मानकों का एकीकृत चित्र'
          : 'Integrated rural Solar, Biogas digester, CBG purification and 6 scientific safeguards architectural diagram'
      }
    >
      <rect x="0" y="0" width="1120" height="500" rx="22" fill="#FAF9F4" />

      {/* TOP-LEFT TRACK: SOLAR ENERGY */}
      <rect x="32" y="28" width="330" height="270" rx="18" fill="#FFFFFF" stroke="#E5D9B5" strokeWidth="1.6" />
      <rect x="32" y="28" width="330" height="118" rx="18" fill="#FDF6E2" />
      {/* Sun + Solar Roof Graphic */}
      <circle cx="94" cy="70" r="22" fill="#EFA924" />
      <path d="M148 118 L206 78 L264 118 Z" fill="#C48E28" />
      <polygon points="164,107 206,78 248,107" fill="#1E527D" />
      <line x1="184" y1="93" x2="228" y2="93" stroke="#7CC0EA" strokeWidth="1.5" />
      <line x1="206" y1="78" x2="206" y2="107" stroke="#7CC0EA" strokeWidth="1.5" />
      <rect x="160" y="118" width="92" height="28" fill="#E8DCC3" />

      <text x="54" y="176" fill="#7D4F09" fontSize="17" fontWeight="800">
        {hi ? '1. ग्रामीण एवं संस्थागत सौर ऊर्जा' : '1. Rural & Institutional Solar'}
      </text>
      {[
        hi ? '• छतों पर सोलर लगाने की तकनीकी जानकारी' : '• Rooftop solar technical orientation',
        hi ? '• ग्रामीण व संस्थागत ऊर्जा बचत कार्यक्रम' : '• Rural & campus energy-saving drives',
        hi ? '• सामुदायिक सोलर परियोजना व्यवहार्यता' : '• Community solar feasibility assessment',
      ].map((t, i) => (
        <text key={t} x="54" y={206 + i * 26} fill="#463E2E" fontSize="12.5">
          {t}
        </text>
      ))}

      {/* CENTER TRACK: BIOGAS DIGESTER */}
      <rect x="386" y="28" width="348" height="270" rx="18" fill="#FFFFFF" stroke="#C5DCB9" strokeWidth="1.6" />
      <rect x="386" y="28" width="348" height="118" rx="18" fill="#EAF4E5" />
      {/* Anaerobic Digester Dome Cutaway */}
      <rect x="430" y="96" width="34" height="34" rx="4" fill="#8C5B2E" />
      <path d="M464 114 L492 114" stroke="#6E4725" strokeWidth="6" />
      <path d="M492 134 L492 94 A68 44 0 0 1 628 94 L628 134 Z" fill="#2E6F36" />
      <path d="M500 132 L500 108 Q560 100 620 108 L620 132 Z" fill="#7B5229" />
      <text x="560" y="93" textAnchor="middle" fill="#E7F9C5" fontSize="11" fontWeight="800">
        CH₄ + CO₂
      </text>
      <path d="M560 50 L560 66" stroke="#144721" strokeWidth="3" />
      <path d="M628 118 L664 118" stroke="#5E8F36" strokeWidth="6" />
      <rect x="664" y="102" width="36" height="28" rx="4" fill="#5E8F36" />

      <text x="408" y="176" fill="#144721" fontSize="17" fontWeight="800">
        {hi ? '2. बायोगैस (घरेलू, सामुदायिक व गौशाला)' : '2. Domestic, Community & Gaushala Biogas'}
      </text>
      {[
        hi ? '• गोबर व उपयुक्त जैविक कचरे से ऑक्सीजन-रहित गैस' : '• Anaerobic digestion of dung & suitable organics',
        hi ? '• धुआँ-रहित रसोई गैस व स्थानीय तापीय उपयोग' : '• Smokeless kitchen fuel & rural thermal energy',
        hi ? '• पोषक तत्वों से भरपूर उपचारित जैव-स्लरी खाद' : '• Nutrient-rich treated bio-slurry returned to farms',
      ].map((t, i) => (
        <text key={t} x="408" y={206 + i * 26} fill="#314838" fontSize="12.5">
          {t}
        </text>
      ))}

      {/* Arrow from Biogas to CBG */}
      <path d="M734 118 L754 118" stroke="#1D6FA3" strokeWidth="3.5" />
      <polygon points="750,111 762,118 750,125" fill="#1D6FA3" />

      {/* RIGHT TRACK: CBG (COMPRESSED BIOGAS) */}
      <rect x="760" y="28" width="328" height="270" rx="18" fill="#FFFFFF" stroke="#BDD6E8" strokeWidth="1.6" />
      <rect x="760" y="28" width="328" height="118" rx="18" fill="#EAF4FA" />
      {/* CBG Scrubber & Cascade Cylinders */}
      <rect x="810" y="56" width="36" height="76" rx="8" fill="#1D6FA3" />
      <line x1="846" y1="90" x2="878" y2="90" stroke="#1D6FA3" strokeWidth="3.5" />
      <rect x="880" y="64" width="22" height="68" rx="11" fill="#2B7A3D" />
      <rect x="908" y="64" width="22" height="68" rx="11" fill="#2B7A3D" />
      <rect x="936" y="64" width="22" height="68" rx="11" fill="#2B7A3D" />
      <rect x="984" y="74" width="66" height="46" rx="8" fill="#FFFFFF" stroke="#1D6FA3" strokeWidth="1.6" />
      <text x="1017" y="96" textAnchor="middle" fill="#124769" fontSize="11.5" fontWeight="800">CBG</text>
      <text x="1017" y="111" textAnchor="middle" fill="#3B5D73" fontSize="9.5">≥90% CH₄</text>

      <text x="782" y="176" fill="#124769" fontSize="17" fontWeight="800">
        {hi ? '3. कॉम्प्रेस्ड बायोगैस (CBG)' : '3. Compressed Biogas (CBG)'}
      </text>
      {[
        hi ? '• फीडस्टॉक सर्वेक्षण, परिवहन लागत व लॉजिस्टिक्स' : '• Feedstock survey, supply & transport logistics',
        hi ? '• तकनीकी-वित्तीय व्यवहार्यता व गैस शुद्धिकरण' : '• Technical-financial DPR & gas purification',
        hi ? '• डाइजेस्टेट प्रबंधन, ऑफटेक व निवेशक साझेदारी' : '• Digestate care, offtake & technical partners',
      ].map((t, i) => (
        <text key={t} x="782" y={206 + i * 26} fill="#304859" fontSize="12.5">
          {t}
        </text>
      ))}

      {/* BOTTOM BAND: 6 SCIENTIFIC BIOGAS SAFEGUARDS (PDF 4.4) */}
      <rect x="32" y="320" width="1056" height="152" rx="18" fill="#134420" />
      <text x="56" y="352" fill="#D5F29E" fontSize="13.5" fontWeight="800" letterSpacing="1.2">
        {hi
          ? 'वैज्ञानिक सावधानियाँ — बायोगैस तभी पर्यावरण हेतु लाभकारी है जब ये 6 मानक पूरे हों:'
          : '6 SCIENTIFIC SAFEGUARDS — BIOGAS DELIVERS CLIMATE BENEFIT ONLY WHEN ALL 6 ARE MET:'}
      </text>

      {[
        { n: '01', hi: 'उपयुक्त फीडस्टॉक', en: 'Suitable Feedstock' },
        { n: '02', hi: 'सही संयंत्र संचालन', en: 'Proper Operation' },
        { n: '03', hi: 'मीथेन रिसाव नियंत्रण', en: 'Methane Leak Control' },
        { n: '04', hi: 'सुरक्षित स्लरी प्रबंधन', en: 'Safe Slurry Handling' },
        { n: '05', hi: 'सुनिश्चित गैस उपयोग', en: 'Assured Gas Use' },
        { n: '06', hi: 'वास्तविक उत्सर्जन आकलन', en: 'Real Emissions Audit' },
      ].map((s, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const bx = 56 + col * 344;
        const by = 370 + row * 44;
        return (
          <g key={s.n}>
            <rect x={bx} y={by} width="324" height="34" rx="9" fill="#1E5A2E" stroke="#397D49" strokeWidth="1" />
            <text x={bx + 14} y={by + 21} fill="#F2C85B" fontSize="12" fontWeight="800">
              {s.n}
            </text>
            <text x={bx + 42} y={by + 21} fill="#FFFFFF" fontSize="12.8" fontWeight="700">
              {hi ? s.hi : s.en}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
