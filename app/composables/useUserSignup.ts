import type { UserCreateSchema } from '~~/shared/schemas/user'

export const useUserSignup = () => {
  const formState = reactive<UserCreateSchema>({
    name: undefined,
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

  const signup = async (body: UserCreateSchema) => {
    isLoading.value = true
    try {
      await $fetch('/api/users', {
        method: 'POST',
        body,
      })

      await fetchSession()
      await navigateTo('/app/dashboard')
    }
    catch (err) {
      console.log(err)
      toast.add({ title: 'Error', description: 'Sign up failed', color: 'error' })
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
    signup,
  }
}
