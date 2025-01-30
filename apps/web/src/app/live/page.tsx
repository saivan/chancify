import { availableActions } from "@/models/Action";
import { Campaign } from "@/models/Campaign";
import { themes } from "@/models/Theme";
import { shortId } from "@repo/utilities";
import Link from "next/link";

export default function () {

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Link href="/live/campaigns" className="w-full h-full">
        Click me to start
      </Link>
    </div>
  )
}

