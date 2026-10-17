import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import EmblemPlaceholder from './EmblemPlaceholder.jsx'
import { useAuth } from '../auth/AuthContext.jsx'

const NAV_LINKS = [
  {
    to: '/',
    label: 'Home',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 11.5L12 4l9 7.5M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />,
  },
  {
    to: '/about',
    label: 'About Us',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
        <path strokeLinecap="round" strokeWidth={1.8} d="M12 11v5M12 8h.01" />
      </>
    ),
  },
  {
    to: '/how-it-works',
    label: 'How It Works',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" strokeWidth={1.8} />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
        />
      </>
    ),
  },
  {
    to: '/rules',
    label: 'Legal Metrology (PC) Rules, 2011',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 3h8l4 4v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6M9 16h6M9 8h3" />
      </>
    ),
  },
  {
    to: '/guidelines',
    label: 'Guidelines',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 4h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
        <rect x="5" y="6" width="14" height="15" rx="1.2" strokeWidth={1.8} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.5 12.5l2 2 4-4.5" />
      </>
    ),
  },
  {
    to: '/contact',
    label: 'Contact Us',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="1.5" strokeWidth={1.8} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.5 6.5l8.5 6 8.5-6" />
      </>
    ),
  },
]

export default function Header() {
  const [langOpen, setLangOpen] = useState(false)
  const { isLoggedIn, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50">
      {/* Tier 1: government identity strip */}
      <div className="bg-navy-950 text-navy-200">
        <div className="section flex items-center justify-between py-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-saffron" aria-hidden="true" />
            <span className="tracking-wide">भारत सरकार | GOVERNMENT OF INDIA</span>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((open) => !open)}
              className="flex items-center gap-1 text-navy-100 hover:text-white"
            >
              English
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                <path fillRule="evenodd" d="M5.2 7.5a.75.75 0 011.06.02L10 11.44l3.74-3.92a.75.75 0 111.08 1.04l-4.28 4.5a.75.75 0 01-1.08 0l-4.28-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-28 rounded-md border border-navy-700 bg-navy-900 py-1 text-navy-100 shadow-float">
                <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-navy-800">
                  English
                </button>
                <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-navy-800">
                  हिन्दी
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tier 2: department identity + product identity */}
      <div className="border-b border-navy-100 bg-white">
        <div className="section flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <EmblemPlaceholder />
            <div className="leading-tight">
              <p className="text-lg font-bold text-navy-900">Department of Legal Metrology</p>
              <p className="text-xs text-navy-400">
                Ministry of Consumer Affairs, Food &amp; Public Distribution &middot; Government of India
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden text-right sm:block">
              <p className="text-xl font-extrabold leading-tight tracking-tight text-navy-900">
                Compliance Checker
              </p>
              <p className="text-xs text-navy-400">Packaged Commodity Compliance System</p>
            </div>
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" className="btn-outline-navy">
                    Dashboard
                  </Link>
                  <button type="button" onClick={logout} className="btn-solid-navy">
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-outline-navy">
                    Login
                  </Link>
                  <Link to="/checker" className="btn-solid-navy">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tier 3: primary navigation */}
      <nav className="bg-navy-800 text-white shadow-md">
        <div className="section">
          <ul className="flex flex-wrap items-center gap-1 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 border-b-2 px-4 py-3 transition ${
                      isActive
                        ? 'border-saffron text-saffron'
                        : 'border-transparent text-navy-100 hover:border-saffron/50 hover:text-white'
                    }`
                  }
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 shrink-0">
                    {link.icon}
                  </svg>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
