'use client'

import { FC } from 'react'
import { Manufacturer, EmitterType } from '@/types/database'
import SortControl, { SortOption } from './SortControl'

interface FilterBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedManufacturer: string
  onManufacturerChange: (manufacturer: string) => void
  selectedEmitterType: string
  onEmitterTypeChange: (type: string) => void
  selectedStatus: string
  onStatusChange: (status: string) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  manufacturers: Manufacturer[]
  emitterTypes: EmitterType[]
  activeFilterCount: number
  onClearFilters: () => void
  resultCount: number
  totalCount: number
}

const FilterBar: FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedManufacturer,
  onManufacturerChange,
  selectedEmitterType,
  onEmitterTypeChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  manufacturers,
  emitterTypes,
  activeFilterCount,
  onClearFilters,
  resultCount,
  totalCount,
}) => {
  const statusOptions = ['Wanted', 'Ordered', 'Owned', 'Sold']

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search flashlights..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition-colors"
          >
            Clear Filters ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Filter Dropdowns and Sort Control */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {/* Manufacturer Filter */}
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedManufacturer}
            onChange={(e) => onManufacturerChange(e.target.value)}
          >
            <option value="all">All Manufacturers</option>
            {manufacturers.map((mfg) => (
              <option key={mfg.id} value={mfg.name}>
                {mfg.name}
              </option>
            ))}
          </select>

          {/* Emitter Type Filter */}
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedEmitterType}
            onChange={(e) => onEmitterTypeChange(e.target.value)}
          >
            <option value="all">All Emitter Types</option>
            {emitterTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        
        {/* Sort Control */}
        <div className="flex-shrink-0">
          <SortControl sortBy={sortBy} onSortChange={onSortChange} />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        Showing {resultCount} of {totalCount} flashlights
      </div>
    </div>
  )
}

export default FilterBar