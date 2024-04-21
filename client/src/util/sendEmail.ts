type Options = {
  from?: string
  to?: string
  subject?: string
  text?: string
  html?: string
}
async function sendEmail(options: Options) {
  const request = await fetch(
    `${import.meta.env.VITE_API_URL}/api/email/send`,
    {
      method: 'POST',
      body: JSON.stringify(options),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  const response = await request.json()

  return response
}

export default sendEmail
