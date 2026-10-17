import { useRef, useState } from 'react'
import { API_BASE } from '../auth/AuthContext.jsx'
import BarcodeLookup from '../components/BarcodeLookup.jsx'

const MAX_DIMENSION = 1800
const SCAN_TIMEOUT_MS = 60000

// Phone camera photos can be several MB, which is slow to upload over Wi-Fi/mobile
// data and makes the whole scan feel like it hangs. Downscaling + re-encoding as
// JPEG client-side keeps uploads fast without hurting OCR accuracy (the backend
// only needs ~1600px on the long edge anyway).
async function compressImage(file) {
  if (!file.type.startsWith('image/') || typeof createImageBitmap !== 'function') return file

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
    if (!blob) return file

    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file // if decoding/compression fails for any reason, just upload the original
  }
}

export default function Checker() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [status, setStatus] = useState('idle') // idle | analyzing | done | error
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  function selectFile(selected) {
    if (!selected) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
    setStatus('idle')
    setResult(null)
    setErrorMessage('')
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragActive(false)
    selectFile(event.dataTransfer.files?.[0])
  }

  async function handleAnalyze() {
    if (!file) return
    setStatus('analyzing')
    setErrorMessage('')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), SCAN_TIMEOUT_MS)

    try {
      // Compression can hang on some phones/photos (buggy image decoders, HEIC
      // quirks, etc). Never let that block the scan — fall back to the original
      // file if it doesn't finish quickly.
      const uploadFile = await Promise.race([
        compressImage(file),
        new Promise((resolve) => setTimeout(() => resolve(file), 8000)),
      ])
      const formData = new FormData()
      formData.append('image', uploadFile)

      const response = await fetch(`${API_BASE}/api/scan`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed')
      }

      setResult(data)
      setStatus('done')
    } catch (err) {
      if (err.name === 'AbortError') {
        setErrorMessage('The scan timed out. Check your connection and try again, ideally with a clearer, well-lit photo.')
      } else {
        setErrorMessage(
          err.message === 'Failed to fetch'
            ? `Could not reach the compliance server. Is the backend running on ${API_BASE}?`
            : err.message,
        )
      }
      setStatus('error')
    } finally {
      clearTimeout(timeoutId)
    }
  }

  function handleReset() {
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setErrorMessage('')
    setStatus('idle')
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const isCompliant = result?.overall_status === 'Compliant'

  return (
    <div>
      <section className="bg-navy-50 py-16">
        <div className="section max-w-3xl">
          <span className="pill-badge">AI-Powered</span>
          <h1 className="mt-4 text-4xl font-extrabold text-navy-900">Compliance Scanner</h1>
          <p className="mt-4 text-lg leading-relaxed text-navy-500">
            Upload a photo of a product label to see how the OCR verification
            engine checks it against the Legal Metrology (Packaged Commodities)
            Rules, 2011.
          </p>
        </div>
      </section>

      <section className="section grid grid-cols-1 gap-10 py-16 lg:grid-cols-5">
        {/* Left: upload */}
        <div className="lg:col-span-2 space-y-6">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`card cursor-pointer border-2 border-dashed text-center transition ${
              dragActive ? 'border-saffron bg-navy-50' : 'border-navy-200 bg-navy-50/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => selectFile(e.target.files?.[0])}
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Selected label preview" className="mx-auto max-h-48 rounded-lg object-contain" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mx-auto h-10 w-10 text-navy-300">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14" />
              </svg>
            )}
            <p className="mt-3 text-sm font-medium text-navy-600">
              {file ? file.name : 'Drag & drop a label image'}
            </p>
            <p className="text-xs text-navy-400">{file ? 'Click to choose a different image' : 'or click to browse'}</p>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => selectFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="btn-outline-navy flex w-full items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 8a2 2 0 012-2h1.2l.9-1.5A1.5 1.5 0 019.4 3.7h5.2a1.5 1.5 0 011.3.8L16.8 6H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
              <circle cx="12" cy="13" r="3.3" strokeWidth={1.6} />
            </svg>
            Scan Label with Camera
          </button>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!file || status === 'analyzing'}
            className="btn-solid-saffron w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'analyzing' ? 'Analyzing…' : 'Run Compliance Check'}
          </button>

          <BarcodeLookup />
        </div>

        {/* Right: result panel */}
        <div className="lg:col-span-3">
          {status === 'idle' && (
            <div className="card flex h-full min-h-[24rem] flex-col items-center justify-center text-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-12 w-12 text-navy-200">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4} d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-sm font-medium text-navy-400">
                Upload a label image and run a check to see the compliance report here.
              </p>
            </div>
          )}

          {status === 'analyzing' && (
            <div className="card flex h-full min-h-[24rem] flex-col items-center justify-center text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-saffron" />
              <p className="mt-4 text-sm font-medium text-navy-500">
                Reading label and checking against Legal Metrology &amp; FSSAI rules…
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="card flex h-full min-h-[24rem] flex-col items-center justify-center text-center">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-12 w-12 text-red-300">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 10-2 0v4a1 1 0 002 0V6zm-1 8a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p>
              <button type="button" onClick={handleAnalyze} className="btn-outline-navy mt-6">
                Try Again
              </button>
            </div>
          )}

          {status === 'done' && result && (
            <div className="card">
              <p className="text-xs font-medium uppercase tracking-wide text-navy-400">Result for</p>
              <p className="text-base font-semibold text-navy-900">{file?.name}</p>

              <div className="mt-6 flex flex-col items-center border-b border-navy-100 pb-8 text-center">
                <p className={`text-7xl font-extrabold tracking-tight ${isCompliant ? 'text-emerald-600' : 'text-navy-900'}`}>
                  {result.compliance_percentage}%
                </p>
                <span
                  className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ring-1 ${
                    isCompliant
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                      : 'bg-red-50 text-red-700 ring-red-200'
                  }`}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    {isCompliant ? (
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.6 3.6 6.7-6.7a1 1 0 011.4 0z"
                        clipRule="evenodd"
                      />
                    ) : (
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 10-2 0v4a1 1 0 002 0V6zm-1 8a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"
                        clipRule="evenodd"
                      />
                    )}
                  </svg>
                  {result.overall_status.toUpperCase()}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-navy-50 py-4 text-center">
                  <p className="text-2xl font-extrabold text-navy-900">{result.rules_total}</p>
                  <p className="text-xs font-medium text-navy-400">Total Checks</p>
                </div>
                <div className="rounded-lg bg-navy-50 py-4 text-center">
                  <p className="text-2xl font-extrabold text-emerald-600">{result.rules_passed}</p>
                  <p className="text-xs font-medium text-navy-400">Passed</p>
                </div>
                <div className="rounded-lg bg-navy-50 py-4 text-center">
                  <p className="text-2xl font-extrabold text-red-600">{result.rules_total - result.rules_passed}</p>
                  <p className="text-xs font-medium text-navy-400">Failed</p>
                </div>
                <div className="rounded-lg bg-navy-50 py-4 text-center">
                  <p className="text-2xl font-extrabold text-navy-900">{result.confidence_score}%</p>
                  <p className="text-xs font-medium text-navy-400">OCR Confidence</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                  Mandatory Declarations
                </h3>
                <ul className="mt-3 space-y-2">
                  {result.fields.map((field) => (
                    <li
                      key={field.name}
                      className={`rounded-md px-3 py-2 text-xs font-medium ${
                        field.detected ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0">
                          {field.detected ? (
                            <path
                              fillRule="evenodd"
                              d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.6 3.6 6.7-6.7a1 1 0 011.4 0z"
                              clipRule="evenodd"
                            />
                          ) : (
                            <path
                              fillRule="evenodd"
                              d="M4.3 4.3a1 1 0 011.4 0L10 8.6l4.3-4.3a1 1 0 111.4 1.4L11.4 10l4.3 4.3a1 1 0 01-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 01-1.4-1.4L8.6 10 4.3 5.7a1 1 0 010-1.4z"
                              clipRule="evenodd"
                            />
                          )}
                        </svg>
                        <div>
                          <p className="font-semibold">{field.name}</p>
                          {field.value && <p className="mt-0.5 font-normal opacity-90">{field.value}</p>}
                          <p className="mt-0.5 font-normal italic opacity-70">{field.reference}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <details className="mt-6">
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-navy-400">
                  Raw OCR Text
                </summary>
                <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-md bg-navy-50 p-3 text-xs text-navy-600">
                  {result.raw_ocr_text}
                </pre>
              </details>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`${API_BASE}/api/scan/${result.scan_id}/pdf`}
                  className="btn-solid-navy flex flex-1 items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                  </svg>
                  Download PDF Report
                </a>
                <button type="button" onClick={handleReset} className="btn-outline-navy flex-1">
                  Scan Another Product
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
