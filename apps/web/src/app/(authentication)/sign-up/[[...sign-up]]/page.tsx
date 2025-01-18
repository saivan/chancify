"use client"

import { SignUp } from "@repo/authentication/client";
import { Separator } from "@repo/components";
import styled from 'styled-components';
import Link from "next/link";
import { cn } from "@repo/utilities";

const StyledSignUpPage = styled.div`
  .cl-main {
    width: 60%;
    margin: auto;
  }
`

export default function Page() {
  return <> <StyledSignUpPage className="flex flex-col justify-center items-center m-auto">
      <SignUp />
      <Separator className="bg-slate-50" />
      <div className={cn(
        "py-6 bg-slate-800/80 rounded-b-lg w-full flex justify-center",
        "text-slate-50 font-medium text-sm",
      )} >
        Already have an account?
        <Link className="font-bold underline px-1" href="/sign-in">
        Sign in
        </Link>
      </div>
    </ StyledSignUpPage>
  </>
}

