'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client-wrapper'
import { apiFetch } from '@/lib/api/client'
import FlashlightList from '@/components/flashlights/FlashlightList'
import AddFlashlightModal from '@/components/flashlights/AddFlashlightModal'
import { Flashlight } from '@/types/flashlight'

export default function CollectionPage() {
  const [flashlights, setFlashlights] = useState<Flashlight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFlashlight, setEditingFlashlight] = useState<Flashlight | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
    fetchFlashlights()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/signin')
    }
  }

  async function fetchFlashlights() {
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
  }

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

  async function handleAdd(data: any) {
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
        <FlashlightList
          flashlights={flashlights}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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