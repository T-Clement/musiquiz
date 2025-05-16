import { Link } from "react-router-dom";

export default function LinkWithViewTransition({children, ...props}) {
  return (
    <Link unstable_viewTransition {...props}>{children}</Link>
  )
}
