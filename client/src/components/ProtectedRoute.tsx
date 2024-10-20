import {
  getAuth,
  getIdTokenResult,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom' // React Router v6
import app from '../firebase'

type ProtectedRouteProps = {
  redirectPath?: string
  requiredClaim?: string
  requiredClaimValue?: any
  children: React.ReactNode
}

// ProtectedRoute Component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/login', // Default redirect to /login
  requiredClaim,
  requiredClaimValue,
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  const auth = getAuth(app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true)

      if (user) {
        // If custom claims are required, verify them
        if (requiredClaim) {
          const idTokenResult = await getIdTokenResult(user)
          const claims = idTokenResult.claims

          // Check if the required claim matches the expected value
          if (claims[requiredClaim] === requiredClaimValue) {
            setAuthorized(true)
          } else {
            setAuthorized(false)
          }
        } else {
          // No custom claim check required
          setAuthorized(true)
        }

        setUser(user)
      } else {
        setUser(null)
        setAuthorized(false)
      }

      setLoading(false)
    })

    // Cleanup the subscription
    return () => unsubscribe()
  }, [auth, requiredClaim, requiredClaimValue])

  if (loading) {
    return <div>Loading...</div> // You can replace this with a spinner or loading component
  }

  if (!user || !authorized) {
    return <Navigate to={redirectPath} />
  }

  // If the user is authenticated and authorized, render the child components
  return children
}

export default ProtectedRoute
