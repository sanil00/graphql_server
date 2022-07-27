import { ApolloServer, gql } from "apollo-server"
import fetch from "node-fetch"

let tweets = [
    {
        id: "1",
        text: "first one",
        userId: "2",
    },
    {
        id: "2",
        text: "second one",
        userId: "1",
    },
]

let users = [
    {
        id: "1",
        firstName: "re",
        lastName: "sdfef",
    },
    {
        id: "2",
        firstName: "bbkd",
        lastName: "wer",
    },
]

const typeDefs = gql`
    type Movie {
        id: Int!
        url: String!
        imdb_code: String!
        title: String!
        title_english: String!
        title_long: String!
        slug: String!
        year: Int!
        rating: Float!
        runtime: Float!
        genres: [String]!
        summary: String!
        description_full: String!
        synopsis: String!
        yt_trailer_code: String!
        language: String!
        mpa_rating: String!
        background_image: String!
        background_image_original: String!
        small_cover_image: String!
        medium_cover_image: String!
        large_cover_image: String!
        state: String!
        torrents: String!
        date_uploaded: String!
        date_uploaded_unix: String!
    }

    type User {
        id: ID
        fullName: String
        firstName: String
        lastName: String
    }
    type Tweet {
        id: ID
        text: String
        author: User
    }
    type Query {
        allMovies: [Movie!]!
        allUsers: [User]
        allTweets: [Tweet]
        tweet(id: ID): Tweet
        movie(id: String!): Movie
    }

    type Mutation {
        postTweet(text: String, userId: ID): Tweet
        """
        documentation 각 타입에 대해 설명을 작성하는 방법
        """
        deleteTweet(id: ID): Boolean
    }
`

const resolvers = {
    Query: {
        allTweets() {
            return tweets
        },
        tweet(root, { id }) {
            return tweets.find((tweet) => tweet.id === id)
        },
        allUsers(root) {
            return users
        },
        allMovies() {
            return fetch("https://yts.mx/api/v2/list_movies.json")
                .then((data) => data.json())
                .then((json) => json.data.movies)
        },
        movie(root, { id }) {
            return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
                .then((data) => data.json())
                .then((json) => json.data.movie)
        },
    },
    Mutation: {
        postTweet(root, { text, userId }) {
            const newTweet = {
                id: tweets.length + 1,
                text: text,
            }
            tweets.push(newTweet)
            return newTweet
        },

        deleteTweet(root, { id }) {
            const tweet = tweets.find((tweet) => tweet.id === id)
            if (!tweet) return false
            tweets = tweets.filter((tweet) => tweet.id !== id)
            return true
        },
    },
    User: {
        lastName({ lastName }) {
            // console.log(root)
            console.log(1)
            return lastName
        },
        fullName({ firstName, lastName }) {
            console.log(2)
            return `${firstName} ${lastName}`
        },
    },
    Tweet: {
        author({ userId }) {
            return users.find((user) => user.id === userId)
        },
    },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
    console.log(`Runing on ${url}`)
})
