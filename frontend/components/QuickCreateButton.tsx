'use client'

import Link from 'next/link'

export default function QuickCreateButton() {
  return (
    <Link
      href="/tasks/new"
      className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all flex items-center justify-center text-3xl z-30"
      title="Create new task"
    >
      +
    </Link>
  )
}
