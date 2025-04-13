"use client"

import { useState } from "react"
import { useParams, useLocation } from "react-router-dom"

const SalesDashboard = () => {
  const { projectId } = useParams()
  const query = new URLSearchParams(useLocation().search)
  const role = query.get("role") || "pm"
  const tier = query.get("tier") || "1"

  const [productDescription, setProductDescription] = useState("")
  const [targetClient, setTargetClient] = useState("")
  const [salesPitch, setSalesPitch] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGeneratePitch = async () => {
    if (!productDescription || !targetClient) {
      alert("Please provide both product description and target client.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/generate-sales-pitch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productDescription,
          targetClient,
        }),
      })
      const data = await response.json()
      setSalesPitch(data.salesPitch)
    } catch (error) {
      console.error("Error generating sales pitch:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B19] text-white p-4">
      <div className="bg-[#151528]/80 p-4 rounded-xl border border-amber-500/20 mb-4">
        <h3 className="text-2xl mb-4">Generate Sales Pitch</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold">Product Description</label>
          <textarea
            className="w-full p-2 mt-2 text-black bg-white"
            rows="4"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Describe your product."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold">Target Client</label>
          <textarea
            className="w-full p-2 mt-2 text-black bg-white"
            rows="4"
            value={targetClient}
            onChange={(e) => setTargetClient(e.target.value)}
            placeholder="Describe your target client."
          />
        </div>

        <button
          onClick={handleGeneratePitch}
          className="bg-orange-500 p-2 text-white rounded-xl w-full mt-4"
        >
          {isLoading ? "Generating..." : "Generate Sales Pitch"}
        </button>

        {salesPitch && (
          <div className="mt-6">
            <h3 className="text-xl mb-2">Generated Sales Pitch</h3>
            <p>{salesPitch}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SalesDashboard
