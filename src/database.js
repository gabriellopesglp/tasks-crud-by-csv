import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  // # serve pra impedir o acesso externo a este arquivo
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8').then(data => {
      this.#database = JSON.parse(data)
    })
    .catch(() => {
      this.#persist() // Caso não exista o arquivo json ele cria
    })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => { // Object.entries transforma o objeto por array, ex: { name: 'Gabera' } => [['name', 'Gabera']] 
          return row[key].toLowerCase().includes(value.toLowerCase()) // retorna as linhas em que a chave (name ou email) incluirem o valor enviado na query
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])){
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      const row = this.#database[table][rowIndex]
      this.#database[table][rowIndex] = {id, ...row, ...data}
      this.#persist()
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }
}