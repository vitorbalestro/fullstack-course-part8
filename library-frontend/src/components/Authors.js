import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, SET_BIRTHYEAR } from '../queries'
import { useState } from 'react'

const Authors = (props) => {
  
  const [ author, setAuthor ] = useState('')
  const [ birthyear, setBirthyear ] = useState('')

  const result = useQuery(ALL_AUTHORS)

  const [ setAuthorBirthyear ] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (!props.show) {
    return null
  }

  if(result.loading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  const submitBirthyear = (event) => {
    event.preventDefault()

    const birthyearInt = Number.parseInt(birthyear)

    setAuthorBirthyear({ variables: { name: author, setBornTo: birthyearInt } })

    setAuthor('')
    setBirthyear('')
  }

  const authors = result.data.allAuthors

  const authorNames = authors.map(author => author.name)

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token 
      ? <div><h2>set birthyear</h2>
      <form onSubmit={submitBirthyear}>
        <div><label>
          name
          <select 
            value={author}
            onChange={ ({ target }) => setAuthor(target.value)}>
              <option>Select author</option>
              {authorNames.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
        </label>
        </div>
        <div>born
          <input type="number" value={birthyear} 
            onChange={ ({ target }) => setBirthyear(target.value) } />
        </div>
        <button type="submit">update author</button>
      </form></div>
      : <></> }
    </div>
  )
}

export default Authors
