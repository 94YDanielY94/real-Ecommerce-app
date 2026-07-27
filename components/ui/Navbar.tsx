import Image from "next/image";
import { InputButtonGroup } from "./search";
import { Button } from "./button";
import Link from "next/link";
const Navbar = () => {
  return (
    <div className="content px-18 py-6 flex justify-between items-center">
      <div className="logo-Content flex text-xl font-bold items-baseline gap-2">
        <Image src="/logo.svg" alt="logo" width={"20"} height={"20"} />
        <p className="text-3xl">real.</p>
      </div>
      <InputButtonGroup />
      <div className="action flex gap-6 items-center ">
        <Link href={"/products"} className="p-4 rounded-full hover:bg-neutral-100 transition-all">
          <svg
            width="22px"
            height="22px"
            viewBox="0 0 0.72 0.72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.15 0.21h0.414a0.06 0.06 0 0 1 0.06 0.066l-0.018 0.18A0.06 0.06 0 0 1 0.546 0.51H0.259a0.06 0.06 0 0 1 -0.059 -0.048z"
              stroke="#000000"
              stroke-width="0.06"
              stroke-linejoin="round"
            />
            <path
              d="m0.15 0.21 -0.024 -0.097A0.03 0.03 0 0 0 0.097 0.09H0.06"
              stroke="#000000"
              stroke-width="0.06"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M0.24 0.63h0.06"
              stroke="#000000"
              stroke-width="0.06"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M0.48 0.63h0.06"
              stroke="#000000"
              stroke-width="0.06"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Link>
        <Link href={"/cart"} className="px-4 py-1.5 rounded-full hover:bg-neutral-100 transition-all">
          Login
        </Link>
        <Button>
          <Link href={'/signup'}>
          Signup
          
          </Link> 
          </Button>
      </div>
    </div>
  );
};

export default Navbar;
