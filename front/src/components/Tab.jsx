function Tab({ title, setActiveTab, isActive }) {
  return (
    <button onClick={setActiveTab} style={{fontWeight: isActive ? "bold" : "normal"}}>
        {title}
    </button>
  )
}

export default Tab