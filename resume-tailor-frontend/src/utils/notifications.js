/**
 * Utility functions for showing notifications and feedback
 */

// Show a toast notification
export function showToast(message, type = "info") {
    // This is a simple implementation
    // In a real app, you might use a toast library like react-toastify
    console.log(`[${type.toUpperCase()}] ${message}`)
  
    // Create a toast element
    const toast = document.createElement("div")
    toast.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg z-50 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
          ? "bg-red-500 text-white"
          : "bg-blue-500 text-white"
    }`
    toast.textContent = message
  
    // Add to document
    document.body.appendChild(toast)
  
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add("opacity-0", "transition-opacity", "duration-300")
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 3000)
  }
  
  // Show a success notification
  export function showSuccess(message) {
    showToast(message, "success")
  }
  
  // Show an error notification
  export function showError(message) {
    showToast(message, "error")
  }
  