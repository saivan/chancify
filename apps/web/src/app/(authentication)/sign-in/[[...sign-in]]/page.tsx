'use client'


import { Separator } from "@repo/components";
import { SignIn } from "@repo/authentication/client";
import styled from 'styled-components';
import Link from "next/link";
import { cn } from "@repo/utilities"

const StyledSignInPage = styled.div`
  .cl-main {
    width: 60%;
    margin: auto;
  }
`

export default function Page() {
  return <> <StyledSignInPage className="flex flex-col justify-center items-center m-auto">
      <SignIn />
      <Separator className="bg-slate-50" />
      <div className={cn(
        "py-6 bg-slate-800/80 rounded-b-lg w-full flex justify-center",
        "text-slate-50 font-medium text-sm",
      )} >
        Don’t have an account?  
        <Link className="font-bold underline px-1" href="/sign-up">
        Sign up
        </Link>
      </div>
    </ StyledSignInPage>
  </>
}
