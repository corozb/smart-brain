const express = require('express')
const bcrypt = require('bcrypt')
const saltRounds = 10
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const database = {
  users: [
    {
      id: '123456',
      name: 'John',
      email: 'john@example.com',
      password: 'password',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '23456',
      name: 'Pera',
      email: 'johnpera@example.com',
      password: 'passwordbanana',
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'johnpera@example.com',
    },
  ],
}

app.get('/', (req, res) => {
  res.send(database.users)
})

app.post('/signin', (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare('green', '$2b$10$xCAeT8q72AxzL89C8qzad.yj4/z/hRhj1L4NO1nvfERuu9d2.e9DO', function (err, result) {
    console.log('has entrao', result)
  })
  bcrypt.compare('epa', '$2b$10$xCAeT8q72AxzL89C8qzad.yj4/z/hRhj1L4NO1nvfERuu9d2.e9DO', function (err, result) {
    console.log('no enor', result)
  })

  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json(database.users[0])
  } else {
    res.status(404).json('wrong credentials')
  }
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body
  bcrypt.hash(password, saltRounds, function (err, hash) {
    console.log(hash)
  })

  database.users.push({
    id: '4',
    name,
    email,
    entries: 0,
    joined: new Date(),
  })
  res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  let found = false
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true
      return res.json(user)
    }
  })

  if (!found) {
    res.status(404).json('no found')
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body
  let found = false
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true
      user.entries++
      return res.json(user.entries)
    }
  })

  if (!found) {
    res.status(404).json('no found')
  }
})

app.listen(5000, () => {
  console.log('app is running')
})

// res = this is working
// signin ---> POST = success/fail
// register ---> POST = user
// /profile/:userId ---> GET = user
// /image --> PUT ---> user
