'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  itemName: string
  onDelete: () => Promise<void> | void
  deleteAction?: () => Promise<void> | void
}

export function DeleteButton({ itemName, onDelete, deleteAction }: DeleteButtonProps) {
  const actualDelete = deleteAction || onDelete
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      await actualDelete()
      router.refresh()
      setOpen(false)
    } catch (error: any) {
      alert(error.message || 'Failed to delete')
      setLoading(false)
    }
  }

  return (
    <>
      <Button plain onClick={() => setOpen(true)}>
        Delete
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete {itemName}?</DialogTitle>
        <DialogBody>
          <DialogDescription>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogDescription>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

