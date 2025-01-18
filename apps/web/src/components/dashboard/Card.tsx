
import { Badge } from "@repo/components"
import { type ReactNode, Suspense } from "react"


export function Card(props: {
  title: string
  information: string
  children: ReactNode
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-96 max-w-full border-2 border-slate-200 rounded-lg p-6 flex flex-col gap-4">
        <div>
          <div className="text-xl font-medium">{props.title}</div>
          <div>{props.information}</div>
        </div>
          {props.children}
        </div>
    </Suspense>
  )
}

export function CardTest(props: {
  title: string
  information: string
  tests: { name: string, result?: string | null }[]
}) {
  return (
    <Card title={props.title} information={props.information}>
      <div className="flex flex-col gap-2">
        {props.tests.map((test, i) => (
          <div key={i} className="flex gap-2">
            <Badge variant="outline">
              {test.name}
            </Badge>
            <div className="text-slate-800 text-ellipsis overflow-hidden">
              {test.result}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
