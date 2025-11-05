import { useState } from 'react'
import { CircleQuestionMark } from 'lucide-react'

const HelpMessage = () => {
  const [showHelpMessage, setShowHelpMessage] = useState(false)

  return (
    <div className='flex justify-center items-center'>
      <button
        className='w-6 h-6 cursor-pointer'
        onClick={() => setShowHelpMessage(!showHelpMessage)}
        onMouseOver={() => setShowHelpMessage(true)}
        onMouseLeave={() => setShowHelpMessage(false)}
      >
        <CircleQuestionMark />
      </button>

      {showHelpMessage && (
        <div className='help-message top-16 ml-2 w-64 p-2 bg-white border border-blue-300 rounded shadow text-sm absolute z-10'>
          Ingresá los nombres y puntajes de los jugadores, cuando empieces a escribir el nombre de un jugador se habilitará el cuadro del siguiente. Luego hacé clic en 'Armar equipos' para generar. Listo!
        </div>
      )}
    </div>
  )
}

export default HelpMessage
