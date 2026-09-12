import {SPEED_OPTIONS, VIDEO_FIT_OPTIONS} from '../../constants'
import type {Settings} from '../../types'
import SliderControl from '../ui/SliderControl'
import Toggle from '../ui/Toggle'

interface VideoControlsProps {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
}

export default function VideoControls({settings, onChange}: VideoControlsProps) {
  return (
    <div className="settings-section__body">
      <Toggle label="Autoplay" checked={settings.autoplay} onChange={(v) => onChange({autoplay: v})} />
      <Toggle label="Loop" checked={settings.loop} onChange={(v) => onChange({loop: v})} />
      <Toggle
        label="Muted"
        checked={settings.muted}
        onChange={(v) => onChange({muted: v, volume: v ? 0 : settings.volume || 0.5})}
      />

      <div className="field-group">
        <span className="field-group__label">Playback Speed</span>
        <div className="segmented">
          {SPEEDS_MAPPING(settings.playbackSpeed, (speed) => onChange({playbackSpeed: speed}))}
        </div>
      </div>

      <SliderControl
        id="volume"
        label="Volume"
        min={0}
        max={100}
        value={Math.round(settings.volume * 100)}
        displayValue={`${Math.round(settings.volume * 100)}`}
        disabled={settings.muted}
        onChange={(v) => onChange({volume: v / 100})}
      />

      <div className="field-group">
        <span className="field-group__label">Video Fit</span>
        <div className="radio-group" role="radiogroup" aria-label="Video fit">
          {VIDEO_FIT_OPTIONS.map((fit) => (
            <label key={fit.value} className="radio-option">
              <input
                type="radio"
                name="video-fit"
                checked={settings.videoFit === fit.value}
                onChange={() => onChange({videoFit: fit.value})}
              />
              {fit.label}
            </label>
          ))}
        </div>
      </div>

      <SliderControl
        id="overlay"
        label="Overlay Darkness"
        min={0}
        max={100}
        value={Math.round(settings.overlayOpacity * 100)}
        displayValue={`${Math.round(settings.overlayOpacity * 100)}%`}
        onChange={(v) => onChange({overlayOpacity: v / 100})}
      />

      <Toggle label="Background Blur" checked={settings.blurEnabled} onChange={(v) => onChange({blurEnabled: v})} />
      <SliderControl
        id="blur-amount"
        label="Blur Amount"
        min={0}
        max={20}
        value={settings.blurAmount}
        displayValue={`${settings.blurAmount}px`}
        disabled={!settings.blurEnabled}
        onChange={(v) => onChange({blurAmount: v})}
      />
    </div>
  )
}

function SPEEDS_MAPPING(currentSpeed: number, onSelect: (speed: number) => void) {
  return SPEED_OPTIONS.map((speed) => (
    <button
      key={speed}
      type="button"
      className={`segmented__option ${currentSpeed === speed ? 'segmented__option--active' : ''}`}
      onClick={() => onSelect(speed)}
    >
      {speed}x
    </button>
  ))
}
