
import './css/App.css'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import { Routes, Route } from 'react-router-dom'
import { MovieProvider } from './contexts/MovieContext'
import NavBar from './components/NavBar'

function App() {

   
  return (
    <MovieProvider>
      <div>
        <NavBar />
     
     <main className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>

      
        </main>
      </div>
    </MovieProvider>
  )
}


export default App;
