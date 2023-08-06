const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {movies, users} = require('./mockData')
const app = express()

const PORT = process.env.PORT || 8080

app.use(express.json())

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization

  if(authHeader) {
    const token = authHeader.split(" ")[1]

    jwt.verify(token, "hailsatan", (err, user) => {
      if(err) {
        res.sendStatus(403)
      }

      req.user = user
      next()
    })
  } else {
    res.sendStatus(403)
  }
}

app.get('/movies', authenticateJWT, (req, res) => {
  console.log(req)
  res.json(movies)
})
app.get('/movies/:id', (req, res) => {
  const {id} = req.params;
  const foundMovie = movies.find((movie) => movie.id === +id)

  res.json(foundMovie)
})

app.get('/users', (req, res) => {
  res.json(users)
})

// app.get('/users/:id', (req, res) => {
//   const {id} = req.params;
//   const foundUser = users.find((user) => user.id === +id)
  
//   res.json(foundUser)
// })

app.post('/signin', async (req, res) => {
  const {email,password} = req.body
  const foundUser = users.find((user) => user.email === email)

  const hashedPassword = await bcrypt.compare(password, foundUser.password)

  console.log({hashedPassword})

  if(hashedPassword) {
  const token = jwt.sign(foundUser, 'hailsatan')
  res.json({
    token
  })
}
})

app.post('/signup', async (req, res) => {
  const {email,password} = req.body
  const hashedPassword =  await bcrypt.hash(password, 8)
  
  users.push({
    email,
    password: hashedPassword
  })

  res.json(users.at(-1))
})

app.listen(PORT, console.log(`Listening on port ${PORT}`))
