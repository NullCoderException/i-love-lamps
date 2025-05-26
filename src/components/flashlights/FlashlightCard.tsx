import { Flashlight } from '@/types/flashlight'

interface FlashlightCardProps {
  flashlight: Flashlight
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function FlashlightCard({ flashlight, onEdit, onDelete }: FlashlightCardProps) {
  const primaryEmitter = flashlight.emitters?.[0]
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {flashlight.manufacturer} {flashlight.model}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {flashlight.finish} • {flashlight.battery_type}
          </p>
        </div>
        <div className="flex gap-2">
          {onEdit && flashlight.id && (
            <button
              onClick={() => onEdit(flashlight.id!)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && flashlight.id && (
            <button
              onClick={() => onDelete(flashlight.id!)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {primaryEmitter && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Emitters:</p>
          <div className="mt-1">
            {flashlight.emitters?.map((emitter, idx) => (
              <p key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                {emitter.count}x {emitter.type} @ {emitter.cct}K ({emitter.color})
              </p>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium text-gray-700 dark:text-gray-300">Driver:</p>
          <p className="text-gray-600 dark:text-gray-400">{flashlight.driver}</p>
        </div>
        <div>
          <p className="font-medium text-gray-700 dark:text-gray-300">UI:</p>
          <p className="text-gray-600 dark:text-gray-400">{flashlight.ui}</p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          flashlight.status === 'Active' ? 'bg-green-100 text-green-800' :
          flashlight.status === 'New' ? 'bg-blue-100 text-blue-800' :
          flashlight.status === 'Storage' ? 'bg-gray-100 text-gray-800' :
          flashlight.status === 'Gifted' ? 'bg-purple-100 text-purple-800' :
          'bg-red-100 text-red-800'
        }`}>
          {flashlight.status}
        </span>
        
        {flashlight.shipping_status && flashlight.shipping_status !== 'Received' && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            flashlight.shipping_status === 'Ordered' ? 'bg-yellow-100 text-yellow-800' :
            flashlight.shipping_status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {flashlight.shipping_status}
          </span>
        )}
      </div>
      
      {flashlight.notes && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 italic">
          {flashlight.notes}
        </p>
      )}
    </div>
  )
}