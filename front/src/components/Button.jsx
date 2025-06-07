export const VARIANT_STYLES = {
  primary: "",
  secondary: "py-2 px-4 font-semibold shadow-md rounded-lg bg-slate-400",
  secondaryDark: "text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700",
  danger: "focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900",
  success: "px-4 py-2 bg-green-600 text-white rounded-lg",
  blue: "py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none",
  info: "disabled:opacity-50 disabled:cursor-not-allowed py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",

  outline: "px-4 py-2 rounded-md border border-gray-300 text-sm font-semibold text-gray-700 bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200",

};

const SIZE_STYLES = {
  small: "",
  medium: "",
  large: "",
};

export default function Button({
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false, 
  onClick = undefined,
  className = "",
  children,
  ...props
}) {


  // get variant of button
  const variantClasses = VARIANT_STYLES[variant];

  // get size of button
  const sizeClasses = SIZE_STYLES[size];

  const buttonClasses = [variantClasses, sizeClasses, className]
    .filter(Boolean) // delete undefined or emtpy strings
    .join(" ");

  return (
    <button className={buttonClasses} onClick={onClick} {...props} type={type} disabled={disabled}>
      {children}
    </button>
  );
}
