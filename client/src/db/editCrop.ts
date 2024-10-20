import { collection, doc, getFirestore, setDoc } from 'firebase/firestore'
import { Crop } from '../util/types'

const db = getFirestore()

async function editCrop(id: string, data: Crop, municipality: string) {
  // Reference the document by its ID and update it
  await setDoc(
    doc(collection(db, 'crops'), id),
    { ...data, municipality },
    { merge: true }
  )
}

export default editCrop
