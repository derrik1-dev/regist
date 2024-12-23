import type { NextApiRequest, NextApiResponse } from 'next'
import { getDb } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const db = await getDb();
      const { fullName, contact, session, gender, date, time } = req.body;

      await db.run(
        `INSERT INTO registrations (full_name, contact, session, gender, registration_date, registration_time)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [fullName, contact, session, gender, date, time]
      );

      res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Registration failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

