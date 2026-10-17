import { RULE_SECTIONS } from '../data/mockData.js'

export default function Rules() {
  return (
    <div>
      <section className="bg-navy-50 py-16">
        <div className="section max-w-3xl">
          <span className="pill-badge">Statutory Reference</span>
          <h1 className="mt-4 text-4xl font-extrabold text-navy-900">
            Legal Metrology (Packaged Commodities) Rules, 2011
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-navy-500">
            The rule book our AI engine checks every label against. Below is a
            summary of the key provisions relevant to packaged commodities.
          </p>
        </div>
      </section>

      <section className="section py-16">
        <div className="space-y-6">
          {RULE_SECTIONS.map((section) => (
            <div key={section.rule} className="card">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-navy-900 px-2.5 py-1 text-xs font-bold text-saffron-300">
                  {section.rule}
                </span>
                <h2 className="text-lg font-semibold text-navy-900">{section.title}</h2>
              </div>
              <ul className="mt-4 space-y-2">
                {section.points.map((point) => (
                  <li key={point} className="flex gap-2 text-sm leading-relaxed text-navy-500">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-navy-400">
          This is a simplified summary and does not replace the official
          gazetted text of the Legal Metrology (Packaged Commodities) Rules,
          2011.
        </p>
      </section>
    </div>
  )
}
