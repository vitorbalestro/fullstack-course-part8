import { useQuery } from '@apollo/client'
import { GET_LOGGED_USER } from '../queries'
import BooksList from './BooksList'

const Recommendations = (props) => {

    const result = useQuery(GET_LOGGED_USER)

    if(!props.show) return null


    if(result.loading){
        return (
            <div>loading...</div>
        )
    }

    const loggedUser = result.data.me.username
    const favoriteGenre = result.data.me.favoriteGenre

    return (
        <div>
            <h3>recommendations for {loggedUser}</h3>
            <BooksList genre={favoriteGenre} />
        </div>
    )
}


export default Recommendations