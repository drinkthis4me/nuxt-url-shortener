export default function () {
  const config = useRuntimeConfig()

  const getShortUrl = (shortCode: string) => {
    return `${config.public.appUrl}/${shortCode}`
  }

  return {
    getShortUrl,
  }
}
