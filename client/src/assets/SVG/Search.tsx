import React from "react";
import { JSX } from "react/jsx-dev-runtime";

function Saved(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
): JSX.Element {
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
  );
}

export default Saved;
