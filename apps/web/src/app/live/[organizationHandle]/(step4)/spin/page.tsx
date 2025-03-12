
"use client"

import { useEnforceWheelState } from "../../controller"
import { useEnforceDefinedHistory } from "../../controller"


export default function () {
  useEnforceDefinedHistory()
  useEnforceWheelState({
    current: 'ready',
    centered: true,
    animating: true,
    rotating: false,
  })
  return (<> </>)
}



