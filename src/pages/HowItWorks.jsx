import { Link } from 'react-router-dom'
import { HOW_IT_WORKS_STEPS } from '../data/mockData.js'

export default function HowItWorks() {
  return (
    <div>
      <section className="bg-navy-50 py-16">
        <div className="section max-w-3xl">
          <span className="pill-badge">The Process</span>
          <h1 className="mt-4 text-4xl font-extrabold text-navy-900">How Compliance Checker Works</h1>
          <p className="mt-4 text-lg leading-relaxed text-navy-500">
            From a single label photo to a rule-referenced verdict — in four steps.
          </p>
        </div>
      </section>

      <section className="section py-16">
        <div className="relative mx-auto max-w-3xl">
          <div
            className="absolute left-6 top-2 hidden h-[calc(100%-2rem)] w-0.5 bg-navy-100 sm:block"
            aria-hidden="true"
          />
          <ol className="space-y-10">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <li key={step.step} className="relative flex gap-6 sm:pl-0">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  {step.step}
                </div>
                <div className="card flex-1">
                  <h3 className="text-lg font-semibold text-navy-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-500">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-navy-900 py-16">
        <div className="section flex flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-bold text-white">See it in action</h2>
          <Link to="/checker" className="btn-solid-saffron px-8 py-3 text-base">
            Try the Scanner
          </Link>
        </div>
      </section>
    </div>
  )
}
