import React from "react";

const VARIANT_STYLES = {
  primary: "",
  secondary: "py-2 px-4 font-semibold shadow-md rounded-lg bg-slate-400",
  danger: "",
  success: "",
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
