import { useRef, useState } from 'react'
import { API_BASE } from '../auth/AuthContext.jsx'

export default function BarcodeLookup() {
  const [status, setStatus] = useState('idle') // idle | decoding | found | not-found | error
  const [barcode, setBarcode] = useState(null)
  const [product, setProduct] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const inputRef = useRef(null)

  async function handleFile(file) {
    if (!file) return
    setStatus('decoding')
    setErrorMessage('')
    setProduct(null)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(`${API_BASE}/api/barcode`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Barcode scan failed')
      }

      setBarcode(data.barcode)
      setProduct(data.product)
      setStatus(data.product ? 'found' : 'not-found')
    } catch (err) {
      setErrorMessage(
        err.message === 'Failed to fetch'
          ? `Could not reach the compliance server. Is the backend running on ${API_BASE}?`
          : err.message,
      )
      setStatus('error')
    }
  }

  function handleReset() {
    setStatus('idle')
    setBarcode(null)
    setProduct(null)
    setErrorMessage('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="card">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400">Barcode Lookup</h3>
      <p className="mt-1 text-xs text-navy-400">Scan the barcode printed on a package to identify the product.</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {status === 'idle' && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn-outline-navy mt-4 flex w-full items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 6v12M8 6v12M12 6v4m0 4v4M16 6v12M20 6v12" />
          </svg>
          Scan Barcode
        </button>
      )}

      {status === 'decoding' && (
        <div className="mt-4 flex items-center justify-center gap-2 py-3 text-sm text-navy-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-navy-100 border-t-saffron" />
          Reading barcode…
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4">
          <p className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{errorMessage}</p>
          <button type="button" onClick={handleReset} className="btn-outline-navy mt-3 w-full">
            Try Again
          </button>
        </div>
      )}

      {(status === 'found' || status === 'not-found') && (
        <div className="mt-4 rounded-md bg-navy-50 p-3 text-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-navy-400">Barcode</p>
          <p className="font-mono font-semibold text-navy-900">{barcode}</p>

          {status === 'found' ? (
            <>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-navy-400">Product</p>
              <p className="font-semibold text-navy-900">{product.product_name || 'Unnamed product'}</p>
              {product.brands && <p className="text-xs text-navy-500">{product.brands}</p>}
              {product.quantity && <p className="text-xs text-navy-500">{product.quantity}</p>}
            </>
          ) : (
            <p className="mt-2 text-xs text-navy-500">Product not found in the public database — barcode number captured above.</p>
          )}

          <button type="button" onClick={handleReset} className="btn-outline-navy mt-3 w-full">
            Scan Another Barcode
          </button>
        </div>
      )}
    </div>
  )
}
