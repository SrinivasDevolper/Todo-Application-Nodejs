const express = require('express')
const app = express()
app.use(express.json())
const {open} = require('sqlite')
const path = require('path')
const dbPath = path.join(__dirname, 'todoApplication.db')
const sqlite3 = require('sqlite3')
let db = null
const hasPandS = requestQuery => {
  return requestQuery.priority != undefined && requestQuery.status != undefined
}

const hasPrority = requestQuery => {
  return requestQuery.priority != undefined
}

const hasStatus = requestQuery => {
  return requestQuery.status != undefined
}

const initailzdbRequest = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is Running http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error:- ${e.message}`)
    process.exit(1)
  }
}
initailzdbRequest()

app.get('/todos/', async (request, response) => {
  let data = null
  let getTodoQuery = ''
  let {search_q = '', priority, status} = request.query
  switch (true) {
    case hasPandS(request.query):
      getTodoQuery = `
              SELECT
                *
              FROM
              Todo
              WHERE
                todo like '%${search_q}%'
                AND status = '${status}'
                AND priority = '${priority}'
            `
      break
    case hasPrority(request.query):
      getTodoQuery = `
          SELECT
            *
          FROM
          Todo
          WHERE
            todo like '%${search_q}%'
            AND priority='${priority}';
        `
      break
    case hasStatus(request.query):
      getTodoQuery = `
          SELECT
            *
          FROM
          Todo
          Where
            todo like '%${search_q}%'
            AND status='${status}';
        `
      break
    default:
      getTodoQuery = `
          SELECT
            *
          FROM
          Todo
          Where
            todo like '%${search_q}%';
        `
  }
  data = await db.all(getTodoQuery)
  console.log(data)
  response.send(data)
})

app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const getIdFromTodoData = `
    SELECT
     * 
    FROM
    Todo
    WHERE id=${todoId}
  `
  const resultGetIdResponseFromData = await db.all(getIdFromTodoData)
  response.send(resultGetIdResponseFromData)
})
app.post('/todos/', async (request, response) => {
  console.log(request.body)

  // const {id, todo, priority, status} = request.body
  // const postRequestToData = `
  //     INSERT INTO todo(id, todo, priority, status)
  //     values(${id}, ${todo}, ${priority}, ${status})
  //   `
  // const postResponseFromData = await db.run(postRequestToData)
  // response.send('Todo Successfully Added')
})
