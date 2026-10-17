const TEAM_VALUES = [
  {
    title: 'Consumer First',
    description: 'Every check we run traces back to protecting the person buying the product off the shelf.',
  },
  {
    title: 'Rule Fidelity',
    description: 'Our engine never interprets the law loosely — every verdict cites the exact rule and clause.',
  },
  {
    title: 'Radical Transparency',
    description: 'Compliance data, once verified, is made available to regulators and the public alike.',
  },
]

export default function About() {
  return (
    <div>
      <section className="bg-navy-50 py-16">
        <div className="section max-w-3xl">
          <span className="pill-badge">About the Initiative</span>
          <h1 className="mt-4 text-4xl font-extrabold text-navy-900">
            Bringing AI to the Legal Metrology Rule Book
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-navy-500">
            Compliance Checker is a digital initiative under the Department of Legal
            Metrology, Ministry of Consumer Affairs, Food &amp; Public Distribution,
            built to replace manual, checklist-driven label audits with instant,
            AI-verified compliance reports for packaged commodities.
          </p>
        </div>
      </section>

      <section className="section grid grid-cols-1 gap-12 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Our Mission</h2>
          <p className="mt-4 leading-relaxed text-navy-500">
            To make compliance with the Legal Metrology (Packaged Commodities)
            Rules, 2011 fast, transparent and accessible — for consumers who
            deserve accurate information, for honest businesses that already
            follow the rules, and for enforcement officers who need reliable
            evidence to act on.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-navy-900">The Problem We Address</h2>
          <p className="mt-4 leading-relaxed text-navy-500">
            Manual label verification is slow, inconsistent, and difficult to
            scale across lakhs of SKUs entering the market every year. Missing
            or incorrect declarations — on MRP, net quantity, manufacturing
            dates — directly affect consumer trust and fair trade practices.
            Compliance Checker closes that gap with a scan-first, rule-checked
            verification pipeline.
          </p>
        </div>
      </section>

      <section className="bg-navy-50 py-16">
        <div className="section">
          <h2 className="text-center text-2xl font-bold text-navy-900">What Guides Us</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TEAM_VALUES.map((value) => (
              <div key={value.title} className="card">
                <h3 className="text-base font-semibold text-navy-900">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
