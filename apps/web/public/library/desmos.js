

export class Graph {

  get element() { return this._element }
  get desmos() { return this._calculator }

  constructor(element, options = { }) {
    // Get the element
    this._element = typeof element === 'string'
      ? document.querySelector(element)
      : element

    // Create a calculator element
    this._options = {
      expressions: false,
      zoomButtons: false,
      settingsMenu: false,
      saveState: true,
      saveExpressions: false,
      saveViewport: true,
      ...options,
    }

    // Initialise the calculator
    this._id = `desmos-${this._element?.id}`
    this._ready = this._initialise()
  }

  state(newState) {
    // Act as a getter
    if (newState == null) return (async () => {
      await this._ready
      const state = this._calculator.getState()
      return state
    })();

    // Act as a setter
    (async () => {
      await this._ready
      this._calculator.setState(newState, { allowUndo: false })
    })();
    return this
  }

  expression(latex, options = {}) {
    const expression = {
      ...options,
      id: options.id || `ex-${Math.random().toString().slice(2)}`,
      latex,
      color: options.color || `#334155`,
      lineWidth: options.width || 3,
      lineOpacity: options.opacity || 1,
    }
    this._ready.then(() => {
      this._calculator.setExpression(expression)
    })
    return this
  }

  async save () {
    await this._ready
    const newState = await this._calculator.getState()
    state[this._id] = newState
    return this
  }

  async _initialise() {
    // Add an iframe to the document
    const iframe = document.createElement('iframe')
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.border = 'none'
    this._element.appendChild(iframe)

    // Load the calculator into the iframe
    const doc = iframe.contentDocument
    doc.open()
    doc.write(`
      <html>
        <body>
        <div class="calculator"></div>
        <style>
          body { margin: 0 }
          .calculator { width: 100% height: 100% }
        </style>
        <script src='https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6'></script>
        <script>
          const calculatorNode = document.querySelector('.calculator')
          window.calculator = Desmos.GraphingCalculator(calculatorNode, ${JSON.stringify(this._options)})
        </script>
        </body>
      </html>
    `)
    doc.close()

    // Wait for the calculator to load
    await new Promise(ready => {
      iframe.onload = () => {
        this._calculator = iframe.contentWindow.calculator
        ready(this._calculator)
      }
    })

    // Handle the state
    if (this._options.saveState) {
      await new Promise(ready => {
        state.listen(async current => {
          // Check if we have the state for this graph
          const stateSignal = current[this._id]
          if (typeof stateSignal === 'undefined') return ready(true)
          
          // Check if the state is different
          const newState = stateSignal.value
          const oldState = this._calculator.getState()
          const isStateUnchanged = JSON.stringify(newState) === JSON.stringify(oldState)
          if (isStateUnchanged) return ready(true)

          // If so, update the state directly
          if (this._options.saveExpressions === false) newState.expressions.list = []
          if (this._options.saveViewport === false) newState.graph.viewport = {}
          this._calculator.setState(newState, { allowUndo: false })
          return ready(true)
        })
      })
    }
    return iframe
  }
}
