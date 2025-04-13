"use client"

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "chat", label: "Chat" },
  ]

  return (
    <>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-6 py-4 font-medium transition-colors ${
            activeTab === tab.id ? "border-b-2 border-amber-500 text-amber-500" : "text-gray-400 hover:text-amber-400"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </>
  )
}

export default TabNavigation
