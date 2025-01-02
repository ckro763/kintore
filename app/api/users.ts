import type { NextApiRequest, NextApiResponse } from 'next';
import { getDocumentsByAccountID, UserDocument } from '../../lib/firestore';

interface Data {
    documents?: UserDocument[];
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { accountID } = req.query;

    if (!accountID || typeof accountID !== 'string' || Number.isNaN(+accountID)) {
    return res.status(400).json({ error: 'Invalid accountID' });
    }

    try {
        const documents = await getDocumentsByAccountID(+accountID);
        res.status(200).json({ documents });
    } catch (error) {
        console.error('Firestore error:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
}