export default defineEventHandler(async (event) => {
  console.log('New request: ' + event.path)

  if (event.path === '/redirect') {
    await sendRedirect(event, 'https://nuxt.com', 302)
  }
})
