export const useUserLogout = () => {
  const isLoading = ref(false)
  const {
    ready,
    loggedIn,
    fetch: fetchSession,
    user,
    clear: clearSession,
  } = useUserSession()
  const toast = useToast()

  const logout = async () => {
    isLoading.value = true
    try {
      if (!ready) {
        await fetchSession()
      }

      if (!loggedIn) return

      await clearSession()
      await navigateTo('/')
    }
    catch (err) {
      console.log(err)
      toast.add({ title: 'Error', description: 'Something went wrong', color: 'error' })
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    ready,
    loggedIn,
    user,

    fetchSession,
    clearSession,
    logout,
  }
}
