import { useState } from 'react'

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setForm(INITIAL_FORM)
  }

  return (
    <div>
      <section className="bg-navy-50 py-16">
        <div className="section max-w-3xl">
          <span className="pill-badge">Get in Touch</span>
          <h1 className="mt-4 text-4xl font-extrabold text-navy-900">Contact Us</h1>
          <p className="mt-4 text-lg leading-relaxed text-navy-500">
            Questions, grievances, or feedback on the Compliance Checker system —
            reach the Department of Legal Metrology directly.
          </p>
        </div>
      </section>

      <section className="section grid grid-cols-1 gap-10 py-16 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-saffron-600">Office Address</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">
              Department of Legal Metrology<br />
              Ministry of Consumer Affairs, Food &amp; Public Distribution<br />
              Krishi Bhawan, Dr. Rajendra Prasad Road,<br />
              New Delhi – 110001, India
            </p>
          </div>
          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-saffron-600">Helpline</h2>
            <p className="mt-2 text-sm text-navy-600">1800-11-4000 (Toll Free)</p>
            <p className="text-sm text-navy-600">helpdesk-lm@gov.in</p>
          </div>
          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-saffron-600">Office Hours</h2>
            <p className="mt-2 text-sm text-navy-600">Monday – Friday, 9:30 AM – 6:00 PM IST</p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="card space-y-5">
            {submitted && (
              <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                Thank you — your message has been recorded. Our team will respond shortly.
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy-700" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-navy-200 px-3.5 py-2.5 text-sm text-navy-900 outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy-700" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-navy-200 px-3.5 py-2.5 text-sm text-navy-900 outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-700" htmlFor="subject">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={form.subject}
                onChange={handleChange}
                className="w-full rounded-md border border-navy-200 px-3.5 py-2.5 text-sm text-navy-900 outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
                placeholder="What is this regarding?"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-700" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={handleChange}
                className="w-full rounded-md border border-navy-200 px-3.5 py-2.5 text-sm text-navy-900 outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
                placeholder="Describe your query or grievance..."
              />
            </div>

            <button type="submit" className="btn-solid-saffron w-full sm:w-auto">
              Submit Message
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
