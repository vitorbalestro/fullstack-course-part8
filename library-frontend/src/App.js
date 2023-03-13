import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { useApolloClient, useSubscription } from '@apollo/client';
import { BOOK_ADDED, BOOKS_BY_GENRE } from './queries'

export const updateCache = (cache, query, bookAdded) => {
  const uniqueByTitle = (list) => {
    let seen = new Set()
    return list.filter((item) => {
      let book = item.title 
      return seen.has(book) ? false : seen.add(book)
    })
  }

  cache.updateQuery(query, ({ booksByGenre }) => {
    
    return {
      booksByGenre: uniqueByTitle(booksByGenre.concat(bookAdded))
    }
    
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [displayLoginForm, setDisplayLoginForm] = useState(false)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    setDisplayLoginForm(false)
    localStorage.clear()
    client.resetStore()
  }

  const handleLoginForm = () => {
    setDisplayLoginForm(!displayLoginForm)
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const bookAdded = data.data.bookAdded
      console.log(bookAdded)
      console.log(client.cache)
      alert(`Book '${bookAdded.title}' added!`)
      updateCache(client.cache, { query: BOOKS_BY_GENRE, variables: {
        genre: null
      } }, bookAdded)
    }
  })
  


  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token
        ? <> <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommendations')}>recommendations</button>
          <button onClick={() => logout()}>logout</button>
          </>
        : <button onClick={handleLoginForm}>login</button>}
      </div>
     
      {displayLoginForm 
      ? <div><LoginForm setToken={setToken} setDisplayLoginForm={setDisplayLoginForm} /></div>
      : <></>}
      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommendations show={page === 'recommendations'} />

    </div>
  )
}

export default App
