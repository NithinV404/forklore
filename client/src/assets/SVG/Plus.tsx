import React from "react";
import { JSX } from "react/jsx-dev-runtime";

function Plus(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
): JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M11 13H5V11H11V5H13V11H19V13H13V19H11V13Z" fill="#1D1B20" />
    </svg>
  );
}

export default Plus;
