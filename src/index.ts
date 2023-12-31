import express, { NextFunction, Response, Request } from 'express'

import usersRouter from './routes/users.routes'
import databaseService from './services/database.servies'
import { defauftErrorHandler } from './middlewares/error.middlewars'
const app = express()
app.use(express.json())
const PORT = 3000
databaseService.connect()

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/users', usersRouter)
//localhost:3000/users/tweets

app.use(defauftErrorHandler)

app.listen(PORT, () => {
  console.log(`Project twitter này đang chạy trên post ${PORT}`)
})
