import { User } from './types'

export interface MentionMatch {
  index: number
  username: string
  userId?: string
}

/**
 * Parse @mentions from text
 * Returns array of usernames found in text
 */
export function parseMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g
  const matches = []
  let match

  while ((match = mentionRegex.exec(text)) !== null) {
    matches.push(match[1])
  }

  return matches
}

/**
 * Get cursor position for @ detection
 */
export function getCursorMentionContext(
  text: string,
  cursorPosition: number
): { inMention: boolean; searchTerm: string; startPos: number } | null {
  // Find the last @ before cursor
  const textBeforeCursor = text.substring(0, cursorPosition)
  const lastAtIndex = textBeforeCursor.lastIndexOf('@')

  if (lastAtIndex === -1) {
    return null
  }

  // Check if there's a space between @ and cursor
  const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1)
  if (textAfterAt.includes(' ')) {
    return null
  }

  return {
    inMention: true,
    searchTerm: textAfterAt,
    startPos: lastAtIndex,
  }
}

/**
 * Filter users by search term
 */
export function filterUsers(users: User[], searchTerm: string): User[] {
  if (!searchTerm) return users

  const lowerSearch = searchTerm.toLowerCase()
  return users.filter(
    (user) =>
      user.email.toLowerCase().includes(lowerSearch) ||
      (user.username && user.username.toLowerCase().includes(lowerSearch))
  )
}

/**
 * Replace mention text with selected user
 */
export function insertMention(
  text: string,
  cursorPosition: number,
  user: User
): { newText: string; newCursorPosition: number } {
  const context = getCursorMentionContext(text, cursorPosition)
  if (!context) {
    return { newText: text, newCursorPosition: cursorPosition }
  }

  const username = user.username || user.email.split('@')[0]
  const before = text.substring(0, context.startPos)
  const after = text.substring(cursorPosition)
  const newText = `${before}@${username} ${after}`
  const newCursorPosition = context.startPos + username.length + 2 // +2 for @ and space

  return { newText, newCursorPosition }
}

/**
 * Extract user IDs from text based on mentioned usernames
 */
export function extractMentionedUserIds(
  text: string,
  allUsers: User[]
): string[] {
  const mentionedUsernames = parseMentions(text)
  const userIds: string[] = []

  mentionedUsernames.forEach((username) => {
    const user = allUsers.find(
      (u) =>
        u.username === username || u.email.split('@')[0] === username
    )
    if (user && !userIds.includes(user.id)) {
      userIds.push(user.id)
    }
  })

  return userIds
}

/**
 * Render text with highlighted mentions
 */
export function renderWithMentions(text: string): string {
  return text.replace(
    /@(\w+)/g,
    '<span class="mention">@$1</span>'
  )
}
