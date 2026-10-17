import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HOME_FEATURES,
  HOW_IT_WORKS_STEPS,
  HERO_QUICK_FEATURES,
  HERO_SAMPLE_RESULT,
} from '../data/mockData.js'

const FEATURE_ICONS = {
  scan: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M4 7V5a1 1 0 011-1h2M4 17v2a1 1 0 001 1h2M20 7V5a1 1 0 00-1-1h-2M20 17v2a1 1 0 01-1 1h-2M4 12h16"
    />
  ),
  shield: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
    />
  ),
  flag: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M5 3v18M5 4h11l-2 3.5L16 11H5"
    />
  ),
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M17 20h5v-1a4 4 0 00-3-3.87M9 20H4v-1a4 4 0 013-3.87m5-4a4 4 0 100-8 4 4 0 000 8zm7 0a4 4 0 10-1.13-7.84"
    />
  ),
  bolt: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M13 3L4 14h6l-1 7 9-11h-6l1-7z"
    />
  ),
  download: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14"
    />
  ),
}

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-50 via-white to-white">
        <div className="section grid grid-cols-1 items-center gap-14 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="pill-badge">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M10 2l1.9 5.8H18l-4.9 3.6 1.9 5.8L10 13.6l-4.9 3.6 1.9-5.8L2 7.8h6.1L10 2z" />
              </svg>
              AI-Powered Verification Engine
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              <span className="block text-navy-900">Check Compliance.</span>
              <span className="block text-emerald-600">Build Trust.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-500">
              Scan any packaged commodity and instantly verify compliance with the
              Legal Metrology (Packaged Commodities) Rules, 2011 — no manual
              checklists required.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/checker" className="btn-solid-saffron px-6 py-3 text-base">
                Start Scanning
              </Link>
              <Link to="/how-it-works" className="btn-outline-navy px-6 py-3 text-base">
                See How It Works
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-2">
              {HERO_QUICK_FEATURES.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                      {FEATURE_ICONS[feature.icon]}
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{feature.title}</p>
                    <p className="text-xs leading-snug text-navy-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <HeroSampleCard />
        </div>
      </section>

      {/* FEATURES */}
      <section className="section py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-navy-900">Why Compliance Checker?</h2>
          <p className="mt-3 text-navy-500">
            One system that brings AI accuracy to a rule book that used to require manual, page-by-page review.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_FEATURES.map((feature) => (
            <div key={feature.title} className="card">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                  {FEATURE_ICONS[feature.icon]}
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-navy-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS PREVIEW */}
      <section className="bg-navy-50 py-20">
        <div className="section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-extrabold text-navy-900">How It Works</h2>
            <Link to="/how-it-works" className="text-sm font-semibold text-navy-700 hover:text-saffron-600">
              View full process →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div key={step.step} className="card">
                <p className="text-3xl font-extrabold text-saffron-400">{step.step}</p>
                <h3 className="mt-3 text-base font-semibold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-navy-900">
        <div className="section flex flex-col items-center gap-6 py-16 text-center">
          <h2 className="text-3xl font-extrabold text-white">Ready to check your product?</h2>
          <p className="max-w-xl text-navy-200">
            Upload a label and get a rule-referenced compliance report in seconds — free for consumers, retailers and manufacturers.
          </p>
          <Link to="/checker" className="btn-solid-saffron px-8 py-3 text-base">
            Start Scanning Now
          </Link>
        </div>
      </section>
    </div>
  )
}

function HeroSampleCard() {
  const [index, setIndex] = useState(0)
  const slideCount = 3
  const goTo = (delta) => setIndex((i) => (i + delta + slideCount) % slideCount)

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="card overflow-hidden !p-0">
        <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-navy-100 to-navy-200">
          <svg viewBox="0 0 64 64" className="h-20 w-20 text-navy-400" fill="none">
            <rect x="10" y="8" width="44" height="48" rx="3" stroke="currentColor" strokeWidth="2" />
            <line x1="16" y1="18" x2="48" y2="18" stroke="currentColor" strokeWidth="2" />
            <line x1="16" y1="26" x2="48" y2="26" stroke="currentColor" strokeWidth="2" />
            <line x1="16" y1="34" x2="38" y2="34" stroke="currentColor" strokeWidth="2" />
            <rect x="16" y="42" width="18" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
          </svg>

          <button
            type="button"
            onClick={() => goTo(-1)}
            aria-label="Previous sample"
            className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-700 shadow-sm transition hover:bg-white"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M12.7 4.3a1 1 0 010 1.4L8.42 10l4.3 4.3a1 1 0 01-1.42 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Next sample"
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-700 shadow-sm transition hover:bg-white"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M7.3 15.7a1 1 0 010-1.4l4.29-4.3-4.3-4.3a1 1 0 111.42-1.4l5 5a1 1 0 010 1.4l-5 5a1 1 0 01-1.4 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p className="py-3 text-center text-xs text-navy-400">
          {HERO_SAMPLE_RESULT.name} — Sample Label {index + 1} of {slideCount}
        </p>
      </div>

      {/* Floating result panel */}
      <div className="absolute -bottom-8 -right-6 w-64 rounded-xl border border-emerald-200 bg-white p-4 shadow-float sm:-right-10">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path
                fillRule="evenodd"
                d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.6 3.6 6.7-6.7a1 1 0 011.4 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <p className="text-sm font-bold text-emerald-700">{HERO_SAMPLE_RESULT.status}</p>
        </div>
        <p className="mt-1 text-xs text-navy-400">{HERO_SAMPLE_RESULT.note}</p>

        <ul className="mt-3 space-y-1.5">
          {HERO_SAMPLE_RESULT.rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between text-xs text-navy-600">
              <span>{row.label}</span>
              <span className="flex items-center gap-1.5 font-medium text-navy-900">
                {row.value}
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-emerald-500">
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.6 3.6 6.7-6.7a1 1 0 011.4 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
