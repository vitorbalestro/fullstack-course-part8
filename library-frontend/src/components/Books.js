
import { useState } from 'react'
import GenreSelection from './GenreSelection'
import BooksList from './BooksList'

const Books = (props) => {
  
  const [ genre, setGenre ] = useState(null)
  
  if (!props.show) {
    return null
  }


  return (
    <div>
      <h2>books</h2>
      <BooksList genre={genre}/>
      <GenreSelection setGenre={setGenre} />
    </div>
  )
}

export default Books
