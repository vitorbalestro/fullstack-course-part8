import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
    query {
        allBooks {
            title,
            author {
                name
            },
            published
        }
    }
`
export const BOOK_GENRES = gql`
    query {
        allBooks{
            genres
        }
    }
`

export const BOOKS_BY_GENRE = gql`
    query booksByQuery($genre: String){
        booksByGenre(genre: $genre) {
            title,
            author{
                name
            },
            published
        }
        
    }
`

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name,
            born,
            bookCount
        }
    }
`

export const GET_LOGGED_USER = gql`
    query {
        me {
            username,
            favoriteGenre
        }
    }
`

export const CREATE_BOOK = gql`
    mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String]) {
        addBook(
            title: $title,
            author: $author,
            published: $published,
            genres: $genres
        ){
            title
            published
            genres
        }
    }
`

export const SET_BIRTHYEAR = gql`
    mutation setAuthorBirthyear($name: String!, $setBornTo: Int!) {
        editAuthor(
            name: $name,
            setBornTo: $setBornTo
        ){
            name
            born
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!){
        login(username: $username, password: $password){
            value
        }
    }
`

const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        title
        author {
            name
        }
        published
    }
`

export const BOOK_ADDED = gql`
 subscription {
    bookAdded { 
        ...BookDetails
    }
 }
 ${BOOK_DETAILS}
`