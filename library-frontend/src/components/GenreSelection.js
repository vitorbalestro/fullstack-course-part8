import {  BOOK_GENRES } from '../queries'
import { useQuery } from '@apollo/client'


const GenreSelection = ({ setGenre }) => {

  const getGenres = useQuery(BOOK_GENRES)

  if(getGenres.loading){
    return(
      <div>loading genres...</div>
    )
  }

  const genres = getGenres.data.allBooks
  var genresList = []
  for(var obj of genres){
    for(var type of obj.genres){
      if(!genresList.includes(type)){
        genresList = genresList.concat(type)
      }
    }
  }

  return (
    <div>
        <button onClick={()=>setGenre(null)}>all genres</button>
        {genresList.map(genre => <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>)}
    </div>
  )
}

export default GenreSelection