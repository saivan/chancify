
import { Input } from '../ui/input'
import { cn } from '../utilities'


export function LabelledInput (props: {
  label: string
  inputClassName?: string
} & React.ComponentProps<typeof Input>) {
  return (
    <div className='flex shadow-sm rounded-md'>
      <span className={cn(
        'bg-slate-100 border border-r-0 border-input rounded-l-md',
        'flex items-center px-2 text-sm text-slate-600 font-light text-sm',
      )}>{props.label}</span>
      <Input {...props} className={cn(
        'rounded-l-none shadow-none', props.inputClassName,
      )} />
    </div>
  )
}

