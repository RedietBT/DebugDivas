// Team Member 5: Utilities
// Clipboard operations

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      return fallbackCopyToClipboard(text)
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopyToClipboard(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  textarea.style.top = '0'
  textarea.style.left = '0'
  
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  
  let success = false
  try {
    success = document.execCommand('copy')
  } catch (err) {
    console.error('Fallback copy failed:', err)
  }
  
  document.body.removeChild(textarea)
  return success
}

/**
 * Read from clipboard
 */
export async function pasteFromClipboard(): Promise<string | null> {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      return await navigator.clipboard.readText()
    }
    return null
  } catch (error) {
    console.error('Failed to read from clipboard:', error)
    return null
  }
}

