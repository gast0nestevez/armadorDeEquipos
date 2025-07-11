import HelpMessage from "./HelpMessage"

const Form = ({ players, handleChange, deletePlayer, submitPlayers }) => {
  return (
    <div className="form w-full p-6 flex flex-col justify-between flex-1 relative">
      <div className='flex items-center justify-center mb-4 gap-4'>
          <h1 className="text-3xl font-bold text-center">Jugadores</h1>
          <HelpMessage />
      </div>

      <div className="m-[15px] p-[8px] overflow-y-scroll">
        {players.map((player, index) => (
          <div key={index} className="flex justify-center items-center gap-2 mt-2 mb-2">
            <label htmlFor={index} className="min-w-[5%] mr-[10px] text-base font-bold text-center">{index + 1}</label>
            <input
              type="text"
              placeholder="Nombre"
              maxLength="25"
              id={index}
              className="border rounded px-3 py-2"
              value={player.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="Puntaje"
              className="border rounded px-3 py-2 w-24"
              value={player.skill}
              onChange={(e) => handleChange(index, 'skill', e.target.value)}
            />
            <button onClick={() => deletePlayer(index)} tabIndex="-1">
              <img src="delete.png" alt="delete_input" className="w-5 h-5 cursor-pointer" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={submitPlayers}
        className="mt-4 bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 block mx-auto cursor-pointer"
      >
        Armar equipos
      </button>
    </div>
  )
}

export default Form
