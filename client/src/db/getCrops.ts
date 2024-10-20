import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'

const db = getFirestore()

async function getCrops(municipality: string) {
  const queryRef = query(
    collection(db, 'crops'),
    where('municipality', '==', municipality)
  )

  const snapshot = await getDocs(queryRef)

  // Map over the snapshot docs and include the document ID
  return snapshot.docs.map((doc) => ({
    id: doc.id, // Include the document ID
    ...doc.data(), // Spread the document data
  }))
}

export default getCrops
