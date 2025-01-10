import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { db } from './firebase';

// ドキュメントの型
export interface UserDocument {
    id: string;
    accountID: Number;
    record: Array<string>;
}


export async function getDocumentsByAccountID(accountID: Number): Promise<UserDocument[]> {
    const colRef = collection(db, 'master');
    const q = query(colRef, where('accountID', '==', accountID));

    const snapshot = await getDocs(q);
    const documents = snapshot.docs.map(doc => {
        const data = doc.data() as UserDocument;
        return {
            ...data,
            id: doc.id,  // idを明示的に追加
        };
    });

    return documents;
}
