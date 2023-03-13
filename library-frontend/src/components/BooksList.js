import { BOOKS_BY_GENRE } from '../queries'
import { useQuery } from '@apollo/client'

const BooksList = ({ genre }) => {

    const result = useQuery(BOOKS_BY_GENRE, { variables: { genre: genre } })

    if(result.loading) {
        return (
          <div>loading...</div>
        )
      }
    
    const books = result.data.booksByGenre

  return (
    <div>
      {genre
      ? <h3>in genre '{genre}'</h3>
      : <h3>all genres</h3>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


export default BooksList