import type { UserLoginSchema } from '~~/shared/schemas/user'

export const useUserLogin = () => {
  const formState = reactive<UserLoginSchema>({
    email: '',
    password: '',
  })
  const isLoading = ref(false)
  const {
    ready,
    loggedIn,
    fetch: fetchSession,
    user,
    clear: clearSession,
  } = useUserSession()
  const toast = useToast()

  const login = async (body: UserLoginSchema) => {
    isLoading.value = true
    try {
      await $fetch('/api/login', {
        method: 'POST',
        body,
      })

      await fetchSession()
      await navigateTo('/app/dashboard')
    }
    catch (err) {
      console.log(err)
      toast.add({ title: 'Error', description: 'Bad credential', color: 'error' })
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    formState,
    isLoading,
    ready,
    loggedIn,
    user,

    fetchSession,
    clearSession,
    login,
  }
}
