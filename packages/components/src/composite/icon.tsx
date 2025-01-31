
const iconMap = {
  'camera': require('lucide-react').Camera,
  'globe': require('lucide-react').Globe,
  'file-question': require('lucide-react').FileQuestion,
  'life-buoy': require('lucide-react').LifeBuoy,
  'github': require('lucide-react').Github,
  'lock': require('lucide-react').Lock,
  'server': require('lucide-react').Server,
  'archive': require('lucide-react').Archive,
  'hammer': require('lucide-react').Hammer,
  'database': require('lucide-react').Database,
  'list-start': require('lucide-react').ListStart,
  'drama': require('lucide-react').Drama,
  'calendar-check': require('lucide-react').CalendarCheck,
  'mail': require('lucide-react').Mail,
  'circle-dollar-sign': require('lucide-react').CircleDollarSign,
  'circle-help': require('lucide-react').CircleHelp,
  'smartphone-nfc': require('lucide-react').SmartphoneNfc,
  'picture-in-picture': require('lucide-react').PictureInPicture,
  'file-pen-line': require('lucide-react').FilePenLine,
  'puzzle': require('lucide-react').Puzzle,
  'panel-left-open': require('lucide-react').PanelLeftOpen,
  'ellipsis': require('lucide-react').Ellipsis,
  'panel-left-close': require('lucide-react').PanelLeftClose,
  'menu': require('lucide-react').Menu,
  'toy-brick': require('lucide-react').ToyBrick,
  'house': require('lucide-react').House,
  'slash': require('lucide-react').Slash,
  'trash': require('lucide-react').Trash,
  'pencil': require('lucide-react').Pencil,
  'check': require('lucide-react').Check,
  'plus': require('lucide-react').Plus,
  'upload': require('lucide-react').Upload,
  'download': require('lucide-react').Download,
  'file': require('lucide-react').File,
  'align-center': require('lucide-react').AlignCenter,
  'align-justify': require('lucide-react').AlignJustify,
  'align-left': require('lucide-react').AlignLeft,
  'align-right': require('lucide-react').AlignRight,
  'palette': require('lucide-react').Palette,
  'loader': require('lucide-react').Loader,
  'circle-chevron-left': require('lucide-react').CircleChevronLeft,
  'circle-chevron-right': require('lucide-react').CircleChevronRight,
  'chevrons-left': require('lucide-react').ChevronsLeft,
  'chevrons-right': require('lucide-react').ChevronsRight,
  'move': require('lucide-react').Move,
  'gamepad-2': require('lucide-react').Gamepad2,
  'settings': require('lucide-react').Settings,
  'eraser': require('lucide-react').Eraser,
  'code-xml': require('lucide-react').CodeXml,
  'close': require('lucide-react').X,
  'maximize': require('lucide-react').Maximize2,
  'minus': require('lucide-react').Minus,
  'chevron-up': require('lucide-react').ChevronUp,
  'megaphone': require('lucide-react').Megaphone,
  'gift': require('lucide-react').Gift,
  'users': require('lucide-react').Users,
  'grip-vertical': require('lucide-react').GripVertical,
  'refresh-cw': require('lucide-react').RefreshCw,
  'network': require('lucide-react').Network, 
} as const
export type IconName = keyof typeof iconMap

export function Icon(props: { 
  icon: IconName
  className?: string
  strokeWidth?: number
  size?: number  
}) {
  // Get the icon to return or throw an error
  const iconMissing = iconMap[props.icon] === undefined
  if ( iconMissing ) throw Error(`Icon not found: ${props.icon}`)
  const IconComponent = iconMap[props.icon]

  // Create the icon and return it
  const fragment = (
    <IconComponent 
      className={props.className} 
      strokeWidth={props.strokeWidth ?? 1.6 } 
      size={props.size ?? 18} 
    />
  )
  return fragment
}
