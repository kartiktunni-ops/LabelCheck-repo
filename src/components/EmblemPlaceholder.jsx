export default function EmblemPlaceholder({ className = 'h-10 w-10' }) {
  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-full bg-saffron/90 ring-2 ring-saffron-200/60`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="h-2/3 w-2/3" fill="none">
        <circle cx="16" cy="16" r="10" stroke="#0F1C3F" strokeWidth="1.6" />
        <circle cx="16" cy="16" r="1.8" fill="#0F1C3F" />
        <g stroke="#0F1C3F" strokeWidth="0.9">
          <line x1="16" y1="6" x2="16" y2="26" />
          <line x1="6" y1="16" x2="26" y2="16" />
          <line x1="9.1" y1="9.1" x2="22.9" y2="22.9" />
          <line x1="9.1" y1="22.9" x2="22.9" y2="9.1" />
        </g>
      </svg>
    </div>
  )
}
