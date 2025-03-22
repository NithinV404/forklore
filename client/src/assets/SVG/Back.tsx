import React from "react";
import { JSX } from "react/jsx-dev-runtime";

function Back(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
): JSX.Element {
  return (
    <svg
      fill="#000000"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      viewBox="0 0 30.725 30.725"
      {...props}
    >
      <g>
        <path
          d="M24.078,26.457c0.977,0.978,0.977,2.559,0,3.536c-0.488,0.488-1.128,0.731-1.77,0.731c-0.639,0-1.278-0.243-1.768-0.731
		L5.914,15.362l14.629-14.63c0.977-0.977,2.559-0.976,3.535,0c0.977,0.977,0.977,2.56,0,3.536L12.984,15.362L24.078,26.457z"
        />
      </g>
    </svg>
  );
}

export default Back;
