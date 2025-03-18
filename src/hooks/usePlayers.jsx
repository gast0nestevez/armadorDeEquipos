import { useState } from 'react'

const LIMIT = 25

function usePlayers(initialPlayers = [{ name: '', skill: '' }]) {
  const [players, setPlayers] = useState(initialPlayers)

  const handleChange = (index, field, value) => {
    const newPlayers = [...players]
    newPlayers[index][field] = value
    setPlayers(newPlayers)

    // Automatically add a new input if the last one is being filled
    if (
      index === players.length - 1 &&
      newPlayers[index].name.trim() !== '' &&
      index < LIMIT
    ) {
      setPlayers([...newPlayers, { name: '', skill: '' }])
    }
  }

  const deletePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index))
  }

  return { players, setPlayers, handleChange, deletePlayer }
}

export default usePlayers
