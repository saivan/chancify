"use client"

import { Button } from '../ui/button'
import { Icon } from './icon'
import { cn } from '../utilities'
import { useCallback, useRef, useState } from "react"
import styled from "styled-components"

type ResizeDirection = 'top-left' | 'top' | 'top-right' | 'right' |
  'bottom-right' | 'bottom' | 'bottom-left' | 'left'

interface ResizeHandleConfig {
  position: Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>
  cursor: string
  width: number | string
  height: number | string
}

const handleWidth = 20 
const pad = handleWidth/2
const fit = `calc(100% - ${2 * pad}px)`
const RESIZE_HANDLES: Record<ResizeDirection, ResizeHandleConfig> = {
  'top-left': { position: { top: -pad, left: -pad}, cursor: 'nw-resize', width: handleWidth, height: handleWidth },
  'top': { position: { top: -pad, left: pad }, cursor: 'n-resize', width: fit, height: handleWidth },
  'top-right': { position: { top: -pad, right: -pad }, cursor: 'ne-resize', width: handleWidth, height: handleWidth },
  'right': { position: { right: -pad, top: pad }, cursor: 'e-resize', width: handleWidth, height: fit },
  'bottom-right': { position: { bottom: -pad, right: -pad }, cursor: 'se-resize', width: handleWidth, height: handleWidth },
  'bottom': { position: { bottom: -pad, left: pad }, cursor: 's-resize', width: fit, height: handleWidth },
  'bottom-left': { position: { bottom: -pad, left: -pad }, cursor: 'sw-resize', width: handleWidth, height: handleWidth },
  'left': { position: { left: -pad, top: pad }, cursor: 'w-resize', width: handleWidth, height: fit }
}

const StyledPopup = styled.div`
  position: fixed;
  z-index: 50;
  overflow: visible;
  pointer-events: auto;

  .handle {
    cursor: move;
  }
  
  .resize-handle {
    position: absolute;
    background: transparent;
    z-index: 1;
  }

  ${Object.entries(RESIZE_HANDLES).map(([direction, config]) => `
    .resize-handle.${direction} {
      ${Object.entries(config.position).map(([key, value]) => `${key}: ${value}px;`).join('\n')}
      width: ${typeof config.width === 'number' ? `${config.width}px` : config.width};
      height: ${typeof config.height === 'number' ? `${config.height}px` : config.height};
      cursor: ${config.cursor};
    }
  `).join('\n')}
`

interface PopupProps {
  children: React.ReactNode
  title: string
  onClose?: () => void
  minWidth?: number
  minHeight?: number
}

export function Popup({
  children,
  title,
  onClose,
  minWidth = 300,
  minHeight = 200,
}: PopupProps) {
  // Initialise all state variables
  const [frame, setFrame] = useState({
    width: 800, height: 600, x: 0, y: 0,
  })
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)

  // Refs for tracking drag and resize operations
  const dragStartRef = useRef<{ x: number, y: number } | null>(null)
  const resizeStartRef = useRef<{
    x: number
    y: number
    width: number
    height: number
    left: number
    top: number
  } | null>(null)
  const currentResizeRef = useRef<ResizeDirection | null>(null)

  // Handle dragging the popup window
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only allow dragging if the handle is clicked
    if (!(e.target as HTMLElement).classList.contains('handle')) return
    e.preventDefault()

    // Store the initial mouse position and allow dragging
    dragStartRef.current = { x: e.clientX - frame.x, y: e.clientY - frame.y }
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return
      const newX = e.clientX - dragStartRef.current.x
      const newY = e.clientY - dragStartRef.current.y
      setFrame(prev => ({ ...prev, x: newX, y: newY }))
    }

    // Clean up event listeners when dragging is done
    const handleMouseUp = () => {
      dragStartRef.current = null
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    // Attach event listeners for mouse move and mouse up
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [frame.x, frame.y])

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: ResizeDirection) => {
    // Prevent default behavior and stop propagation if we are resizing
    e.preventDefault()
    e.stopPropagation()

    // Store the initial state of the popup
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: frame.width,
      height: frame.height,
      left: frame.x,
      top: frame.y,
    }
    currentResizeRef.current = direction

    // Helper function to calculate new dimensions and position
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate the change in mouse position
      if (!resizeStartRef.current || !currentResizeRef.current) return
      const deltaX = e.clientX - resizeStartRef.current.x
      const deltaY = e.clientY - resizeStartRef.current.y

      // Helper function to calculate new dimensions and position
      const calculateNewDimensions = (
        deltaWidth: number,
        deltaHeight: number,
        deltaX: number,
        deltaY: number
      ) => ({
        width: Math.max(minWidth, (resizeStartRef.current?.width || 0) + deltaWidth),
        height: Math.max(minHeight, (resizeStartRef.current?.height || 0) + deltaHeight),
        x: resizeStartRef.current!.left + deltaX,
        y: resizeStartRef.current!.top + deltaY,
      })

      // Update the frame based on the current resize direction
      setFrame((prev) => {
        // Determine deltas based on the resize direction
        const direction = currentResizeRef.current
        const deltas = direction === 'top-left' ? [-deltaX, -deltaY, deltaX, deltaY]
          : direction === 'top' ? [0, -deltaY, 0, deltaY]
          : direction === 'top-right' ? [deltaX, -deltaY, 0, deltaY]
          : direction === 'right' ? [deltaX, 0, 0, 0]
          : direction === 'bottom-right' ? [deltaX, deltaY, 0, 0]
          : direction === 'bottom' ? [0, deltaY, 0, 0]
          : direction === 'bottom-left' ? [-deltaX, deltaY, deltaX, 0]
          : direction === 'left' ? [-deltaX, 0, deltaX, 0]
          : [0, 0, 0, 0]

        // Calculate new dimensions using the determined deltas
        type fourTuple = [number, number, number, number]
        const dimensions = calculateNewDimensions(...deltas as fourTuple)
        return dimensions
      })
    }


    const handleMouseUp = () => {
      // Clean up event listeners and reset state
      resizeStartRef.current = null
      currentResizeRef.current = null
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    // Attach event listeners for mouse move and mouse up
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [frame, minWidth, minHeight])

  // Setup the popup element
  const maximizePadding = 32
  return (
    <StyledPopup
      style={{
        right: minimized ? '1rem' : maximized ? `${maximizePadding / 2}px` : '',
        bottom: minimized ? '1rem' : maximized ? `${maximizePadding / 2}px` : '',
        pointerEvents: 'none',
        position: 'fixed',
      }}
    >
      <div
        style={
          minimized ? {
            width: 'auto',
            height: 'auto',
            transform: 'none'
          } : maximized ? {
            width: `calc(100vw - ${maximizePadding}px)`,
            height: `calc(100vh - ${maximizePadding}px)`,
            transform: 'none',
          } : {
            width: `${frame.width}px`,
            height: `${frame.height}px`,
            transform: `translate3d(${frame.x}px, ${frame.y}px, 0)`
          }}
        className={cn(
          "pointer-events-auto",
          "flex flex-col relative touch-none",
          "rounded-md outline outline-slate-300 p-2",
          "backdrop-blur-xs",
          "bg-linear-to-br from-slate-50 via-slate-50/40 to-slate-50",
        )}
        onMouseDown={handleMouseDown}
      >
        {/* Window controls (close, minimize, maximize) */}
        <div className="flex gap-1 items-center handle">
          <Button variant="outline" size="icon" className="w-7 h-7"
            onClick={onClose}
          > <Icon icon="close" size={12} /> </Button>
          <Button variant="outline" size="icon" className="w-7 h-7"
            onClick={() => setMinimized(!minimized)}
          > <Icon icon={minimized ? "chevron-up" : "minus"} size={12} /> </Button>
          {!minimized && (
            <Button
              variant="outline" size="icon" className="w-7 h-7"
              onClick={() => setMaximized(!maximized)}
            > <Icon icon="maximize" size={12} /> </Button>)}
          {minimized && (
            <div className="px-4 text-sm text-slate-600"> {title} </div>
          )}
        </div>

        {/* Popup content */}
        {!minimized && (
          <div className={cn(
            "h-0 flex-1",
            "rounded overflow-clip",
            "pt-2",
          )}> {children} </div>
        )}

        {/* Resize handles */}
        {!minimized && !maximized && (
          <>
            {Object.entries(RESIZE_HANDLES).map(([direction]) => (
              <div
                key={direction}
                className={`resize-handle ${direction}`}
                onMouseDown={(e) => handleResizeStart(e, direction as ResizeDirection)}
              />
            ))}
          </>
        )}
      </div>
    </StyledPopup>
  )
}
