'use client'

import { useState } from 'react'
import FlashlightCard from './FlashlightCard'
import { Flashlight } from '@/types/flashlight'

interface FlashlightListProps {
  flashlights: Flashlight[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function FlashlightList({ flashlights, onEdit, onDelete }: FlashlightListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  
  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      if (onDelete) {
        onDelete(id)
      }
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      // Reset confirmation after 5 seconds
      setTimeout(() => setDeleteConfirm(null), 5000)
    }
  }
  
  if (flashlights.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No flashlights</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by adding your first flashlight to the collection.
        </p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashlights.map((flashlight) => (
        <div key={flashlight.id} className="relative">
          <FlashlightCard
            flashlight={flashlight}
            onEdit={onEdit}
            onDelete={() => handleDelete(flashlight.id)}
          />
          {deleteConfirm === flashlight.id && (
            <div className="absolute inset-0 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Delete this flashlight?
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Click delete again to confirm
                </p>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}