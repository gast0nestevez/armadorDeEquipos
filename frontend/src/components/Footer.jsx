import { Github } from 'lucide-react'

const Footer = ()  => {
  return (
    <footer className='flex justify-center w-full bg-black text-sm'>
      <a
        href='https://github.com/gast0nestevez/armadorDeEquipos'
        target='_blank'
        rel='noopener noreferrer'
        className='block w-fit px-4 py-3 text-gray-300 hover:text-white transition-colors'
      >
        <div className='flex justify-center items-center gap-2 mx-auto max-w-7xl'>
          <span>¿Querés contribuir?</span>
          <Github size={16} />
        </div>
      </a>
      <a 
        href='https://armador-de-equipos.vercel.app/privacy.html'
        rel='noopener noreferrer'
        className='block w-fit px-4 py-3 text-gray-300 hover:text-white transition-colors'
      >
        <div className='flex justify-center items-center gap-2 mx-auto max-w-7xl'>
          <span>Politica de privacidad</span>
        </div>
      </a>
    </footer>
  )
}

export default Footer
