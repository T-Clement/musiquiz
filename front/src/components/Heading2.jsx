export default function Heading2({children, additionnalClasses = ""}) {
  return (
    <h2 className={`text-3xl sm:text-4xl font-extrabold text-white tracking-wide ${additionnalClasses}`}>{children}</h2>
    
  )
}
