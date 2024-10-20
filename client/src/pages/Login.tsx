import { Button, Card, CardContent, Input, Typography } from '@mui/joy'
import { getAuth } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInUser } from '../auth/auth'
import app from '../firebase'
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  async function login() {
    try {
      setLoading(true)
      setErrorMessage('')

      if (email && password) {
        const response = await signInUser(email, password)

        if (response.user) {
          navigate('/admin')
        } else throw new Error('An error occurred')
      }
    } catch (error) {
      setErrorMessage('Failed to Login!')
    } finally {
      setLoading(false)
    }
  }

  const currentUser = getAuth(app).currentUser

  if (currentUser) {
    navigate('/admin')
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Card sx={{ width: '400px' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography textColor={'common.black'}>Crop Calendar</Typography>
          <Input
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
            type="email"
            placeholder="email"
          />
          <Input
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            type="password"
            placeholder="password"
          />
          <Button onClick={login} loading={loading}>
            Login
          </Button>

          {errorMessage ? (
            <Typography textColor={'danger.400'}>{errorMessage}</Typography>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
