import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskDetailPanel from '@/components/TaskDetailPanel'
import { Task, TaskStatus } from '@/lib/types'
import * as tasksLib from '@/lib/tasks'

// Mock the updateTask function
jest.mock('@/lib/tasks', () => ({
  updateTask: jest.fn(),
}))

// Mock ProjectBadge component
jest.mock('@/components/ProjectBadge', () => {
  return function MockProjectBadge() {
    return <div>Project Badge</div>
  }
})

const mockTask: Task = {
  id: 'test-task-1',
  title: 'Test Task Title',
  description: 'Test task description',
  status: 'todo' as TaskStatus,
  priority: 'high',
  project: 'proj-1',
  created_by: 'user-1',
  claimed_by: 'user-2',
  created: '2026-02-15T10:00:00.000Z',
  updated: '2026-02-15T15:00:00.000Z',
  completed_at: null,
  expand: {
    created_by: {
      id: 'user-1',
      email: 'creator@test.com',
      username: 'creator',
      created: '2026-01-01T00:00:00.000Z',
      updated: '2026-01-01T00:00:00.000Z',
    },
    claimed_by: {
      id: 'user-2',
      email: 'claimer@test.com',
      username: 'claimer',
      created: '2026-01-01T00:00:00.000Z',
      updated: '2026-01-01T00:00:00.000Z',
    },
    project: {
      id: 'proj-1',
      name: 'Test Project',
      description: 'Test project description',
      color: '#3b82f6',
      created: '2026-01-01T00:00:00.000Z',
      updated: '2026-01-01T00:00:00.000Z',
    },
  },
}

describe('TaskDetailPanel', () => {
  const mockOnClose = jest.fn()
  const mockOnUpdate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal with task details', () => {
    render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    expect(screen.getByText('Test Task Title')).toBeInTheDocument()
    expect(screen.getByText('Test task description')).toBeInTheDocument()
    expect(screen.getByText('ID: test-task-1')).toBeInTheDocument()
  })

  it('renders all task metadata', () => {
    render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    expect(screen.getByText('creator')).toBeInTheDocument()
    expect(screen.getByText('claimer')).toBeInTheDocument()
    expect(screen.getByText('Project Badge')).toBeInTheDocument()
  })

  it('closes modal when X button is clicked', () => {
    render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    const closeButton = screen.getByText('×')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('closes modal when backdrop is clicked', () => {
    const { container } = render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    const backdrop = container.querySelector('div[class*="fixed inset-0"]')
    if (backdrop) {
      fireEvent.click(backdrop)
      expect(mockOnClose).toHaveBeenCalled()
    }
  })

  it('closes modal when ESC key is pressed', () => {
    render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('handles title edit mode', async () => {
    const { rerender } = render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    const titleElement = screen.getByText('Test Task Title')
    fireEvent.click(titleElement)

    // Should now show input
    await waitFor(() => {
      const inputs = screen.getAllByDisplayValue('Test Task Title')
      expect(inputs.length).toBeGreaterThan(0)
    })
  })

  it('updates task title via API', async () => {
    const updatedTask = {
      ...mockTask,
      title: 'Updated Title',
    }

    ;(tasksLib.updateTask as jest.Mock).mockResolvedValue(updatedTask)

    render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    // Click title to edit
    const titleElement = screen.getByText('Test Task Title')
    fireEvent.click(titleElement)

    // Find input and change it
    const titleInput = (screen.getAllByDisplayValue(
      'Test Task Title'
    )[0] as HTMLInputElement)
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Updated Title')

    // Click save button
    const saveButtons = screen.getAllByText('Save')
    fireEvent.click(saveButtons[0])

    // Verify updateTask was called
    await waitFor(() => {
      expect(tasksLib.updateTask).toHaveBeenCalledWith('test-task-1', {
        title: 'Updated Title',
      })
    })
  })

  it('updates task status via API', async () => {
    const updatedTask = {
      ...mockTask,
      status: 'in_progress' as TaskStatus,
    }

    ;(tasksLib.updateTask as jest.Mock).mockResolvedValue(updatedTask)

    render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    const inProgressButton = screen.getByRole('button', {
      name: /in progress/i,
    })
    fireEvent.click(inProgressButton)

    await waitFor(() => {
      expect(tasksLib.updateTask).toHaveBeenCalledWith('test-task-1', {
        status: 'in_progress',
      })
    })
  })

  it('updates task priority via API', async () => {
    const updatedTask = {
      ...mockTask,
      priority: 'urgent',
    }

    ;(tasksLib.updateTask as jest.Mock).mockResolvedValue(updatedTask)

    render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    const urgentButton = screen.getByRole('button', {
      name: /urgent/i,
    })
    fireEvent.click(urgentButton)

    await waitFor(() => {
      expect(tasksLib.updateTask).toHaveBeenCalledWith('test-task-1', {
        priority: 'urgent',
      })
    })
  })

  it('displays success message after update', async () => {
    ;(tasksLib.updateTask as jest.Mock).mockResolvedValue(mockTask)

    render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    const statusButton = screen.getByRole('button', { name: /backlog/i })
    fireEvent.click(statusButton)

    await waitFor(() => {
      expect(screen.getByText(/status updated/i)).toBeInTheDocument()
    })
  })

  it('displays error message on update failure', async () => {
    ;(tasksLib.updateTask as jest.Mock).mockRejectedValue(
      new Error('API Error')
    )

    render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    const statusButton = screen.getByRole('button', { name: /backlog/i })
    fireEvent.click(statusButton)

    await waitFor(() => {
      expect(screen.getByText(/API Error/i)).toBeInTheDocument()
    })
  })

  it('disables buttons during loading', async () => {
    ;(tasksLib.updateTask as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockTask), 1000)
        })
    )

    render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    const statusButton = screen.getByRole('button', { name: /backlog/i })
    fireEvent.click(statusButton)

    // Should be disabled during loading
    await waitFor(() => {
      expect(statusButton).toBeDisabled()
    })
  })

  it('calls onUpdate with updated task after successful update', async () => {
    const updatedTask = {
      ...mockTask,
      status: 'in_progress' as TaskStatus,
    }

    ;(tasksLib.updateTask as jest.Mock).mockResolvedValue(updatedTask)

    render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    const inProgressButton = screen.getByRole('button', {
      name: /in progress/i,
    })
    fireEvent.click(inProgressButton)

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(updatedTask)
    })
  })

  it('renders priority selector', () => {
    render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })

  it('renders status selector', () => {
    render(
      <TaskDetailPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    )

    expect(screen.getByRole('button', { name: /backlog/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /in progress/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /blocked/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument()
  })
})
