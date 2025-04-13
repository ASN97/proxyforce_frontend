// SalesPitchForm.jsx
import { useState } from "react"

const SalesPitchForm = () => {
  const [industry, setIndustry] = useState("")
  const [client, setClient] = useState("")
  const [pitch, setPitch] = useState("")

  const handleGeneratePitch = () => {
    // Logic to generate a sales pitch based on the industry and client
    setPitch(`This is the pitch for ${client} in the ${industry} industry.`)
  }

  return (
    <div>
      <label>
        Industry:
        <input
          type="text"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />
      </label>
      <br />
      <label>
        Client:
        <input
          type="text"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleGeneratePitch}>Generate Pitch</button>
      <div>{pitch && <p>{pitch}</p>}</div>
    </div>
  )
}

export default SalesPitchForm
