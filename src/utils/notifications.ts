// Simple notification system for production
export interface NotificationOptions {
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

export const showNotification = (options: NotificationOptions) => {
  const { type, title, message, duration = 5000 } = options
  
  // Create notification element
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 max-w-sm bg-white rounded-lg shadow-lg border-l-4 z-50 ${
    type === 'success' ? 'border-green-500' : 
    type === 'error' ? 'border-red-500' : 
    type === 'warning' ? 'border-yellow-500' : 
    'border-blue-500'
  }`
  
  notification.innerHTML = `
    <div class="flex items-start p-4">
      <div class="flex-shrink-0">
        ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
      </div>
      <div class="ml-3 flex-1">
        <div class="text-sm font-medium text-gray-900">${title}</div>
        ${message ? `<div class="text-sm text-gray-500 mt-1">${message}</div>` : ''}
      </div>
      <button class="ml-4 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
        ×
      </button>
    </div>
  `
  
  // Add to DOM
  document.body.appendChild(notification)
  
  // Auto remove after duration
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, duration)
}

export const showSuccess = (title: string, message?: string) => {
  showNotification({ type: 'success', title, message })
}

export const showError = (title: string, message?: string) => {
  showNotification({ type: 'error', title, message })
}

export const showInfo = (title: string, message?: string) => {
  showNotification({ type: 'info', title, message })
}

export const showWarning = (title: string, message?: string) => {
  showNotification({ type: 'warning', title, message })
}