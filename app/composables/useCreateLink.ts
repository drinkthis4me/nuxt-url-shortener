import type { LinkSchema } from '~~/shared/schemas/link'
import type { LinkWithShortUrl } from '~~/shared/types/response/link'
import useShortUrl from './useShortUrl'

export default function () {
  const formState = reactive<Partial<LinkSchema>>({
    longUrl: '',
    expiresAt: undefined,
    password: undefined,
  })
  const isLoading = ref(false)
  const {
    ready,
    loggedIn,
    user,
    fetch: fetchSession,
  } = useUserSession()
  const { getShortUrl } = useShortUrl()
  const toast = useToast()

  const createLink = async (body: LinkSchema): Promise<LinkWithShortUrl | null> => {
    isLoading.value = true
    try {
      if (!ready) {
        await fetchSession()
      }

      let payload = { ...body }

      if (loggedIn.value && user.value) {
        payload = {
          ...payload,
          userId: user.value.id,
        }
      }

      const res = await $fetch('/api/links', {
        method: 'POST',
        body: payload,
      })

      return {
        ...res,
        shortUrl: getShortUrl(res.shortCode!),
      }
    }
    catch (err) {
      console.log(err)
      toast.add({ title: 'Error', description: 'Something went wrong', color: 'error' })
      return null
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    formState,
    isLoading,

    getShortUrl,
    createLink,
  }
}
