const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { GraphQLError} = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

const resolvers = {
    Query: {
        bookCount: async () => (await Book.find({})).length,
        authorCount: async () => (await Author.find({})).length,
        allBooks: async (root,args) => {
            const books = await Book.find({}).populate('author')
            
            if(args.author){
                const author = await Author.findOne({ name: args.author })
                const id = author._id                
                if(!args.genre) return books.filter(book => book.author.toString() === id.toString())
                return books.filter(book => book.author === id && book.genres.includes(args.genre))
            }
            if(args.genre) return books.filter(book => book.genres.includes(args.genre))
            return books
        },
        booksByGenre: async (root,args) => {
            const books = await Book.find({}).populate('author')
            if(!args.genre) return books
            return books.filter(book=>book.genres.includes(args.genre))
        },
        allAuthors: async () => await Author.find({}),
        me: (root, args, context) => {
            return context.currentUser
        }
    },
    Author: {
        bookCount: async (root) => {
            return root.books.length
        }
    },
    Mutation: {
        addBook: async (root,args,context) => {
            const currentUser = context.currentUser
            if(!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }
            var author = await Author.findOne({ name: args.author })
            if(!author){
                author = new Author({ name: args.author })
                try {
                   await author.save()
                } catch(error) {
                    throw new GraphQLError('Saving author failed'), {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.author,
                            error
                        }
                    }
                }
            }
            const book = new Book({ ...args, author: author})
            
            try { 
                await book.save()
            } catch(error) {
                throw new GraphQLError('Saving book failed', {
                    extensions: {
                        code: 'BAD_INPUT_USER',
                        invalidArgs: args.title,
                        error
                    }
                })
            }

            await Author.findOneAndUpdate({ name: author.name }, { books: author.books.concat(book._id) })

        
            pubsub.publish('BOOK_ADDED', { bookAdded: book })

            return book
        },
        addAuthor: async (root, args) => {
            const author = new Author({ ...args })
            try {
                await author.save()
            } catch(error) {
                throw new GraphQLError('Saving author failed'), {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.author,
                        error
                    }
                }
            }
            return author
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser
            if(!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }
            var author = null
            try { 
                author = await Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo })
            } catch(error) {
                throw new GraphQLError('Saving author failed'), {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.setBornTo,
                        error
                    }
                }
            }
            return author
        },
        createUser: async (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed'), {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.name,
                            error
                        }
                    }
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if( !user || args.password !== 'secret' ) {
                throw new GraphQLError('wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        }
    }
}


module.exports = resolvers