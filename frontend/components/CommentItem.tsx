'use client'

import { useState } from 'react'
import DOMPurify from 'dompurify'
import { Comment, User } from '@/lib/types'
import { updateComment, deleteComment } from '@/lib/comments'
import { getCurrentUser } from '@/lib/auth'
import { extractMentionedUserIds } from '@/lib/mentions'
import MentionInput from './MentionInput'

interface CommentItemProps {
  comment: Comment
  users: User[]
  onReply: (commentId: string) => void
  onDelete: () => void
  isReply?: boolean
}

export default function CommentItem({
  comment,
  users,
  onReply,
  onDelete,
  isReply = false,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [submitting, setSubmitting] = useState(false)

  const currentUser = getCurrentUser()
  const isOwner = currentUser?.id === comment.user

  // Get comment author
  const author = comment.expand?.user || { email: 'Unknown', username: '', id: comment.user }

  const handleUpdate = async () => {
    if (!editContent.trim()) return

    try {
      setSubmitting(true)
      const mentions = extractMentionedUserIds(editContent, users)
      await updateComment(comment.id, { content: editContent, mentions })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      await deleteComment(comment.id)
      onDelete()
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  // Simple markdown-style rendering (bold, italic, code)
  const renderContent = (content: string) => {
    let html = content
    
    // Mentions
    html = html.replace(/@(\w+)/g, '<span class="mention text-blue-600 font-medium">@$1</span>')
    
    // Bold **text**
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    
    // Italic *text*
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    // Inline code `code`
    html = html.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
    
    // Line breaks
    html = html.replace(/\n/g, '<br />')
    
    // Sanitize HTML to prevent XSS attacks
    const sanitizedHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['strong', 'em', 'code', 'span', 'br'],
      ALLOWED_ATTR: ['class']
    })
    
    return sanitizedHtml
  }

  const formattedDate = new Date(comment.created).toLocaleString()

  return (
    <div className={`p-4 bg-gray-50 rounded-lg ${isReply ? 'bg-gray-100' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-medium text-gray-900">
            {author.username || author.email.split('@')[0]}
          </span>
          <span className="text-sm text-gray-500 ml-2">{formattedDate}</span>
        </div>

        {isOwner && !isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <MentionInput
            value={editContent}
            onChange={setEditContent}
            users={users}
            placeholder="Edit comment..."
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={submitting}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setEditContent(comment.content)
              }}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            className="text-gray-700 mb-2"
            dangerouslySetInnerHTML={{ __html: renderContent(comment.content) }}
          />
          {!isReply && (
            <button
              onClick={() => onReply(comment.id)}
              className="text-sm text-blue-600 hover:underline"
            >
              Reply
            </button>
          )}
        </>
      )}
    </div>
  )
}
