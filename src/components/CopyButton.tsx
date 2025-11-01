// Team Member 1: UI Components
// Button to copy text to clipboard

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  text: string
  onCopy?: (text: string) => Promise<boolean>
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, onCopy }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    let success = false
    
    if (onCopy) {
      success = await onCopy(text)
    } else {
      // Default copy behavior
      try {
        await navigator.clipboard.writeText(text)
        success = true
      } catch (err) {
        success = false
      }
    }

    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="p-2 hover:bg-cursor-bg rounded transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-cursor-success" />
      ) : (
        <Copy className="w-4 h-4 text-cursor-text" />
      )}
    </button>
  )
}

