import { deleteDoc, doc, getFirestore } from 'firebase/firestore'

const db = getFirestore()
async function deleteCrop(cropId: string) {
  await deleteDoc(doc(db, 'crops', cropId))
}

export default deleteCrop
