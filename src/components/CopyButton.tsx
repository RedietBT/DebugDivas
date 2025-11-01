import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from './ui/button'

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
    <Button
      onClick={handleCopy}
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}

