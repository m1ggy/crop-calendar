import { Crop } from '../util/types'
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore'

const db = getFirestore()

async function addCrop(data: Crop, municipality: string) {
  await setDoc(doc(collection(db, 'crops')), { ...data, municipality })
}

export default addCrop
