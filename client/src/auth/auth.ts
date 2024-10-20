import {
  getAuth,
  getIdTokenResult,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth'
import app from '../firebase'

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)

// Define a type for the function response
type SignInResponse = {
  success: boolean
  user?: UserCredential
  error?: string
}

// Function to sign in a user with email and password
export async function signInUser(
  email: string,
  password: string
): Promise<SignInResponse> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    return { success: true, user: userCredential }
  } catch (error: any) {
    const errorCode = error.code
    const errorMessage = error.message
    console.error('Error signing in:', errorCode, errorMessage)
    return { success: false, error: errorMessage }
  }
}

// Function to log out a user
export async function logOutUser(): Promise<void> {
  try {
    await signOut(auth)
  } catch (error: any) {
    console.error('Error signing out:', error.message)
  }
}

export async function getUserCustomClaims() {
  const user = auth.currentUser // Get the current signed-in user

  if (!user) {
    console.error('No user is currently signed in')
    return
  }

  try {
    const idTokenResult = await getIdTokenResult(user)

    // Access custom claims from the ID token result
    const customClaims = idTokenResult.claims

    return customClaims
  } catch (error: any) {
    console.error('Error retrieving ID token or custom claims:', error.message)
  }
}
