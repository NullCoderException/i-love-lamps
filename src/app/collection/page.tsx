'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import { createClient } from '@/lib/supabase/client-wrapper'
import { apiFetch } from '@/lib/api/client'
import FlashlightList from '@/components/flashlights/FlashlightList'
import AddFlashlightModal from '@/components/flashlights/AddFlashlightModal'
import FilterBar from '@/components/flashlights/FilterBar'
import Pagination from '@/components/flashlights/Pagination'
import { SortOption } from '@/components/flashlights/SortControl'
import { Flashlight, Manufacturer, EmitterType } from '@/types/flashlight'
import { getDateValue, getTextValue } from '@/utils/sorting'

export default function CollectionPage() {
  const [flashlights, setFlashlights] = useState<Flashlight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFlashlight, setEditingFlashlight] = useState<Flashlight | null>(null)
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedManufacturer, setSelectedManufacturer] = useState('all')
  const [selectedEmitterType, setSelectedEmitterType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])
  const [emitterTypes, setEmitterTypes] = useState<EmitterType[]>([])
  
  // Sorting state
  const [sortBy, setSortBy] = useState<SortOption>({ field: 'model', direction: 'asc' })
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(24)
  
  // Debounce search term for better performance
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  
  const router = useRouter()
  const supabase = createClient()

  const checkAuth = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/signin')
    }
  }, [router, supabase])

  const fetchFlashlights = useCallback(async () => {
    try {
      const response = await apiFetch('/api/flashlights')
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/signin')
          return
        }
        throw new Error('Failed to fetch flashlights')
      }
      
      const data = await response.json()
      setFlashlights(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [router])

  const fetchManufacturers = useCallback(async () => {
    try {
      const response = await apiFetch('/api/manufacturers')
      if (response.ok) {
        const data = await response.json()
        setManufacturers(data)
      }
    } catch (err) {
      console.error('Failed to fetch manufacturers:', err)
    }
  }, [])

  const fetchEmitterTypes = useCallback(async () => {
    try {
      const response = await apiFetch('/api/emitter-types')
      if (response.ok) {
        const data = await response.json()
        setEmitterTypes(data)
      }
    } catch (err) {
      console.error('Failed to fetch emitter types:', err)
    }
  }, [])

  useEffect(() => {
    async function initData() {
      await checkAuth()
      await Promise.all([
        fetchFlashlights(),
        fetchManufacturers(),
        fetchEmitterTypes()
      ])
    }
    initData()
  }, [checkAuth, fetchFlashlights, fetchManufacturers, fetchEmitterTypes])

  async function handleDelete(id: string) {
    try {
      const response = await apiFetch(`/api/flashlights/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete flashlight')
      }
      
      // Remove from local state
      setFlashlights(flashlights.filter(f => f.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  async function handleEdit(id: string) {
    const flashlight = flashlights.find(f => f.id === id)
    if (flashlight) {
      setEditingFlashlight(flashlight)
      setShowAddModal(true)
    }
  }

  async function handleAdd(data: Partial<Flashlight>) {
    try {
      const isEditing = editingFlashlight !== null
      const url = isEditing 
        ? `/api/flashlights/${editingFlashlight.id}` 
        : '/api/flashlights'
      
      const response = await apiFetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('API error:', response.status, errorData)
        throw new Error(errorData?.error || (isEditing ? 'Failed to update flashlight' : 'Failed to add flashlight'))
      }
      
      const flashlight = await response.json()
      
      if (isEditing) {
        setFlashlights(flashlights.map(f => f.id === flashlight.id ? flashlight : f))
      } else {
        setFlashlights([flashlight, ...flashlights])
      }
      
      setShowAddModal(false)
      setEditingFlashlight(null)
    } catch (err) {
      throw err // Let the modal handle the error
    }
  }

  // Filter callbacks
  const handleClearFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedManufacturer('all')
    setSelectedEmitterType('all')
    setSelectedStatus('all')
    setCurrentPage(1) // Reset to page 1 when filters change
  }, [])

  // Sorting callback
  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortBy(newSort)
    setCurrentPage(1) // Reset to page 1 when sorting changes
  }, [])

  // Pagination callbacks
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to page 1 when items per page changes
  }, [])

  // Filtering and sorting logic
  const filteredFlashlights = useMemo(() => {
    let filtered = flashlights

    // Search filter (search in model, manufacturer, and notes)
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter(flashlight => 
        flashlight.model.toLowerCase().includes(searchLower) ||
        flashlight.manufacturer.toLowerCase().includes(searchLower) ||
        (flashlight.notes && flashlight.notes.toLowerCase().includes(searchLower))
      )
    }

    // Manufacturer filter (handle both manufacturer name and custom_manufacturer fields)
    if (selectedManufacturer !== 'all') {
      filtered = filtered.filter(flashlight => 
        flashlight.manufacturer === selectedManufacturer
      )
    }

    // Emitter type filter (handle both emitter type names and custom_emitter_type fields)
    if (selectedEmitterType !== 'all') {
      filtered = filtered.filter(flashlight => 
        flashlight.emitters.some(emitter => emitter.type === selectedEmitterType)
      )
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(flashlight => flashlight.status === selectedStatus)
    }

    // Sorting logic
    const sorted = [...filtered].sort((a, b) => {
      const { field, direction } = sortBy
      const multiplier = direction === 'asc' ? 1 : -1

      let aValue: string | number | null
      let bValue: string | number | null

      switch (field) {
        case 'model':
          aValue = getTextValue(a.model)
          bValue = getTextValue(b.model)
          break
        case 'manufacturer':
          aValue = getTextValue(a.manufacturer)
          bValue = getTextValue(b.manufacturer)
          break
        case 'purchase_date':
          aValue = getDateValue(a.purchase_date, direction)
          bValue = getDateValue(b.purchase_date, direction)
          return (aValue - bValue) * multiplier
        case 'status':
          aValue = getTextValue(a.status)
          bValue = getTextValue(b.status)
          break
        case 'created_at':
          aValue = getDateValue(a.created_at, direction)
          bValue = getDateValue(b.created_at, direction)
          return (aValue - bValue) * multiplier
        default:
          return 0
      }

      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * multiplier
      }

      return 0
    })

    return sorted
  }, [flashlights, debouncedSearchTerm, selectedManufacturer, selectedEmitterType, selectedStatus, sortBy])

  // Reset to page 1 when filters or sorting change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, selectedManufacturer, selectedEmitterType, selectedStatus, sortBy])

  // Calculate paginated results
  const paginatedFlashlights = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredFlashlights.slice(startIndex, endIndex)
  }, [filteredFlashlights, currentPage, itemsPerPage])

  // Pagination calculations
  const totalPages = Math.ceil(filteredFlashlights.length / itemsPerPage)
  const startItem = filteredFlashlights.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, filteredFlashlights.length)

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (selectedManufacturer !== 'all') count++
    if (selectedEmitterType !== 'all') count++
    if (selectedStatus !== 'all') count++
    if (debouncedSearchTerm) count++
    return count
  }, [selectedManufacturer, selectedEmitterType, selectedStatus, debouncedSearchTerm])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Flashlight Collection</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Add Flashlight
        </button>
      </div>
      
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <>
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedManufacturer={selectedManufacturer}
            onManufacturerChange={setSelectedManufacturer}
            selectedEmitterType={selectedEmitterType}
            onEmitterTypeChange={setSelectedEmitterType}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            manufacturers={manufacturers}
            emitterTypes={emitterTypes}
            activeFilterCount={activeFilterCount}
            onClearFilters={handleClearFilters}
            resultCount={filteredFlashlights.length}
            totalCount={flashlights.length}
          />
          <FlashlightList
            flashlights={paginatedFlashlights}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={filteredFlashlights.length}
            startItem={startItem}
            endItem={endItem}
          />
        </>
      )}
      
      <AddFlashlightModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingFlashlight(null)
        }}
        onSubmit={handleAdd}
        flashlight={editingFlashlight}
      />
    </div>
  )
}