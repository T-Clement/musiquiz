function Tab({ title, setActiveTab, isActive }) {
  return (
    <button className={`p-2 ${isActive ? "bg-gray-800" : "bg-purple-900" }	`} onClick={setActiveTab} style={{fontWeight: isActive ? "bold" : "normal"}}>
        {title}
    </button>
  )
}

export default Tab