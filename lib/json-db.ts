import { Expert } from './types'
import fs from 'fs/promises'
import path from 'path'

const expertsFilePath = path.join(process.cwd(), 'data', 'experts.json')

async function readExperts(): Promise<Expert[]> {
  const data = await fs.readFile(expertsFilePath, 'utf-8')
  return JSON.parse(data)
}

async function writeExperts(experts: Expert[]): Promise<void> {
  await fs.writeFile(expertsFilePath, JSON.stringify(experts, null, 2))
}

export async function getExpert(id: string): Promise<Expert | null> {
  const experts = await readExperts()
  return experts.find(expert => expert.id === id) || null
}

export async function updateExpert(updatedExpert: Expert): Promise<Expert> {
  const experts = await readExperts()
  const index = experts.findIndex(expert => expert.id === updatedExpert.id)
  
  if (index === -1) {
    throw new Error(`Expert with ID ${updatedExpert.id} not found`)
  }

  experts[index] = updatedExpert
  await writeExperts(experts)
  return updatedExpert
}
