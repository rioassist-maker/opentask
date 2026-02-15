'use client'

import { useState, useRef } from 'react'
import { User } from '@/lib/types'
import {
  getCursorMentionContext,
  filterUsers,
  insertMention,
} from '@/lib/mentions'

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  users: User[]
  placeholder?: string
  className?: string
  rows?: number
}

export default function MentionInput({
  value,
  onChange,
  users,
  placeholder,
  className = '',
  rows = 4,
}: MentionInputProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Check if typing @ mention
    const cursorPos = e.target.selectionStart
    const context = getCursorMentionContext(newValue, cursorPos)

    if (context && context.inMention) {
      const filtered = filterUsers(users, context.searchTerm)
      setFilteredUsers(filtered)
      setShowDropdown(filtered.length > 0)
      setSelectedIndex(0)

      // Calculate dropdown position
      if (textareaRef.current) {
        const { top, left } = getCaretCoordinates(textareaRef.current)
        setDropdownPosition({ top, left })
      }
    } else {
      setShowDropdown(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showDropdown) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < filteredUsers.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      selectUser(filteredUsers[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  const selectUser = (user: User) => {
    if (!textareaRef.current) return

    const cursorPos = textareaRef.current.selectionStart
    const { newText, newCursorPosition } = insertMention(value, cursorPos, user)
    onChange(newText)
    setShowDropdown(false)

    // Set cursor position after update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = newCursorPosition
        textareaRef.current.selectionEnd = newCursorPosition
        textareaRef.current.focus()
      }
    }, 0)
  }

  // Simple caret position calculation
  function getCaretCoordinates(element: HTMLTextAreaElement): {
    top: number
    left: number
  } {
    const { offsetTop, offsetLeft, offsetHeight } = element
    return {
      top: offsetTop + offsetHeight,
      left: offsetLeft,
    }
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />

      {showDropdown && (
        <div
          className="absolute z-50 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
          style={{
            top: `${dropdownPosition.top}px`,
          }}
        >
          {filteredUsers.map((user, index) => (
            <div
              key={user.id}
              onClick={() => selectUser(user)}
              className={`px-4 py-2 cursor-pointer ${
                index === selectedIndex
                  ? 'bg-blue-100'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">
                {user.username || user.email.split('@')[0]}
              </div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
