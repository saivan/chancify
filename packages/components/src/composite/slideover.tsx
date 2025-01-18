import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Icon } from "./icon";


function SidebarButton() {
  return (
    <div className="p-1.5 border rounded border-slate-200">
      <Icon icon="menu" />
    </div>
  )
} 


export function SlideOver(props: { 
  side?: "left" | "right",
  button?: React.ReactNode
  title: string
  description: string
  children: React.ReactNode 
  className?: string
}) {
  return (
    <Sheet >
      <SheetTrigger className={props.className} >
        { props.button ?? <SidebarButton /> }
      </SheetTrigger>
      <SheetContent 
        className="p-0"
        side={props.side ?? "left"} >
        <VisuallyHidden>
          <SheetHeader>
            <SheetTitle>{props.title}</SheetTitle>
            <SheetDescription>{props.description}</SheetDescription>
          </SheetHeader>
        </VisuallyHidden>
        { props.children }
      </SheetContent>
    </Sheet>
  )
}