import { useState } from 'react'

const HelpMessage = () => {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="relative flex items-center justify-center">
      <button
        className="w-6 h-6 cursor-pointer"
        onClick={() => setShowHelp(!showHelp)}
      >
        <img src="help.png" alt="help" className="w-full h-full object-contain" />
      </button>

      {showHelp && (
        <div className="absolute left-full top-12 -translate-y-1/2 ml-2 w-64 p-2 bg-white border border-blue-300 rounded shadow text-sm z-10">
          Ingresá los nombres y puntajes de los jugadores, cuando empieces a escribir el nombre de un jugador se habilitará el cuadro del siguiente. Luego hacé clic en "Armar equipos" para generar. Listo!
        </div>
      )}
    </div>
  )
}

export default HelpMessage
