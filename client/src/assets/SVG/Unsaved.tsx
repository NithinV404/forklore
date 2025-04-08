import React from "react";
import { JSX } from "react/jsx-dev-runtime";

function Unsaved(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 50 50"
      {...props}
    >
      <polygon
        points="10,10 40,10 40,40 25,30 10,40"
        fill="none"
        stroke="black"
        stroke-width="2"
      />
    </svg>
  );
}

export default Unsaved;
