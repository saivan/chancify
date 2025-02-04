
"use client"

import { useCustomerViewState, useEnforceWheelState } from "@/app/live/[organizationId]/controller"


export default function () {
  const [state, setState] = useCustomerViewState()
  useEnforceWheelState({
    current: 'ready',
    centered: true,
  })
  return (<> </>)
}



