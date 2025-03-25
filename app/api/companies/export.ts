import { NextApiRequest, NextApiResponse } from 'next';
import { getCompaniesCollection } from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const companiesCollection = await getCompaniesCollection();
    const companies = await companiesCollection.find({}).toArray();

const txtContent = companies.map(company => {
      return `Company Name: ${company.name}\nAddress: ${company.address}\nEmail: ${company.email}\nPhone: ${company.phone}\n\n`;
    }).join('');

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=companies.txt');
    res.status(200).send(txtContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export companies' });
  }
}
