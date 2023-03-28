import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const title = req.body.title
      const description = req.body.description
      console.log(title, description)

      const hasId = database.select('tasks', id ? {
        id: id,
      } : null)

      if (hasId === false || hasId.length === 0) {
        return res.writeHead(404).end();
      }

      if (title === undefined && description === undefined) {
        return res.writeHead(404).end(JSON.stringify('Is missing a title or description'))
      } else if (req.body.title === true && req.body.description === true) {
        database.update('tasks', id, {
          title,
          description
        })
      } else if (description === undefined) {
        database.update('tasks', id, { title })
      } else if (title === undefined) {
        database.update('tasks', id, { description })
      }
      return res.writeHead(204).end()
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end()
      }

      const isTaskCompleted = !!task.completed_at
    
      const completed_at = isTaskCompleted ? null : new Date()

      database.update('tasks', id, { completed_at })

      return res.writeHead(204).end()
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const hasId = database.select('tasks', id ? {
        id: id,
      } : false)

      if (hasId === false || hasId.length === 0) {
        return res.writeHead(404).end();
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    },
  }
]