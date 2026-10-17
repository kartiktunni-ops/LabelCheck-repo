import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth, API_BASE } from '../auth/AuthContext.jsx'

function average(values) {
  if (values.length === 0) return 0
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
}

export default function Dashboard() {
  const { checked, isLoggedIn, username, logout } = useAuth()
  const [scans, setScans] = useState([])
  const [loadState, setLoadState] = useState('loading') // loading | done | error
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoggedIn) return
    fetch(`${API_BASE}/api/history`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Could not load scan history')
        return res.json()
      })
      .then((data) => {
        setScans(data)
        setLoadState('done')
      })
      .catch((err) => {
        setError(err.message)
        setLoadState('error')
      })
  }, [isLoggedIn])

  if (!checked) return null
  if (!isLoggedIn) return <Navigate to="/login" replace />

  const total = scans.length
  const compliantCount = scans.filter((s) => s.overall_status === 'Compliant').length
  const nonCompliantCount = total - compliantCount
  const avgCompliance = average(scans.map((s) => s.compliance_percentage))
  const avgConfidence = average(scans.map((s) => s.confidence_score))
  const compliantShare = total > 0 ? Math.round((compliantCount / total) * 100) : 0

  return (
    <div>
      <section className="bg-navy-50 py-16">
        <div className="section flex flex-wrap items-center justify-between gap-4 max-w-3xl">
          <div>
            <span className="pill-badge">Officer Dashboard</span>
            <h1 className="mt-4 text-4xl font-extrabold text-navy-900">Compliance Overview</h1>
            <p className="mt-2 text-sm text-navy-500">Signed in as {username}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/checker" className="btn-solid-saffron">
              New Inspection
            </Link>
            <button type="button" onClick={logout} className="btn-outline-navy">
              Log Out
            </button>
          </div>
        </div>
      </section>

      <section className="section py-16">
        {loadState === 'loading' && <p className="text-sm text-navy-400">Loading scan history…</p>}
        {loadState === 'error' && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
        )}

        {loadState === 'done' && total === 0 && (
          <div className="card text-center">
            <p className="text-sm font-medium text-navy-400">
              No scans yet. Run a check on the Compliance Scanner page to see stats here.
            </p>
          </div>
        )}

        {loadState === 'done' && total > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="card">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Total Scans</p>
                <p className="mt-2 text-3xl font-extrabold text-navy-900">{total}</p>
              </div>
              <div className="card">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Compliant</p>
                <p className="mt-2 text-3xl font-extrabold text-emerald-600">{compliantCount}</p>
              </div>
              <div className="card">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Non-Compliant</p>
                <p className="mt-2 text-3xl font-extrabold text-red-600">{nonCompliantCount}</p>
              </div>
              <div className="card">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Avg. OCR Confidence</p>
                <p className="mt-2 text-3xl font-extrabold text-navy-900">{avgConfidence}%</p>
              </div>
            </div>

            <div className="card mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                  Compliant vs. Non-Compliant
                </h3>
                <span className="text-xs font-semibold text-navy-500">
                  {compliantShare}% compliant · avg score {avgCompliance}%
                </span>
              </div>
              <div className="mt-3 flex h-4 w-full overflow-hidden rounded-full bg-navy-100">
                {compliantCount > 0 && (
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${(compliantCount / total) * 100}%` }}
                    title={`${compliantCount} compliant`}
                  />
                )}
                {nonCompliantCount > 0 && (
                  <div
                    className="h-full bg-red-400"
                    style={{ width: `${(nonCompliantCount / total) * 100}%` }}
                    title={`${nonCompliantCount} non-compliant`}
                  />
                )}
              </div>
              <div className="mt-3 flex gap-4 text-xs text-navy-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" /> Non-Compliant
                </span>
              </div>
            </div>

            <div className="card mt-6 overflow-x-auto">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400">Recent Scans</h3>
              <table className="mt-3 w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-400">
                    <th className="py-2 pr-4 font-semibold">File</th>
                    <th className="py-2 pr-4 font-semibold">Status</th>
                    <th className="py-2 pr-4 font-semibold">Score</th>
                    <th className="py-2 pr-4 font-semibold">Confidence</th>
                    <th className="py-2 pr-4 font-semibold">Scanned</th>
                  </tr>
                </thead>
                <tbody>
                  {scans.map((s) => (
                    <tr key={s.scan_id} className="border-b border-navy-50 last:border-0">
                      <td className="py-2.5 pr-4 font-medium text-navy-900">{s.filename}</td>
                      <td className="py-2.5 pr-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            s.overall_status === 'Compliant'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {s.overall_status}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-navy-600">
                        {s.compliance_percentage}% ({s.rules_passed}/{s.rules_total})
                      </td>
                      <td className="py-2.5 pr-4 text-navy-600">{s.confidence_score}%</td>
                      <td className="py-2.5 pr-4 text-navy-400">
                        {new Date(s.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
