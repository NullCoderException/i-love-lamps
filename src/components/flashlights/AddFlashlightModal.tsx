'use client'

import { useState, useEffect } from 'react'
import { 
  Manufacturer,
  EmitterType,
  Flashlight 
} from '@/types/flashlight'
import { fetchManufacturers, fetchEmitterTypes } from '@/lib/api/client'

// Common driver and UI options - since these aren't enums in the types
const COMMON_DRIVERS = [
  'Linear',
  'Linear + FET',
  'Buck',
  'Boost',
  'Buck-Boost',
  'FET',
  'Direct Drive',
  'Constant Current'
]

const COMMON_UIS = [
  'ANDURIL',
  'ANDURIL2',
  'NARSIL',
  'RAMPING',
  'STEPPED',
  'SIMPLE',
  'BISTRO',
  'PROPRIETARY'
]

// Static options for non-lookup tables
const FINISH_GROUPS = [
  'MAO',
  'Anodized',
  'Titanium',
  'Copper',
  'Copper+Titanium',
  'Stainless Steel',
  'Brass'
]

const BATTERY_TYPES = [
  'AA',
  'AAA',
  '14500',
  '18350',
  '18650',
  '21700',
  'AA/14500',
  'AAA/10440',
  'Built-in'
]

const FLASHLIGHT_STATUSES = ['Wanted', 'Ordered', 'Owned', 'Sold']
const SHIPPING_STATUSES = ['Received', 'Shipped', 'Ordered']
const EMITTER_COLORS = ['White', 'Red', 'Green', 'Blue', 'UV', 'RGB', 'Green Laser', 'Red Laser']

interface AddFlashlightModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  flashlight?: Flashlight | null
}

export default function AddFlashlightModal({ isOpen, onClose, onSubmit, flashlight }: AddFlashlightModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emitters, setEmitters] = useState([{ type: '', cct: '', count: 1, color: 'White' }])
  
  // Dynamic data state
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])
  const [emitterTypes, setEmitterTypes] = useState<EmitterType[]>([])
  const [loadingData, setLoadingData] = useState(true)
  
  // Initialize form with flashlight data when editing
  useEffect(() => {
    if (flashlight && flashlight.emitters && flashlight.emitters.length > 0) {
      setEmitters(flashlight.emitters.map(e => ({
        type: e.type || '',
        cct: e.cct?.toString() || '',
        count: e.count || 1,
        color: e.color || 'White'
      })))
    } else {
      setEmitters([{ type: '', cct: '', count: 1, color: 'White' }])
    }
  }, [flashlight])

  // Fetch dynamic data when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          setLoadingData(true)
          const [manufacturersData, emitterTypesData] = await Promise.all([
            fetchManufacturers(),
            fetchEmitterTypes()
          ])
          setManufacturers(manufacturersData)
          setEmitterTypes(emitterTypesData)
        } catch (err) {
          console.error('Error fetching lookup data:', err)
          setError('Failed to load form data')
        } finally {
          setLoadingData(false)
        }
      }
      fetchData()
    }
  }, [isOpen])
  
  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      model: formData.get('model'),
      manufacturer: formData.get('manufacturer'),
      finish: formData.get('finish'),
      finish_group: formData.get('finish_group'),
      battery_type: formData.get('battery_type'),
      driver: formData.get('driver'),
      ui: formData.get('ui'),
      anduril: formData.get('anduril') === 'true',
      status: formData.get('status') || 'Wanted',
      shipping_status: formData.get('shipping_status') || 'Received',
      ip_rating: formData.get('ip_rating') || null,
      purchase_date: formData.get('purchase_date') || null,
      notes: formData.get('notes') || null,
      emitters: emitters.filter(e => e.type).map(e => ({
        ...e,
        cct: e.cct ? parseInt(e.cct) : null
      }))
    }
    
    try {
      await onSubmit(data)
      onClose()
      // Reset form
      setEmitters([{ type: '', cct: '', count: 1, color: 'White' }])
    } catch (err) {
      setError(err instanceof Error ? err.message : flashlight ? 'Failed to update flashlight' : 'Failed to add flashlight')
    } finally {
      setLoading(false)
    }
  }

  const addEmitter = () => {
    setEmitters([...emitters, { type: '', cct: '', count: 1, color: 'White' }])
  }

  const removeEmitter = (index: number) => {
    setEmitters(emitters.filter((_, i) => i !== index))
  }

  const updateEmitter = (index: number, field: string, value: any) => {
    const updated = [...emitters]
    updated[index] = { ...updated[index], [field]: value }
    setEmitters(updated)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{flashlight ? 'Edit Flashlight' : 'Add New Flashlight'}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Model*</label>
                <input
                  type="text"
                  name="model"
                  required
                  defaultValue={flashlight?.model || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Manufacturer*</label>
                <select
                  name="manufacturer"
                  required
                  defaultValue={flashlight?.manufacturer || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  disabled={loadingData}
                >
                  <option value="">{loadingData ? 'Loading...' : 'Select manufacturer'}</option>
                  {manufacturers.map(mfg => (
                    <option key={mfg.id} value={mfg.name}>{mfg.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Finish</label>
                <input
                  type="text"
                  name="finish"
                  defaultValue={flashlight?.finish || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Finish Group</label>
                <select
                  name="finish_group"
                  defaultValue={flashlight?.finish_group || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select finish group</option>
                  {FINISH_GROUPS.map(fg => (
                    <option key={fg} value={fg}>{fg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Battery Type*</label>
                <select
                  name="battery_type"
                  required
                  defaultValue={flashlight?.battery_type || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select battery type</option>
                  {BATTERY_TYPES.map(bt => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Driver</label>
                <input
                  type="text"
                  name="driver"
                  list="driver-options"
                  defaultValue={flashlight?.driver || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Select or enter driver type"
                />
                <datalist id="driver-options">
                  {COMMON_DRIVERS.map(d => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">UI</label>
                <input
                  type="text"
                  name="ui"
                  list="ui-options"
                  defaultValue={flashlight?.ui || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Select or enter UI type"
                />
                <datalist id="ui-options">
                  {COMMON_UIS.map(ui => (
                    <option key={ui} value={ui} />
                  ))}
                </datalist>
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="anduril"
                    value="true"
                    defaultChecked={flashlight?.anduril || false}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Anduril</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  name="status"
                  defaultValue={flashlight?.status || 'Wanted'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  {FLASHLIGHT_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Shipping Status</label>
                <select
                  name="shipping_status"
                  defaultValue={flashlight?.shipping_status || 'Received'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  {SHIPPING_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">IP Rating</label>
                <input
                  type="text"
                  name="ip_rating"
                  placeholder="e.g., IPX8"
                  defaultValue={flashlight?.ip_rating || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Purchase Date</label>
                <input
                  type="date"
                  name="purchase_date"
                  defaultValue={flashlight?.purchase_date || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Emitters</label>
                <button
                  type="button"
                  onClick={addEmitter}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Emitter
                </button>
              </div>
              {emitters.map((emitter, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                  <select
                    value={emitter.type}
                    onChange={(e) => updateEmitter(index, 'type', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    disabled={loadingData}
                  >
                    <option value="">{loadingData ? 'Loading...' : 'Select type'}</option>
                    {emitterTypes.map(type => (
                      <option key={type.id} value={type.name}>{type.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="CCT"
                    value={emitter.cct}
                    onChange={(e) => updateEmitter(index, 'cct', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <input
                    type="number"
                    placeholder="Count"
                    value={emitter.count}
                    onChange={(e) => updateEmitter(index, 'count', parseInt(e.target.value) || 1)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <select
                    value={emitter.color}
                    onChange={(e) => updateEmitter(index, 'color', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">Select color</option>
                    {EMITTER_COLORS.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                  {emitters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmitter(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                name="notes"
                rows={3}
                defaultValue={flashlight?.notes || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
              >
                {loading ? (flashlight ? 'Updating...' : 'Adding...') : (flashlight ? 'Update Flashlight' : 'Add Flashlight')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}