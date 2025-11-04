import { useState } from 'react'

const MAX_INPUTS = 40

function usePlayers(initialPlayers = [{ name: '', skill: '' }]) {
  const [players, setPlayers] = useState(initialPlayers)

  function limitSkillInputLength(value) {
    return value.replace(/[^0-9]/g, '').slice(0, 3)
  }

  function removeUnsafeCharacters(input) {
    const lowercase = 'a-z'
    const uppercase = 'A-Z'
    const digits    = '0-9'
    const special   = 'ñÑáÁéÉíÍóÓúÚ'
    const allowedCharacters = `[^${lowercase}${uppercase}${digits}${special} ]`
    const regex   = new RegExp(allowedCharacters, 'g')
    return input.replace(regex, "")
  }

  function validateValue(value, field) {
    if (field === 'skill') {
      value = limitSkillInputLength(value)
    } else {
      value = removeUnsafeCharacters(value)
    }
    return value
  }

  const handleChange = (index, field, value) => {
    value = validateValue(value, field)

    const newPlayers = [...players]
    newPlayers[index][field] = value
    setPlayers(newPlayers)

    // Automatically add a new input if the last one is being filled
    if (
      index === players.length - 1 &&
      newPlayers[index].name.trim() !== '' &&
      index < MAX_INPUTS-1
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
