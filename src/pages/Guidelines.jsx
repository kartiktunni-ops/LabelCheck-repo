import { GUIDELINES } from '../data/mockData.js'

export default function Guidelines() {
  return (
    <div>
      <section className="bg-navy-50 py-16">
        <div className="section max-w-3xl">
          <span className="pill-badge">Best Practices</span>
          <h1 className="mt-4 text-4xl font-extrabold text-navy-900">Compliance Guidelines</h1>
          <p className="mt-4 text-lg leading-relaxed text-navy-500">
            Practical guidance for staying on the right side of the Legal
            Metrology (Packaged Commodities) Rules, 2011 — whether you make,
            sell, or buy packaged goods.
          </p>
        </div>
      </section>

      <section className="section py-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {GUIDELINES.map((group) => (
            <div key={group.title} className="card">
              <h2 className="text-base font-semibold text-navy-900">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-navy-500">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500">
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.6 3.6 6.7-6.7a1 1 0 011.4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="card mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-navy-900">Download the Compliance Checklist</h3>
            <p className="mt-1 text-sm text-navy-500">
              A printable one-pager covering all eight mandatory declarations.
            </p>
          </div>
          <button type="button" className="btn-solid-navy">
            Download PDF
          </button>
        </div>
      </section>
    </div>
  )
}
