import { useState } from 'react';

const useFlashMessage = (duration: number = 2000) => {
  const [visible, setVisible] = useState<boolean>(false);

  const trigger = (): void => {
    setVisible(true);
    setTimeout(() => setVisible(false), duration);
  };

  return { visible, trigger };
};

export default useFlashMessage;
