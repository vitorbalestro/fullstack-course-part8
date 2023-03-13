
import { useState, useEffect } from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client'

const LoginForm = ({ setToken, setDisplayLoginForm }) => {

    const [username,setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    const [ login, result ] = useMutation(LOGIN, {
        onError: (error) => {
            console.log(error.graphQLErrors[0].message)
        }
    })
    
    const submit = async (event) => {
        event.preventDefault()
        login({ variables: { username, password }})
    }
    
    useEffect(() => {
        if(result.data) {
            const token = result.data.login.value
            setToken(token)
            setDisplayLoginForm(false)
            localStorage.setItem('logged-user-token', token)
        }
    }, [result.data]) // eslint-disable-line

    return(
        <div>
            <form onSubmit={submit}>
                <div>
                    username <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password <input
                        type='password'
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}


export default LoginForm