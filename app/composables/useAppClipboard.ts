export default function () {
  const { copy, copied, isSupported } = useClipboard()
  const toast = useToast()

  const copyToClipboard = async (text: string, description: string = 'Link copied to clipboard') => {
    if (!isSupported.value) {
      toast.add({
        title: 'Error',
        description: 'Clipboard not supported in this browser',
        color: 'error',
      })
      return
    }

    try {
      await copy(text)
      toast.add({
        title: 'Success',
        description,
        icon: 'i-lucide-check-circle',
        color: 'success',
      })
    }
    catch (err) {
      console.log(err)
      toast.add({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        color: 'error',
      })
    }
  }

  return {
    copyToClipboard,
    copied,
  }
}
