
"use client"

import { useCustomerViewState, useEnforceDefinedHistory, useEnforceWheelState } from "@/app/live/[organizationHandle]/controller"


export default function () {
  const [state, setState] = useCustomerViewState()
  useEnforceDefinedHistory()
  useEnforceWheelState({
    current: 'ready',
    centered: true,
  })
  return (<> </>)
}



