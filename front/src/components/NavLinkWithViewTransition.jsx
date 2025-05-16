import { NavLink } from "react-router-dom";

export default function NavLinkWithViewTransition({children, ...props}) {
  return (
    <NavLink unstable_viewTransition {...props}>{children}</NavLink>
  )
}
