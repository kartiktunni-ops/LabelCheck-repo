import { Link } from 'react-router-dom'
import EmblemPlaceholder from './EmblemPlaceholder.jsx'

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-100">
      <div className="section grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-saffron-300">
            Consumer Rights
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/rules" className="hover:text-white">Right to Correct Information</Link></li>
            <li><Link to="/guidelines" className="hover:text-white">File a Complaint</Link></li>
            <li><Link to="/rules" className="hover:text-white">Know Your MRP</Link></li>
            <li><Link to="/about" className="hover:text-white">Consumer Helpline</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-saffron-300">
            Fair Trade
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/how-it-works" className="hover:text-white">Report Non-Compliance</Link></li>
            <li><Link to="/guidelines" className="hover:text-white">Manufacturer Guidelines</Link></li>
            <li><Link to="/rules" className="hover:text-white">Packaging Standards</Link></li>
            <li><Link to="/checker" className="hover:text-white">Verify a Product</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-saffron-300">
            Transparent System
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">Open Compliance Data</Link></li>
            <li><Link to="/how-it-works" className="hover:text-white">How Scoring Works</Link></li>
            <li><Link to="/rules" className="hover:text-white">Rules &amp; Amendments</Link></li>
            <li><Link to="/contact" className="hover:text-white">RTI &amp; Grievances</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-saffron-300">
            <EmblemPlaceholder className="h-6 w-6" />
            Department of Legal Metrology
          </h3>
          <p className="text-sm leading-relaxed text-navy-200">
            Ministry of Consumer Affairs, Food &amp; Public Distribution<br />
            Krishi Bhawan, Dr. Rajendra Prasad Road,<br />
            New Delhi – 110001, India
          </p>
          <p className="mt-3 text-sm text-navy-200">
            helpdesk-lm@gov.in &nbsp;|&nbsp; 1800-11-4000
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section flex flex-col items-center justify-between gap-2 py-5 text-xs text-navy-300 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Department of Legal Metrology, Government of India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
