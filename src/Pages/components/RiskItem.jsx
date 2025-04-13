import { AlertTriangle } from "lucide-react"

const RiskItem = ({ risk }) => {
  return (
    <div className="bg-[#0B0B19]/50 rounded-lg p-4">
      <div className="flex items-start mb-2">
        <div
          className={`p-1 rounded-full mr-2 ${
            risk.impact === "high"
              ? "bg-red-900/30 text-red-400"
              : risk.impact === "medium"
                ? "bg-amber-900/30 text-amber-400"
                : "bg-blue-900/30 text-blue-400"
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-medium">{risk.description}</h3>
          <p className="text-sm text-gray-400 mt-1">
            <span className="font-medium">Mitigation:</span> {risk.mitigation}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RiskItem

