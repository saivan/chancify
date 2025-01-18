
export const p5 = window.p5

export class Sketch {
  get element() { return this._element }
  get p5() { return this._p5 }
  get methods() { return this._methods }

  constructor(element) {
    // Get the element
    this._element = typeof element === 'string'
      ? document.querySelector(element)
      : element
    const rect = this._element.getBoundingClientRect()
    this._width = rect.width
    this._height = rect.height

    // Create a cache to store the p5 methods
    this._methods = new Map()
    const proxy = this._proxy = new Proxy(this, {
      get (target, key) {
        if (p5Functions.includes(key)) {
          return (callback, { id=randomId() }={}) => {
            const currentMethods = target._methods.get(key) || new Map()
            currentMethods.set(id, (p, ...args) => {
              const destroyed = target._destroyIfRemovedFromDom(p)
              if (destroyed) return
              callback(p, ...args)
            })
            target._methods.set(key, currentMethods)
            return proxy
          }
        }
        if (key in target) return target[key]
        return undefined
      },

      set (target, key, value) {
        // Don't allow setting p5 lifecycle methods
        if (p5Functions.includes(key)) {
          throw new Error('Cannot set p5 lifecycle methods, use the callback instead')
        }

        // Allow setting other properties
       target[key] = value
       return true
      },
    })
    return this._proxy
  }

  start () {
    this._sketch = p => {
      for (let methodName of p5Functions) {
        // Do nothing if we have no methods for this function
        const methods = this._methods.get(methodName)
        if (methods == null) continue

        // Otherwise, create a wrapper function for the method
        p[methodName] = (...args) => {
          for (let method of methods.values()) {
            method(p, ...args)
          }
        }
      }
    }
    this._p5 = new p5(this._sketch, this._element)
  }

  panZoom () {
    var zoom = 1.0, posX = 0, posY = 0, dragging = false
    this._proxy
      .setup(p => {
        // Initialize the position to center of canvas
        posX = this._width/2
        posY = this._height/2
      }, { id: 'transform' })
      .draw(p => {
        p.translate(this._width/2, this._height/2)
        p.scale(zoom)
        p.translate(-this._width/2 + posX/zoom, -this._height/2 + posY/zoom)
      }, { id: 'transform' })
      .mousePressed((p, event) => {
        const inCanvas = this._element.contains(event.target)
        dragging = inCanvas
      })
      .mouseReleased((p, event) => { dragging = false })
      .mouseDragged((p, event) => {
        if (!dragging) return

        // Calculate the difference in mouse position using pmouseX and pmouseY
        const dx = p.mouseX - p.pmouseX
        const dy = p.mouseY - p.pmouseY
        posX += dx
        posY += dy
      }, { id: 'transform' })
      .mouseWheel((p, event) => {
        // Make sure the mouse is in the canvas
        const inCanvas = this._element.contains(event.target)
        if (!inCanvas) return
        
        // Increased sensitivity for pinch gestures
        event.preventDefault()
        const zoomSensitivity = event.ctrlKey ? 0.01 : 0.001 // 10x more sensitive for pinch
        const delta = -event.delta
        const zoomFactor = 1 + delta * zoomSensitivity
        
        // Transform the mouse position to account for the current pan/zoom
        const mouseXTransformed = (p.mouseX - this._width/2 - posX) / zoom + this._width/2
        const mouseYTransformed = (p.mouseY - this._height/2 - posY) / zoom + this._height/2
        
        // Calculate new zoom
        const newZoom = p.constrain(zoom * zoomFactor, 0.1, 10)
        
        // Adjust the position to maintain the mouse point position
        posX = posX - (mouseXTransformed - this._width/2) * (newZoom - zoom)
        posY = posY - (mouseYTransformed - this._height/2) * (newZoom - zoom)
        zoom = newZoom
      }, { id: 'transform' })
    return this
  }

  _destroyIfRemovedFromDom (p) {
    const isStillAlive = document.body.contains(this._element)
    if (isStillAlive) return false
    console.log('Container removed, cleaning up p5')
    p.remove()
    return true
  }
}



const p5Functions = [
  // Core lifecycle
  'preload', 'setup', 'draw',
  // Mouse events
  'mousePressed', 'mouseReleased', 'mouseClicked', 'mouseMoved',
  'mouseDragged', 'doubleClicked', 'mouseWheel',
  // Keyboard events
  'keyPressed', 'keyReleased', 'keyTyped',
  // Touch events
  'touchStarted', 'touchMoved', 'touchEnded',
  // Window events
  'windowResized', 'focused', 'blurred',
  // Device events
  'deviceMoved', 'deviceTurned', 'deviceShaken'
]


function randomId (length=8) {
  const id = Math.random().toString(36).slice(2, 2 + length)
  return id
}