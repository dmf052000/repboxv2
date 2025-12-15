'use client'

import { DeleteButton } from './delete-button'

interface DeleteButtonWrapperProps {
  itemName: string
  deleteAction: (id: string) => Promise<void>
  id: string
}

export function DeleteButtonWrapper({ itemName, deleteAction, id }: DeleteButtonWrapperProps) {
  const handleDelete = async () => {
    await deleteAction(id)
  }
  return <DeleteButton itemName={itemName} onDelete={handleDelete} />
}
