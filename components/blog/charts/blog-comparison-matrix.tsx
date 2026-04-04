'use client'

interface ComparisonRow {
  label: string
  values: ('yes' | 'no' | 'partial')[]
}

interface BlogComparisonMatrixProps {
  title: string
  subtitle?: string
  source?: string
  columns: string[]
  columnColors: string[]
  rows: ComparisonRow[]
}

function CellIcon({
  status,
  color,
}: {
  status: 'yes' | 'no' | 'partial'
  color: string
}) {
  const map = {
    yes: { symbol: '\u2713', opacity: 0.85 },
    partial: { symbol: '~', opacity: 0.5 },
    no: { symbol: '\u2014', opacity: 0.2 },
  }
  const { symbol, opacity } = map[status]

  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color, opacity }}
    >
      {symbol}
    </span>
  )
}

export function BlogComparisonMatrix({
  title,
  subtitle,
  source,
  columns,
  columnColors,
  rows,
}: BlogComparisonMatrixProps) {
  if (!rows || rows.length === 0) return null
  return (
    <figure className="my-10">
      <div className="mb-4">
        <h3 className="text-base font-bold text-white">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>
        )}
      </div>
      <div className="overflow-x-auto">
        <div
          className="min-w-max"
          style={{
            display: 'grid',
            gridTemplateColumns: `minmax(140px, 1fr) repeat(${columns.length}, minmax(80px, 1fr))`,
          }}
        >
          {/* Header row */}
          <div />
          {columns.map((col, i) => (
            <div
              key={col}
              className="pb-3 text-center text-sm font-semibold"
              style={{ color: columnColors[i] ?? '#fff' }}
            >
              {col}
            </div>
          ))}

          {/* Data rows */}
          {rows.map((row, rowIndex) => (
            <div
              key={row.label}
              className="contents"
            >
              <div className="flex items-center border-b border-neutral-800/50 py-2.5 pr-4 text-sm text-neutral-300">
                {row.label}
              </div>
              {row.values.map((val, colIndex) => (
                <div
                  key={`${row.label}-${colIndex}`}
                  className="flex items-center justify-center border-b border-neutral-800/50 py-2.5"
                >
                  <CellIcon
                    status={val}
                    color={columnColors[colIndex] ?? '#737373'}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {source && (
        <figcaption className="mt-3 text-center text-xs text-neutral-500">
          {source}
        </figcaption>
      )}
    </figure>
  )
}
