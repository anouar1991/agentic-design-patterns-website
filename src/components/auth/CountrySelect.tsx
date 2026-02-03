import { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Search, X, Globe } from 'lucide-react'

// ISO 3166-1 alpha-2 countries with flag emojis
const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan', flag: '\uD83C\uDDE6\uD83C\uDDEB' },
  { code: 'AL', name: 'Albania', flag: '\uD83C\uDDE6\uD83C\uDDF1' },
  { code: 'DZ', name: 'Algeria', flag: '\uD83C\uDDE9\uD83C\uDDFF' },
  { code: 'AR', name: 'Argentina', flag: '\uD83C\uDDE6\uD83C\uDDF7' },
  { code: 'AU', name: 'Australia', flag: '\uD83C\uDDE6\uD83C\uDDFA' },
  { code: 'AT', name: 'Austria', flag: '\uD83C\uDDE6\uD83C\uDDF9' },
  { code: 'BE', name: 'Belgium', flag: '\uD83C\uDDE7\uD83C\uDDEA' },
  { code: 'BR', name: 'Brazil', flag: '\uD83C\uDDE7\uD83C\uDDF7' },
  { code: 'CA', name: 'Canada', flag: '\uD83C\uDDE8\uD83C\uDDE6' },
  { code: 'CL', name: 'Chile', flag: '\uD83C\uDDE8\uD83C\uDDF1' },
  { code: 'CN', name: 'China', flag: '\uD83C\uDDE8\uD83C\uDDF3' },
  { code: 'CO', name: 'Colombia', flag: '\uD83C\uDDE8\uD83C\uDDF4' },
  { code: 'CZ', name: 'Czech Republic', flag: '\uD83C\uDDE8\uD83C\uDDFF' },
  { code: 'DK', name: 'Denmark', flag: '\uD83C\uDDE9\uD83C\uDDF0' },
  { code: 'EG', name: 'Egypt', flag: '\uD83C\uDDEA\uD83C\uDDEC' },
  { code: 'FI', name: 'Finland', flag: '\uD83C\uDDEB\uD83C\uDDEE' },
  { code: 'FR', name: 'France', flag: '\uD83C\uDDEB\uD83C\uDDF7' },
  { code: 'DE', name: 'Germany', flag: '\uD83C\uDDE9\uD83C\uDDEA' },
  { code: 'GR', name: 'Greece', flag: '\uD83C\uDDEC\uD83C\uDDF7' },
  { code: 'HK', name: 'Hong Kong', flag: '\uD83C\uDDED\uD83C\uDDF0' },
  { code: 'HU', name: 'Hungary', flag: '\uD83C\uDDED\uD83C\uDDFA' },
  { code: 'IN', name: 'India', flag: '\uD83C\uDDEE\uD83C\uDDF3' },
  { code: 'ID', name: 'Indonesia', flag: '\uD83C\uDDEE\uD83C\uDDE9' },
  { code: 'IE', name: 'Ireland', flag: '\uD83C\uDDEE\uD83C\uDDEA' },
  { code: 'IL', name: 'Israel', flag: '\uD83C\uDDEE\uD83C\uDDF1' },
  { code: 'IT', name: 'Italy', flag: '\uD83C\uDDEE\uD83C\uDDF9' },
  { code: 'JP', name: 'Japan', flag: '\uD83C\uDDEF\uD83C\uDDF5' },
  { code: 'KR', name: 'South Korea', flag: '\uD83C\uDDF0\uD83C\uDDF7' },
  { code: 'MY', name: 'Malaysia', flag: '\uD83C\uDDF2\uD83C\uDDFE' },
  { code: 'MX', name: 'Mexico', flag: '\uD83C\uDDF2\uD83C\uDDFD' },
  { code: 'MA', name: 'Morocco', flag: '\uD83C\uDDF2\uD83C\uDDE6' },
  { code: 'NL', name: 'Netherlands', flag: '\uD83C\uDDF3\uD83C\uDDF1' },
  { code: 'NZ', name: 'New Zealand', flag: '\uD83C\uDDF3\uD83C\uDDFF' },
  { code: 'NG', name: 'Nigeria', flag: '\uD83C\uDDF3\uD83C\uDDEC' },
  { code: 'NO', name: 'Norway', flag: '\uD83C\uDDF3\uD83C\uDDF4' },
  { code: 'PK', name: 'Pakistan', flag: '\uD83C\uDDF5\uD83C\uDDF0' },
  { code: 'PE', name: 'Peru', flag: '\uD83C\uDDF5\uD83C\uDDEA' },
  { code: 'PH', name: 'Philippines', flag: '\uD83C\uDDF5\uD83C\uDDED' },
  { code: 'PL', name: 'Poland', flag: '\uD83C\uDDF5\uD83C\uDDF1' },
  { code: 'PT', name: 'Portugal', flag: '\uD83C\uDDF5\uD83C\uDDF9' },
  { code: 'RO', name: 'Romania', flag: '\uD83C\uDDF7\uD83C\uDDF4' },
  { code: 'RU', name: 'Russia', flag: '\uD83C\uDDF7\uD83C\uDDFA' },
  { code: 'SA', name: 'Saudi Arabia', flag: '\uD83C\uDDF8\uD83C\uDDE6' },
  { code: 'SG', name: 'Singapore', flag: '\uD83C\uDDF8\uD83C\uDDEC' },
  { code: 'ZA', name: 'South Africa', flag: '\uD83C\uDDFF\uD83C\uDDE6' },
  { code: 'ES', name: 'Spain', flag: '\uD83C\uDDEA\uD83C\uDDF8' },
  { code: 'SE', name: 'Sweden', flag: '\uD83C\uDDF8\uD83C\uDDEA' },
  { code: 'CH', name: 'Switzerland', flag: '\uD83C\uDDE8\uD83C\uDDED' },
  { code: 'TW', name: 'Taiwan', flag: '\uD83C\uDDF9\uD83C\uDDFC' },
  { code: 'TH', name: 'Thailand', flag: '\uD83C\uDDF9\uD83C\uDDED' },
  { code: 'TR', name: 'Turkey', flag: '\uD83C\uDDF9\uD83C\uDDF7' },
  { code: 'UA', name: 'Ukraine', flag: '\uD83C\uDDFA\uD83C\uDDE6' },
  { code: 'AE', name: 'United Arab Emirates', flag: '\uD83C\uDDE6\uD83C\uDDEA' },
  { code: 'GB', name: 'United Kingdom', flag: '\uD83C\uDDEC\uD83C\uDDE7' },
  { code: 'US', name: 'United States', flag: '\uD83C\uDDFA\uD83C\uDDF8' },
  { code: 'VN', name: 'Vietnam', flag: '\uD83C\uDDFB\uD83C\uDDF3' },
] as const

export type CountryCode = typeof COUNTRIES[number]['code'] | null

interface CountrySelectProps {
  value: CountryCode
  onChange: (code: CountryCode) => void
  className?: string
}

export function CountrySelect({ value, onChange, className = '' }: CountrySelectProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedCountry = COUNTRIES.find(c => c.code === value)

  const filteredCountries = useMemo(() => {
    if (!search) return COUNTRIES
    const lower = search.toLowerCase()
    return COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(lower) ||
      c.code.toLowerCase().includes(lower)
    )
  }, [search])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (code: string) => {
    onChange(code as CountryCode)
    setIsOpen(false)
    setSearch('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {selectedCountry ? (
          <>
            <span className="text-xl">{selectedCountry.flag}</span>
            <span className="flex-1 text-gray-900 dark:text-white truncate">
              {selectedCountry.name}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <Globe className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-gray-500">
              {t('auth.selectCountry', 'Select country')}
            </span>
          </>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('auth.searchCountry', 'Search countries...')}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                {t('auth.noCountryFound', 'No country found')}
              </div>
            ) : (
              filteredCountries.map(country => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    country.code === value ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="flex-1 text-gray-900 dark:text-white">{country.name}</span>
                  <span className="text-xs text-gray-400 font-mono">{country.code}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Export country list for use in leaderboard filtering
export { COUNTRIES }

// Export lookup maps for easy access by code
export const countryNames: Record<string, string> = Object.fromEntries(
  COUNTRIES.map(c => [c.code, c.name])
)

export const countryFlags: Record<string, string> = Object.fromEntries(
  COUNTRIES.map(c => [c.code, c.flag])
)
