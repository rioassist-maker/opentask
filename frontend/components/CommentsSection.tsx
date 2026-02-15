'use client'

import { useState, useEffect } from 'react'
import { Comment, User } from '@/lib/types'
import {
  getComments,
  createComment,
  subscribeToComments,
} from '@/lib/comments'
import { getCurrentUser } from '@/lib/auth'
import { extractMentionedUserIds } from '@/lib/mentions'
import CommentItem from './CommentItem'
import MentionInput from './MentionInput'

interface CommentsSectionProps {
  taskId: string
  users: User[]
}

export default function CommentsSection({
  taskId,
  users,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newCommentContent, setNewCommentContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)

  const currentUser = getCurrentUser()

  useEffect(() => {
    loadComments()

    // Subscribe to real-time updates
    const unsubscribe = subscribeToComments(taskId, (comment) => {
      setComments((prev) => {
        // Check if comment already exists (update) or is new
        const existingIndex = prev.findIndex((c) => c.id === comment.id)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = comment
          return updated
        } else {
          return [...prev, comment]
        }
      })
    })

    return () => {
      unsubscribe()
    }
  }, [taskId])

  const loadComments = async () => {
    try {
      setLoading(true)
      const data = await getComments(taskId)
      setComments(data)
      setError('')
    } catch (err) {
      setError('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCommentContent.trim() || !currentUser) return

    try {
      setSubmitting(true)
      setError('')

      const mentions = extractMentionedUserIds(newCommentContent, users)

      await createComment({
        task: taskId,
        user: currentUser.id,
        content: newCommentContent,
        parent: replyTo || undefined,
        mentions,
      })

      setNewCommentContent('')
      setReplyTo(null)
    } catch (err) {
      setError('Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = (commentId: string) => {
    setReplyTo(commentId)
  }

  const handleCancelReply = () => {
    setReplyTo(null)
  }

  // Organize comments into threads
  const topLevelComments = comments.filter((c) => !c.parent)
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent === parentId)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Comment List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading comments...</p>
        ) : topLevelComments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          topLevelComments.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                users={users}
                onReply={handleReply}
                onDelete={() => loadComments()}
              />
              {/* Nested replies */}
              <div className="ml-8 mt-2 space-y-2">
                {getReplies(comment.id).map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    users={users}
                    onReply={handleReply}
                    onDelete={() => loadComments()}
                    isReply
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        {replyTo && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Replying to comment</span>
            <button
              type="button"
              onClick={handleCancelReply}
              className="text-blue-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        )}

        <MentionInput
          value={newCommentContent}
          onChange={setNewCommentContent}
          users={users}
          placeholder="Add a comment... (Use @ to mention someone)"
          rows={3}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !newCommentContent.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  )
}
