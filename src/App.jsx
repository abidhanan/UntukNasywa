import { useEffect, useRef, useState } from 'react'
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Gamepad2,
  Heart,
  MessageCircle,
  Music,
  Palette,
  Pause,
  Play,
  RotateCcw,
  Send,
  Shirt,
  Utensils,
} from 'lucide-react'
import kknTimelineImg from './assets/kkn-timeline.jpeg'
import mascotImg from './assets/mascot.png'
import './App.css'

const steps = ['Jawab', 'KKN', 'Tanggal', 'Favorit', 'Rencana', 'Deal']
const musicSrc = '/audio/nasywa-theme.mp3'

const stickerImages = [
  new URL('./assets/stickers/sticker-01.png', import.meta.url).href,
  new URL('./assets/stickers/sticker-02.png', import.meta.url).href,
  new URL('./assets/stickers/sticker-03.png', import.meta.url).href,
  new URL('./assets/stickers/sticker-04.png', import.meta.url).href,
  new URL('./assets/stickers/sticker-05.png', import.meta.url).href,
  new URL('./assets/stickers/sticker-06.png', import.meta.url).href,
  new URL('./assets/stickers/sticker-07.png', import.meta.url).href,
  new URL('./assets/stickers/sticker-08.png', import.meta.url).href,
  new URL('./assets/stickers/sticker-11.png', import.meta.url).href,
  new URL('./assets/stickers/sticker-14.png', import.meta.url).href,
]

const noButtonSlots = [
  { left: 66, top: 114, rotate: 7 },
  { left: 34, top: 132, rotate: -8 },
  { left: 72, top: 166, rotate: 5 },
  { left: 42, top: 178, rotate: -6 },
  { left: 58, top: 146, rotate: 3 },
  { left: 29, top: 164, rotate: -4 },
]

const selectOptions = {
  activity: ['Nonton film', 'Main PS', 'Ngobrol di cafe', 'Terserah'],
}

const colorOptions = [
  { name: 'Pink soft', value: '#ff8bb5' },
  { name: 'Putih', value: '#ffffff' },
  { name: 'Cream', value: '#ffe8c8' },
  { name: 'Lilac', value: '#b894f6' },
  { name: 'Biru langit', value: '#7cc7f5' },
  { name: 'Mint', value: '#74d6b1' },
  { name: 'Lemon', value: '#ffd766' },
  { name: 'Coklat susu', value: '#c58a65' },
  { name: 'Hitam', value: '#2f2530' },
  { name: 'Denim', value: '#6d8fc8' },
]

function getTodayValue() {
  const today = new Date()
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
  return today.toISOString().slice(0, 10)
}

function formatDate(value) {
  if (!value) return 'Tanggalnya nanti dipilih'

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

const initialForm = {
  date: getTodayValue(),
  time: '16:00',
  food: '',
  drink: '',
  color: '',
  comfort: '',
  song: '',
  topColor: 'Pink soft',
  bottomColor: 'Putih',
  activity: 'Nonton film',
  notes: 'Aku yang susun rutenya, kamu tinggal bilang iya.',
}

function App() {
  const audioRef = useRef(null)
  const firstWebsiteGestureHandledRef = useRef(false)
  const gesturePlayAtRef = useRef(0)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialForm)

  const playMusic = (fromGesture = false) => {
    const audio = audioRef.current
    if (!audio) return

    if (fromGesture) gesturePlayAtRef.current = Date.now()
    audio.volume = 0.72

    audio
      .play()
      .then(() => setIsMusicPlaying(true))
      .catch(() => setIsMusicPlaying(false))
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    audio.volume = 0.72
    playMusic()

    const playFromDocumentGesture = () => {
      firstWebsiteGestureHandledRef.current = true
      playMusic(true)
    }
    document.addEventListener('pointerdown', playFromDocumentGesture, { capture: true, once: true })
    document.addEventListener('touchstart', playFromDocumentGesture, { capture: true, once: true })
    document.addEventListener('mousedown', playFromDocumentGesture, { capture: true, once: true })
    document.addEventListener('click', playFromDocumentGesture, { capture: true, once: true })
    document.addEventListener('keydown', playFromDocumentGesture, { capture: true, once: true })

    return () => {
      document.removeEventListener('pointerdown', playFromDocumentGesture, true)
      document.removeEventListener('touchstart', playFromDocumentGesture, true)
      document.removeEventListener('mousedown', playFromDocumentGesture, true)
      document.removeEventListener('click', playFromDocumentGesture, true)
      document.removeEventListener('keydown', playFromDocumentGesture, true)
    }
  }, [])

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const nextStep = () => setStep((current) => Math.min(current + 1, steps.length - 1))
  const previousStep = () => setStep((current) => Math.max(current - 1, 0))
  const playOnAnyFirstWebsiteAction = () => {
    if (firstWebsiteGestureHandledRef.current) return
    firstWebsiteGestureHandledRef.current = true
    playMusic(true)
  }

  return (
    <main
      className="app-shell"
      onClickCapture={playOnAnyFirstWebsiteAction}
      onKeyDownCapture={playOnAnyFirstWebsiteAction}
      onMouseDownCapture={playOnAnyFirstWebsiteAction}
      onPointerDownCapture={playOnAnyFirstWebsiteAction}
      onTouchStartCapture={playOnAnyFirstWebsiteAction}
    >
      <div className="browser-frame">
        <div className="browser-bar" aria-hidden="true">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
          <div className="address">www.nasywa-imut.com</div>
        </div>

        <div className="paper-stage">
          <Decorations />
          <MusicPlayer
            audioRef={audioRef}
            gesturePlayAtRef={gesturePlayAtRef}
            isPlaying={isMusicPlaying}
            playMusic={playMusic}
            setIsPlaying={setIsMusicPlaying}
          />
          <Progress step={step} />

          {step === 0 && <WelcomeScreen onAccept={nextStep} />}
          {step === 1 && <KknNoticeScreen onBack={previousStep} onNext={nextStep} />}
          {step === 2 && (
            <ScheduleScreen
              form={form}
              onBack={previousStep}
              onNext={nextStep}
              onUpdate={updateForm}
            />
          )}
          {step === 3 && (
            <FavoriteThingsScreen
              form={form}
              onBack={previousStep}
              onNext={nextStep}
              onUpdate={updateForm}
            />
          )}
          {step === 4 && (
            <PlanDetailsScreen
              form={form}
              onBack={previousStep}
              onNext={nextStep}
              onUpdate={updateForm}
            />
          )}
          {step === 5 && (
            <ConfirmationScreen
              form={form}
              onSend={() => sendWhatsAppPlan(form)}
              onEdit={() => setStep(2)}
            />
          )}
        </div>
      </div>
    </main>
  )
}

function Decorations() {
  return (
    <div className="decorations" aria-hidden="true">
      {stickerImages.map((src, index) => (
        <img
          alt=""
          className={`sticker-deco sticker-${index + 1}`}
          key={src}
          src={src}
        />
      ))}
      <span className="heart-shape heart-one"></span>
      <span className="heart-shape heart-two"></span>
      <span className="heart-shape heart-three"></span>
      <span className="sparkle sparkle-one"></span>
      <span className="sparkle sparkle-two"></span>
      <span className="sparkle sparkle-three"></span>
      <span className="confetti c1"></span>
      <span className="confetti c2"></span>
      <span className="confetti c3"></span>
    </div>
  )
}

function Progress({ step }) {
  return (
    <nav className="progress" aria-label="Progress undangan">
      {steps.map((label, index) => (
        <div className="progress-item" key={label}>
          <div className={`progress-dot ${index <= step ? 'active' : ''}`}>{index + 1}</div>
          <span>{label}</span>
          {index < steps.length - 1 && <Heart className="progress-heart" size={18} />}
        </div>
      ))}
    </nav>
  )
}

function WelcomeScreen({ onAccept }) {
  const [noButton, setNoButton] = useState({ left: 50, top: 106, rotate: 0 })
  const [attempts, setAttempts] = useState(0)

  const dodgeNoButton = () => {
    setAttempts((current) => {
      setNoButton(noButtonSlots[current % noButtonSlots.length])
      return current + 1
    })
  }

  const tease =
    attempts === 0
      ? 'Tolong pilih salah satu yaa'
      : attempts < 4
        ? 'Eits, tombolnya malu-malu'
        : 'Tombolnya gak mau dipencet tuh 🤭'

  return (
    <section className="screen welcome-screen" aria-labelledby="welcome-title">
      <div className="welcome-copy">
        <h1 id="welcome-title">Nasywa Hasna Nabila</h1>
        <p className="question">Mumpung kamu udah selesai UAS, main yukk</p>
      </div>

      <div className="mascot-panel">
        <img src={mascotImg} alt="Ilustrasi teddy bear dan bunny memegang hati" />
      </div>

      <div className="choice-zone">
        <button className="primary-button yes-button" type="button" onClick={onAccept}>
          <Heart size={20} fill="currentColor" />
          Ayoo
        </button>
        <button
          className="runaway-button"
          type="button"
          style={{
            '--run-left': `${noButton.left}%`,
            '--run-top': `${noButton.top}px`,
            '--run-rotate': `${noButton.rotate}deg`,
          }}
          onClick={(event) => {
            event.preventDefault()
            if (event.detail === 0) dodgeNoButton()
          }}
          onFocus={dodgeNoButton}
          onMouseEnter={dodgeNoButton}
          onPointerDown={(event) => {
            event.preventDefault()
            dodgeNoButton()
          }}
        >
          Emohh
        </button>
      </div>

      <p className="tease" aria-live="polite">
        {tease}
      </p>
    </section>
  )
}

function KknNoticeScreen({ onBack, onNext }) {
  return (
    <section className="screen form-screen kkn-screen wide-form" aria-labelledby="kkn-title">
      <ScreenHeader
        id="kkn-title"
        icon={<Calendar size={24} />}
        title="Sebentar lagi aku KKN"
        text="Sebelum jadwalku mulai padat, kita curi waktu main dulu ya."
      />

      <figure className="kkn-photo-card">
        <img
          src={kknTimelineImg}
          alt="Timeline pelaksanaan KKN Universitas Sugeng Hartono"
          loading="eager"
          decoding="sync"
        />
      </figure>

      <div className="kkn-message">
        <Heart size={20} fill="currentColor" />
        <p>
          Aku sebentar lagi KKN. Sebelum KKN, kita usahakan main dulu mumpung kamu
          lagi libur semesteran.
        </p>
      </div>

      <StepActions onBack={onBack} onNext={onNext} nextText="Pilih tanggal" />
    </section>
  )
}

function ScheduleScreen({ form, onBack, onNext, onUpdate }) {
  return (
    <section className="screen form-screen" aria-labelledby="schedule-title">
      <ScreenHeader
        id="schedule-title"
        icon={<Calendar size={24} />}
        title="Pilih tanggal & jam"
        text="Biar rencana manisnya punya tempat di kalender."
      />

      <div className="field-grid two-columns">
        <label className="field-card picker-field">
          <span>
            <Calendar size={18} />
            Tanggal yang bisa
          </span>
          <div className="input-with-icon">
            <input
              type="date"
              value={form.date}
              min={getTodayValue()}
              onChange={(event) => onUpdate('date', event.target.value)}
            />
            <Calendar className="picker-glyph" size={18} aria-hidden="true" />
          </div>
        </label>

        <label className="field-card picker-field">
          <span>
            <Clock size={18} />
            Jam berapa
          </span>
          <div className="input-with-icon">
            <input
              type="time"
              value={form.time}
              onChange={(event) => onUpdate('time', event.target.value)}
            />
            <Clock className="picker-glyph" size={18} aria-hidden="true" />
          </div>
        </label>
      </div>

      <div className="date-preview">
        <Heart size={18} fill="currentColor" />
        <span>
          Oke, dicatat: <strong>{formatDate(form.date)}</strong> jam{' '}
          <strong>{form.time || 'nanti dipilih'}</strong>.
        </span>
      </div>

      <StepActions onBack={onBack} onNext={onNext} nextText="Lanjut" />
    </section>
  )
}

function FavoriteThingsScreen({ form, onBack, onNext, onUpdate }) {
  return (
    <section className="screen form-screen wide-form" aria-labelledby="favorite-things-title">
      <ScreenHeader
        id="favorite-things-title"
        icon={<Heart size={24} fill="currentColor" />}
        title="Hal favorit Nasywa"
        text="Isi manual ya, biar jawabannya benar-benar versi kamu."
      />

      <div className="field-grid manual-favorites">
        <label className="field-card">
          <span>
            <Utensils size={18} />
            Makanan favorit
          </span>
          <input
            type="text"
            value={form.food}
            onChange={(event) => onUpdate('food', event.target.value)}
            placeholder="Contoh: seblak level sayang"
          />
        </label>

        <label className="field-card">
          <span>
            <Coffee size={18} />
            Minuman favorit
          </span>
          <input
            type="text"
            value={form.drink}
            onChange={(event) => onUpdate('drink', event.target.value)}
            placeholder="Matcha, es teh, coklat, apa aja"
          />
        </label>

        <label className="field-card">
          <span>
            <Palette size={18} />
            Warna favorit
          </span>
          <input
            type="text"
            value={form.color}
            onChange={(event) => onUpdate('color', event.target.value)}
            placeholder="Pink soft, biru langit, lilac..."
          />
        </label>

        <label className="field-card">
          <span>
            <Music size={18} />
            Lagu favorit
          </span>
          <input
            type="text"
            value={form.song}
            onChange={(event) => onUpdate('song', event.target.value)}
            placeholder="Lagu yang bikin senyum"
          />
        </label>

        <label className="field-card">
          <span>
            <MessageCircle size={18} />
            Kamu sukanya apa?
          </span>
          <input
            type="text"
            value={form.comfort}
            onChange={(event) => onUpdate('comfort', event.target.value)}
            placeholder="Bunga, foto lucu, ngobrol lama..."
          />
        </label>
      </div>

      <StepActions onBack={onBack} onNext={onNext} nextText="Lanjut" />
    </section>
  )
}

function PlanDetailsScreen({ form, onBack, onNext, onUpdate }) {
  return (
    <section className="screen form-screen wide-form" aria-labelledby="plan-title">
      <ScreenHeader
        id="plan-title"
        icon={<Gamepad2 size={24} />}
        title="Rencana mainnya"
        text="Tinggal pilih gaya mainnya, nanti aku rapikan jadi rencana."
      />

      <div className="field-grid">
        <ColorPaletteField
          label="Warna atasan"
          value={form.topColor}
          onChange={(value) => onUpdate('topColor', value)}
        />
        <ColorPaletteField
          label="Warna bawahan"
          value={form.bottomColor}
          onChange={(value) => onUpdate('bottomColor', value)}
        />
        <SelectField
          icon={<Gamepad2 size={18} />}
          label="Ide main"
          value={form.activity}
          options={selectOptions.activity}
          onChange={(value) => onUpdate('activity', value)}
        />

        <label className="field-card notes-field">
          <span>
            <MessageCircle size={18} />
            Catatan kecil
          </span>
          <textarea
            value={form.notes}
            onChange={(event) => onUpdate('notes', event.target.value)}
            placeholder="Tulis request lucu, pantangan, atau kode rahasia"
            rows="4"
          ></textarea>
        </label>
      </div>

      <StepActions onBack={onBack} onNext={onNext} nextText="Lihat rencana" />
    </section>
  )
}

function ConfirmationScreen({ form, onEdit, onSend }) {
  const summary = [
    ['Tanggal', formatDate(form.date)],
    ['Jam', form.time],
    ['Makanan', form.food],
    ['Minuman', form.drink],
    ['Warna', form.color],
    ['Sukanya', form.comfort],
    ['Atasan', form.topColor],
    ['Bawahan', form.bottomColor],
    ['Ide main', form.activity],
    ['Lagu', form.song],
  ]

  return (
    <section className="screen confirmation-screen" aria-labelledby="confirm-title">
      <div className="confirm-visual">
        <img src={mascotImg} alt="Ilustrasi teddy bear dan bunny sebagai tanda rencana jadi" />
      </div>

      <div className="confirm-copy">
        <h1 id="confirm-title">Deal, jadi main!</h1>
        <p>Ini draft rencana paling manis versi Nasywa.</p>
      </div>

      <dl className="summary-list">
        {summary.map(([label, value]) => (
          <div className="summary-row" key={label}>
            <dt>{label}</dt>
            <dd>{value || '-'}</dd>
          </div>
        ))}
        <div className="summary-row notes-summary">
          <dt>Catatan</dt>
          <dd>{form.notes || 'Tidak ada catatan, yang penting jadi.'}</dd>
        </div>
      </dl>

      <div className="final-actions">
        <button className="primary-button" type="button" onClick={onSend}>
          <Send size={19} />
          Kirim
        </button>
        <button className="ghost-button" type="button" onClick={onEdit}>
          <RotateCcw size={18} />
          Ubah jawaban
        </button>
      </div>
    </section>
  )
}

function ScreenHeader({ id, icon, title, text }) {
  return (
    <header className="screen-header">
      <div className="screen-icon">{icon}</div>
      <div>
        <h1 id={id}>{title}</h1>
        <p>{text}</p>
      </div>
    </header>
  )
}

function SelectField({ icon, label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const fieldRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const closeOnOutsideClick = (event) => {
      if (!fieldRef.current?.contains(event.target)) setIsOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  return (
    <div className="field-card select-field" ref={fieldRef}>
      <span>
        {icon}
        {label}
      </span>
      <button
        className={`select-trigger ${isOpen ? 'open' : ''}`}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{value}</span>
        <ChevronDown size={18} />
      </button>
      {isOpen && (
        <div className="select-menu" role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              className={`select-option ${value === option ? 'selected' : ''}`}
              type="button"
              role="option"
              aria-selected={value === option}
              key={option}
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ColorPaletteField({ label, value, onChange }) {
  return (
    <div className="field-card palette-field">
      <span>
        <Shirt size={18} />
        {label}
      </span>
      <div className="palette-scroll" role="radiogroup" aria-label={label}>
        {colorOptions.map((color) => (
          <button
            className={`palette-chip ${value === color.name ? 'selected' : ''}`}
            type="button"
            key={color.name}
            aria-label={color.name}
            aria-pressed={value === color.name}
            onClick={() => onChange(color.name)}
          >
            <span className="palette-dot" style={{ '--color': color.value }}></span>
            <span>{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepActions({ onBack, onNext, nextText }) {
  return (
    <div className="step-actions">
      <button className="ghost-button" type="button" onClick={onBack} aria-label="Kembali">
        <ChevronLeft size={20} />
        <span className="action-label">Kembali</span>
      </button>
      <button className="primary-button" type="button" onClick={onNext} aria-label={nextText}>
        <span className="action-label">{nextText}</span>
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

function MusicPlayer({ audioRef, gesturePlayAtRef, isPlaying, playMusic, setIsPlaying }) {
  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return

    if (!audio.paused && Date.now() - gesturePlayAtRef.current < 450) return

    if (audio.paused) {
      playMusic(true)
      return
    }

    audio.pause()
    setIsPlaying(false)
  }

  return (
    <div className="music-control">
      <audio
        ref={audioRef}
        src={musicSrc}
        autoPlay
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={(event) => {
          event.currentTarget.currentTime = 0
          event.currentTarget.play()
        }}
      />
      <button
        className="music-button"
        type="button"
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
        title={isPlaying ? 'Jeda musik' : 'Putar musik'}
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
      </button>
    </div>
  )
}

function buildPlanMessage(form) {
  return [
    'Haiii, aku sudah isi undangan mainnya 💗',
    '',
    'Aku mau main sama kamu, ini pilihanku yaa 🥺✨',
    '',
    `📅 Tanggal: ${formatDate(form.date)}`,
    `⏰ Jam: ${form.time || '-'}`,
    '',
    'Favorit aku:',
    `🍜 Makanan: ${form.food || '-'}`,
    `🥤 Minuman: ${form.drink || '-'}`,
    `🎀 Warna: ${form.color || '-'}`,
    `🎧 Lagu: ${form.song || '-'}`,
    `🌷 Kamu sukanya: ${form.comfort || '-'}`,
    '',
    'Dresscode gemas:',
    `👚 Atasan: ${form.topColor || '-'}`,
    `👖 Bawahan: ${form.bottomColor || '-'}`,
    '',
    `🎮 Ide main: ${form.activity || '-'}`,
    `💌 Catatan kecil: ${form.notes || '-'}`,
    '',
    'Udah yaa, sekarang tinggal kamu bales dan bikin rencananya jadi beneran 😳💕',
  ].join('\n')
}

async function sendWhatsAppPlan(form) {
  const plan = buildPlanMessage(form)
  const whatsappUrl = `https://wa.me/6285326513324?text=${encodeURIComponent(plan)}`

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
}

export default App
