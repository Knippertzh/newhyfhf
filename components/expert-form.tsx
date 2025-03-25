'use client'

import { useState } from 'react'
import { Expert } from '@/lib/types'

export function ExpertForm({
  expert,
  action
}: {
  expert?: Expert
  action: (formData: FormData) => Promise<void>
}) {
  const [formData, setFormData] = useState({
    name: expert?.name || '',
    title: expert?.title || '',
    company: expert?.company || '',
    expertise: expert?.expertise || '',
    bio: expert?.bio || '',
    imageUrl: expert?.imageUrl || '',
    email: expert?.email || '',
    website: expert?.website || '',
    linkedin: expert?.linkedin || '',
    twitter: expert?.twitter || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    action(new FormData(form))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
      </div>

      <div>
        <label htmlFor="company" className="block mb-1">Company</label>
          <input
            type="text"
            name="company"
            id="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
      </div>

      <div>
        <label htmlFor="expertise" className="block mb-1">Expertise</label>
          <input
            type="text"
            name="expertise"
            id="expertise"
            value={formData.expertise}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
      </div>

      <div>
        <label htmlFor="bio" className="block mb-1">Bio</label>
          <textarea
            name="bio"
            id="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block mb-1">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            id="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
      </div>

      <div>
        <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
      </div>

      <div>
        <label htmlFor="website" className="block mb-1">Website</label>
          <input
            type="url"
            name="website"
            id="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
      </div>

      <div>
        <label htmlFor="linkedin" className="block mb-1">LinkedIn</label>
          <input
            type="text"
            name="linkedin"
            id="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="username or full profile URL"
          />
      </div>

      <div>
        <label htmlFor="twitter" className="block mb-1">Twitter</label>
          <input
            type="text"
            name="twitter"
            id="twitter"
            value={formData.twitter}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="username or full profile URL"
          />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Changes
      </button>
    </form>
  )
}
