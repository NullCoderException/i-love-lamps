'use client'

import { FC } from 'react'

export type SortField = 'model' | 'manufacturer' | 'purchase_date' | 'price' | 'status' | 'created_at'
export type SortDirection = 'asc' | 'desc'

export interface SortOption {
  field: SortField
  direction: SortDirection
}

interface SortControlProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

const SortControl: FC<SortControlProps> = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'model-asc', label: 'Model (A-Z)', field: 'model' as SortField, direction: 'asc' as SortDirection },
    { value: 'model-desc', label: 'Model (Z-A)', field: 'model' as SortField, direction: 'desc' as SortDirection },
    { value: 'manufacturer-asc', label: 'Manufacturer (A-Z)', field: 'manufacturer' as SortField, direction: 'asc' as SortDirection },
    { value: 'manufacturer-desc', label: 'Manufacturer (Z-A)', field: 'manufacturer' as SortField, direction: 'desc' as SortDirection },
    { value: 'purchase_date-desc', label: 'Purchase Date (Newest)', field: 'purchase_date' as SortField, direction: 'desc' as SortDirection },
    { value: 'purchase_date-asc', label: 'Purchase Date (Oldest)', field: 'purchase_date' as SortField, direction: 'asc' as SortDirection },
    { value: 'price-desc', label: 'Price (High to Low)', field: 'price' as SortField, direction: 'desc' as SortDirection },
    { value: 'price-asc', label: 'Price (Low to High)', field: 'price' as SortField, direction: 'asc' as SortDirection },
    { value: 'status-asc', label: 'Status (A-Z)', field: 'status' as SortField, direction: 'asc' as SortDirection },
    { value: 'created_at-desc', label: 'Recently Added', field: 'created_at' as SortField, direction: 'desc' as SortDirection },
  ]

  const currentValue = `${sortBy.field}-${sortBy.direction}`

  const handleSortChange = (value: string) => {
    const option = sortOptions.find(opt => opt.value === value)
    if (option) {
      onSortChange({
        field: option.field,
        direction: option.direction,
      })
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor="sort-select" className="text-gray-300 whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort-select"
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
        value={currentValue}
        onChange={(e) => handleSortChange(e.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SortControl