function Tab({ title, setActiveTab, isActive }) {
  return (
    <button className="p-2 border rounded-sm" onClick={setActiveTab} style={{fontWeight: isActive ? "bold" : "normal"}}>
        {title}
    </button>
  )
}

export default Tab