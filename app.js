const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'goodreads.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.post('/register/', async (request, response) => {
  const {username, name, password, gender, location} = request.body
  const getPassword = await bcrypt.hash(request.body.password, 10)
  const getQuery = `
    select
    *
    from user
    where username=${username}`
  const dbUser = await db.get(getQuery)
  if (dbUser === undefined) {
    const getUpdatedquery = `
    INSERT INTO 
    user (username,name,password,gender,location)
    Values(
       '${username}',
       '${name}',
       '${password}',
       '${gender}',
       '${location}'
    )`
     const lengthOfPassword = password.length
  if (lengthOfPassword < 5) {
    response.status(400)
    response.send('Password is too short')
  }else{
    const getQury = await db.run(getUpdatedquery)
    const newUserId = dbResponse.lastId
    response.status(200)
    response.send('user created successfully')
  }
  } else {
    response.status(400)
    response.send('User already exists')
  }
  
});

app.post('/login/', async (request, response) => {
  const {username, password} = request.body
  const postLogin = `
  select
  *
  from user
  where username= ${username}`
  const getPst = await db.run(postLogin)
  if (dbUser === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    response.status(200)
    response.send('login success!')
    const isPassword = await bcrpt.compare(password, dbUser.password)
    if (isPassword === false) {
      response.status(400)
      response.send('Invalid password')
    }
  }
})
app.put('/change-password', async (request, response) => {
  const {username, oldPassword, newPassword} = request.body
  const changePassword = `
SELECT
*
FROM
user
WHERE
username=${username};`
  const dbuser = await db.run(changePassword)
  if (dbuser === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const isvalidPassword =await bcrpt.compare(oldPassword, dbuser.password)
    if (isvalidPassword === true) {
    const lengthOfPasswords = newPassword.length
    if (lengthOfPasswords < 5) {
      response.status(400)
      response.send('Password is too short')
    } else {
      const encryptPassword = bcrpt.hash(newPassword, 10)
      const updatePassword = `
    update user
    set password= '${encryptPassword}';
    where username= '${username}';
    await db.run(updatePassword);
    response.send("Password updated");  
    `
    }}
    else{
        response.status(400)
      response.send('Invalid current password')
    }
    }
  
});
