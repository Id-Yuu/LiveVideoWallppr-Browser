interface OverlayProps {
  opacity: number
}

export default function Overlay({opacity}: OverlayProps) {
  return <div className="overlay" style={{background: `rgba(0, 0, 0, ${opacity})`}} aria-hidden="true" />
}
