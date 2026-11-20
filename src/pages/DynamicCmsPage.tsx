import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen, FileText, ShieldCheck } from 'lucide-react';
import { SpringButton } from '../components/SpringMotion';
import { usePublicPortal } from '../context/PublicPortalContext';
import type { StaticPageRecord } from '../admin/types';
import type { Language } from '../types/goveda';

interface DynamicCmsPageProps {
  page: StaticPageRecord;
  lang: Language;
  onNavigate: (path: string) => void;
}

export function DynamicCmsPage({ page, lang, onNavigate }: DynamicCmsPageProps) {
  const { bootstrap } = usePublicPortal();
  const title = lang === 'hi' ? page.titleHi || page.titleEn : page.titleEn || page.titleHi;
  const summary =
    lang === 'hi' ? page.summaryHi || page.summaryEn : page.summaryEn || page.summaryHi;
  const body = lang === 'hi' ? page.bodyHi || page.bodyEn : page.bodyEn || page.bodyHi;
  const paragraphs = body
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const relatedPages = (bootstrap?.staticPages ?? []).filter(
    (p) => p.status === 'Published' && p.id !== page.id
  );

  const ctaPath = page.linkedFormType ? `/join/${page.linkedFormType}` : '/join';

  return (
    <div className="bg-[#FAFBF8] min-h-[70vh] text-[#14291C]">
      {/* Top Editorial Banner */}
      <section className="bg-gradient-to-b from-[#EDF6EE] via-[#F6FAF5] to-[#FAFBF8] border-b border-[#DCE7DE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#4C6556]">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1 font-semibold text-[#144527] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}</span>
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-medium">{page.parentPath || 'GOVEDA Resource'}</span>
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2E7D32]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {lang === 'hi'
                  ? 'आधिकारिक प्रकाशित मार्गदर्शिका'
                  : 'Official Published Guide'}
              </span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#113B19] tracking-tight leading-tight">
              {title}
            </h1>
            {summary && (
              <p className="text-sm sm:text-base text-[#3D5245] leading-relaxed max-w-3xl">
                {summary}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Article Body + Action Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <article className="lg:col-span-8 bg-white rounded-3xl border border-[#DCE7DE] p-6 sm:p-8 shadow-xs space-y-5">
          {paragraphs.length > 0 ? (
            paragraphs.map((para, idx) => (
              <p
                key={idx}
                className="text-sm sm:text-[15px] text-[#223529] leading-relaxed"
              >
                {para}
              </p>
            ))
          ) : (
            <p className="text-sm text-[#4C6556] leading-relaxed">
              {summary ||
                (lang === 'hi'
                  ? 'इस पृष्ठ का विस्तृत विवरण शीघ्र ही अपडेट किया जाएगा।'
                  : 'Detailed documentation for this resource is published through the GOVEDA Knowledge Desk.')}
            </p>
          )}

          <div className="pt-5 border-t border-[#E8EFE9] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#4C6556]">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>
                {lang === 'hi'
                  ? 'GOVEDA कार्बन एंड क्लाइमेट इंडिया फाउंडेशन द्वारा प्रकाशित'
                  : 'Published by GOVEDA Carbon & Climate India Foundation'}
              </span>
            </div>
            <SpringButton variant="primary" size="md" onClick={() => onNavigate(ctaPath)}>
              <span>{page.ctaLabel || (lang === 'hi' ? 'अभियान से जुड़ें' : 'Join Mission')}</span>
              <ArrowRight className="w-4 h-4" />
            </SpringButton>
          </div>
        </article>

        {/* Sidebar: Participation CTA + Related Published Guides */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-3xl border border-[#DCE7DE] p-5 space-y-3">
            <h2 className="text-sm font-bold text-[#144527]">
              {lang === 'hi' ? 'इस पहल में भागीदारी करें' : 'Participate in This Initiative'}
            </h2>
            <p className="text-xs text-[#4C6556] leading-relaxed">
              {lang === 'hi'
                ? 'यदि आप अपने गाँव, विद्यालय, बाजार या संस्था में यह कार्यक्रम शुरू करना चाहते हैं तो समर्पित फॉर्म भरें।'
                : 'Register your village, campus, market, SHG, or organisation through our structured onboarding form.'}
            </p>
            <SpringButton
              variant="soft"
              size="sm"
              className="w-full justify-center"
              onClick={() => onNavigate(ctaPath)}
            >
              <span>{page.ctaLabel || (lang === 'hi' ? 'पंजीकरण फॉर्म खोलें' : 'Open Registration Form')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </SpringButton>
          </div>

          {relatedPages.length > 0 && (
            <div className="bg-white rounded-3xl border border-[#DCE7DE] p-5 space-y-3">
              <h2 className="text-sm font-bold text-[#144527]">
                {lang === 'hi' ? 'अन्य प्रकाशित दिशानिर्देश' : 'More Published Guides'}
              </h2>
              <div className="space-y-2">
                {relatedPages.slice(0, 5).map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onNavigate(`/pages/${rel.slug}`)}
                    className="w-full text-left p-3 rounded-2xl bg-[#F6FAF6] hover:bg-[#EAF4EC] border border-[#E2ECE4] transition-colors cursor-pointer flex items-start gap-2.5"
                  >
                    <FileText className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#144527] leading-snug">
                        {lang === 'hi' ? rel.titleHi || rel.titleEn : rel.titleEn}
                      </p>
                      <p className="text-[11px] text-[#55685C] truncate mt-0.5">
                        {rel.parentPath}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
