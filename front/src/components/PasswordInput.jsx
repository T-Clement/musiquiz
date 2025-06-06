import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function PasswordInput({
  name = "password",
  placeholder = "Enrez votre mot de passe",
  disabled = false,
  className = "",
  inputClassName = "",
  iconColor = "#1d4ed8",
  onChange,
  value,
  resetOn,
  error,
}) {
  useEffect(() => {
    setShow(false);
  }, [resetOn]);

  const [show, setShow] = useState(false);

  return (
    <div>
      <div className={`relative ${className}`}>
        <input
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          className={`
              w-full pr-10 px-4 py-3 text-gray-800 bg-white
              border border-gray-300 rounded-md outline-blue-500
              transition-colors duration-200
              ${inputClassName}
            `}
          required
        />

        <button
          type="button"
          aria-label={
            show ? "Cacher le mot de passe" : "Afficher le mot de passe"
          }
          onClick={() => setShow((prev) => !prev)}
          className="absolute inset-y-0 right-2 flex items-center justify-center p-4 z-10"
        >
          <span
            className={`
                absolute inset-0 flex items-center justify-center
                transition-opacity duration-200 ease-in-out
                ${show ? "opacity-100" : "opacity-0"}
                `}
            style={{ pointerEvents: "none" }}
          >
            <Eye color={iconColor} />
          </span>
          <span
            className={`
                absolute inset-0 flex items-center justify-center
                transition-opacity duration-200 ease-in-out
                ${show ? "opacity-0" : "opacity-100"}
                `}
            style={{ pointerEvents: "none" }}
          >
            <EyeOff color={iconColor} />
          </span>
        </button>
      </div>

      {error ? (
        <p className="mt-4 text-red-500 font-semibold text-sm">{error}</p>
      ) : (
        ""
      )}
    </div>
  );
}
