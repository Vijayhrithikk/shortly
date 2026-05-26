import { useEffect, useState } from "react"

import {
  createShortURL,
  getMyUrls,
} from "../api/url"

export default function DashboardPage() {
  const [urls, setUrls] = useState<any[]>([])

  const [url, setURL] = useState("")
  const [customCode, setCustomCode] =
    useState("")

  const fetchURLs = async () => {
    try {
      const data = await getMyUrls()

      setUrls(data.urls)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchURLs()
  }, [])

  const handleCreate = async () => {
    try {
      await createShortURL(
        url,
        customCode
      )

      setURL("")
      setCustomCode("")

      fetchURLs()
    } catch (error) {
      console.error(error)

      alert("Failed to create URL")
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="space-y-4 border p-6 rounded-xl mb-10">
        <input
          type="text"
          placeholder="Enter URL"
          className="w-full border p-3 rounded"
          value={url}
          onChange={(e) =>
            setURL(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Custom code (optional)"
          className="w-full border p-3 rounded"
          value={customCode}
          onChange={(e) =>
            setCustomCode(
              e.target.value
            )
          }
        />

        <button
          onClick={handleCreate}
          className="bg-black text-white px-5 py-3 rounded"
        >
          Create Short URL
        </button>
      </div>

      <div className="space-y-4">
        {urls.map((url) => (
          <div
            key={url.id}
            className="border p-5 rounded-xl"
          >
            <p className="text-gray-500 break-all">
              {url.original_url}
            </p>

            <a
              href={`http://localhost:8080/${url.short_code}`}
              target="_blank"
              className="text-blue-600 font-bold"
            >
              {url.short_code}
            </a>

            <p className="mt-2">
              Clicks: {url.clicks}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}