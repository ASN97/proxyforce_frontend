const StatCard = ({ icon, title, value, subtitle }) => {
    return (
      <div className="bg-[#151528]/80 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
        <div className="flex items-center mb-2">
          {icon}
          <span className="text-gray-400 text-sm">{title}</span>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    )
  }
  
  export default StatCard
  