export default function DashboardCard({ icon, title, children }) {
    return (
      <div className="bg-[#1F2144]/80 p-6 rounded-2xl flex flex-col justify-between items-center text-center h-full">
        <div>
          <div className="mb-4 text-4xl">{icon}</div>
          <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
        </div>
        <div className="w-full flex-1 flex flex-col justify-center">
          {children}
        </div>
      </div>
    )
  }