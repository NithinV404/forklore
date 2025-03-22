import React from "react";
import { JSX } from "react/jsx-dev-runtime";

function Share(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
): JSX.Element {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 24V40C8 41.0609 8.42143 42.0783 9.17157 42.8284C9.92172 43.5786 10.9391 44 12 44H36C37.0609 44 38.0783 43.5786 38.8284 42.8284C39.5786 42.0783 40 41.0609 40 40V24M32 12L24 4M24 4L16 12M24 4V30"
        stroke="#1E1E1E"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default Share;
