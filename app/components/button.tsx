import { ComponentPropsWithoutRef, ReactNode } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<"button">{
  children: ReactNode
}

export default function Button({children, className, ...props}:ButtonProps){
  return(
    <button className={`${className} w-full bg-secondary rounded-xl py-3 px-10 duration-300 ease-in-out border border-secondary hover:bg-background hover:text-text-bright hover:border-2 hover:border-border-dark-2`} {...props}>
      {children}
    </button>
  )
}