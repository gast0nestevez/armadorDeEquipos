import { Link } from "react-router-dom"
import '../css/home.css'

const Home = () => {
  return (
    <div className="home-page">
      <h1>
        <span>Armá</span>
        <span>Tus</span>
        <span>Equipos</span>
      </h1>
      <nav>
        <h3>Modos</h3>
        <ul>
          <li>
            <Link to="/clasico">Clásico (2 equipos)</Link>
          </li>
          {/*
          <li>
            <Link to="/">Clásico (3 equipos)</Link>
            <span style={{color: 'red'}}>Próximamente</span>
          </li>
          <li>
            <Link to="/">Clásico (4 equipos)</Link>
            <span style={{color: 'red'}}>Próximamente</span>
          </li>
          <li>
            <Link to="/">Mixto (2 equipos)</Link>
            <span style={{color: 'red'}}>Próximamente</span>
          </li>
          <li>
            <Link to="/">Mixto (3 equipos)</Link>
            <span style={{color: 'red'}}>Próximamente</span>
          </li>
          <li>
            <Link to="/">Mixto (4 equipos)</Link>
            <span style={{color: 'red'}}>Próximamente</span>
          </li>
          */}
        </ul>
      </nav>
    </div>
  )
}

export default Home
