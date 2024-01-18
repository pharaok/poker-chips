import { SVGProps } from "react";

export default function Diamond(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="red" {...props} viewBox="0 0 32 32">
      <path
        d="M 31.999905,16
C 21.85637,10.143625 21.85637,10.143625 16.000001,9.7223795e-5 10.143627,10.143625 10.14362,10.143625 9.4677567e-5,15.999988 10.143634,21.856375 10.143628,21.856375 16.000001,31.999903 21.841125,21.882786 21.829957,21.871629 31.999905,16
Z"
      ></path>
    </svg>
  );
}
