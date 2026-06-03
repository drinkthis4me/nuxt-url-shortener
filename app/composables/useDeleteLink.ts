import { linkBulkDeleteSchema } from '#shared/schemas/link'

export default function () {
  const toast = useToast()

  const deleteLink = async (id: number) => {
    try {
      await $fetch('/api/links/' + id, {
        method: 'DELETE',
      })

      toast.add({ title: 'Success', description: 'The link has been deleted.', color: 'success' })
    }
    catch (err) {
      console.log(err)
      toast.add({ title: 'Error', description: 'Failed to delete the link', color: 'error' })
    }
  }

  const deleteLinks = async (ids: number[]) => {
    try {
      if (ids.length === 0) {
        throw new Error('No link selected')
      }

      const body = { ids }
      const validBody = linkBulkDeleteSchema.parse(body)

      const res = await $fetch('/api/links/bulk-delete', {
        method: 'DELETE',
        body: validBody,
      })

      if (res.count > 0) {
        toast.add({
          title: 'Success',
          description: `${res.count} link has been deleted.`,
          color: 'success',
        })
      }
      else {
        toast.add({
          title: 'Warning',
          description: `No link deleted. Select rows to delete links.`,
          color: 'warning',
        })
      }
    }
    catch (err) {
      console.log(err)
      toast.add({ title: 'Error', description: 'Failed to delete links', color: 'error' })
    }
  }

  return {
    deleteLink,
    deleteLinks,
  }
}
