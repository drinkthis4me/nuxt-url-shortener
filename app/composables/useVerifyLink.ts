import type { LinkVerifySchema } from '~~/shared/schemas/link'

export default function (shortCode: string) {
  const formState = reactive<Partial<LinkVerifySchema>>({
    shortCode,
    password: '',
  })
  const isLoading = ref(false)
  const toast = useToast()

  const verify = async (password: string) => {
    if (!password || !shortCode) return

    isLoading.value = true
    try {
      await $fetch('/api/links/verify', {
        method: 'POST',
        body: {
          shortCode,
          password,
        },
      })
      return true
    }
    catch (err: unknown) {
      formState.password = ''

      let title: string
      let description: string
      const message = getErrorMessage(err)
      if (typeof message === 'string') {
        title = 'Error'
        description = message
      }
      else {
        title = message.statusMessage || 'Error'
        description = message.statusCode === 401
          ? 'Incorrect password'
          : 'Something went wrong, please try again.'
      }

      toast.add({ title, description, color: 'error' })

      return false
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    formState,
    isLoading,
    verify,
  }
}
