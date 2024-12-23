import type { NextApiRequest, NextApiResponse } from 'next'
import { getDb } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const db = await getDb();
      const { date, time } = req.query;

      if (!date || !time) {
        return res.status(400).json({ message: 'Date and time are required' });
      }

      const result = await db.get(
        `SELECT COUNT(*) as count FROM registrations 
         WHERE registration_date = ? AND registration_time = ?`,
        [date, time]
      );

      res.status(200).json({ count: result.count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Export failed' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

