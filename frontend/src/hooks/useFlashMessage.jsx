import { useState } from 'react'

const useFlashMessage = (duration = 2000) => {
  const [visible, setVisible] = useState(false)

  const trigger = () => {
    setVisible(true)
    setTimeout(() => setVisible(false), duration)
  }

  return { visible, trigger }
}

export default useFlashMessage
