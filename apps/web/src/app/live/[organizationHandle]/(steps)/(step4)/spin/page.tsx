
"use client"

import { useEnforceDefinedHistory, useEnforceWheelState } from "@/app/live/[organizationHandle]/controller"


export default function () {
  useEnforceDefinedHistory()
  useEnforceWheelState({
    current: 'ready',
    centered: true,
  })
  return (<> </>)
}



