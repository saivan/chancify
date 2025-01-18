import { Prize, Theme } from './types'

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  }
}

function getTextX(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) {
  const midAngle = (startAngle + endAngle) / 2
  return polarToCartesian(centerX, centerY, radius, midAngle).x
}

function getTextY(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) {
  const midAngle = (startAngle + endAngle) / 2
  return polarToCartesian(centerX, centerY, radius, midAngle).y
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

  return [
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "L", x, y
  ].join(" ")
}

function calculateWedges(prizes: Prize[]) {
  let currentAngle = 0
  const total = prizes.reduce((sum, prize) => sum + prize.probability, 0)
  return prizes.map(prize => {
    const angle = (prize.probability / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle += angle
    return {
      prize,
      startAngle,
      endAngle
    }
  })
}

function colorToMatrix(hexColor: string): string {
  if (!hexColor) return "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" // Default black if no color provided
  const color = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor
  try {
    const r = parseInt(color.substring(0, 2), 16) / 255
    const g = parseInt(color.substring(2, 4), 16) / 255
    const b = parseInt(color.substring(4, 6), 16) / 255
    return `0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 1 0`
  } catch (e) {
    console.error('Invalid color format:', hexColor)
    return "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" // Default to black on error
  }
}

function Wedge({
  prize,
  theme,
  startAngle,
  endAngle,
  centerX,
  centerY,
  radius,
}: {
  prize: Prize
  theme: Theme['wedges'][0]
  startAngle: number
  endAngle: number
  centerX: number
  centerY: number
  radius: number
}) {
  const uniqueFilterId = `filter_${prize.name.replace(/[^a-zA-Z0-9]/g, '_')}`
  
  // Calculate the middle angle
  const middleAngle = (startAngle + endAngle) / 2
  
  // Determine if we need to flip the text
  // This ensures text is always readable from outside the wheel
  const rotationAngle = middleAngle + 90
  const adjustedRotation = ((rotationAngle + 180) % 360) - 180
  const shouldFlip = true// adjustedRotation > 90 || adjustedRotation < -90
  const finalRotation = shouldFlip ? rotationAngle + 180 : rotationAngle

  return (
    <>
      <defs>
        <filter id={uniqueFilterId} x="-50%" y="-50%" width="200%" height="200%">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0" />
          <feGaussianBlur stdDeviation={theme.radius || 32.25} />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values={colorToMatrix(theme.glowColor)}
          />
          <feBlend mode="multiply" in2="shape" result="effect1_innerShadow" />
        </filter>
      </defs>
      <path
        d={describeArc(centerX, centerY, radius, startAngle, endAngle)}
        fill={theme.backgroundColor}
        filter={`url(#${uniqueFilterId})`}
      />
      <text
        x={getTextX(centerX, centerY, radius * 0.85, startAngle, endAngle)}
        y={getTextY(centerX, centerY, radius * 0.85, startAngle, endAngle)}
        fill={theme.textColor}
        textAnchor={shouldFlip ? "end" : "start"}
        dominantBaseline="middle"
        transform={`rotate(${finalRotation}, 
          ${getTextX(centerX, centerY, radius * 0.85, startAngle, endAngle)}, 
          ${getTextY(centerX, centerY, radius * 0.85, startAngle, endAngle)})`}
        style={{ fontSize: '16px', fontFamily: 'Inter', fontWeight: 600 }}
      > {prize.name} </text>
    </>
  )
}


export function Wedges(props: {
  prizes: Prize[]
  theme: Theme
}) {
  const wedgeThemes = props.theme.wedges
  const size = 660
  const p = props.theme.padding ?? 0
  const centerX = size / 2
  const centerY = size / 2
  const radius = (size / 2) * (1 - 2 * p)

  const wedges = calculateWedges(props.prizes)
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full h-full"
    >
      {wedges.map((wedge, index) => (
        <Wedge
          key={index}
          prize={wedge.prize}
          theme={wedgeThemes[index % wedgeThemes.length]}
          startAngle={wedge.startAngle}
          endAngle={wedge.endAngle}
          centerX={centerX}
          centerY={centerY}
          radius={radius}
        />
      ))}
    </svg>)
}