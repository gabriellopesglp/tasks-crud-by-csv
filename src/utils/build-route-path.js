// /users/:id/
export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)') // ?<$1> serve pra pegar o nome do campo depois dos : e coloca como nome do objeto, ex: :id vira id: '1'

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`) // ^ significa que a string precisa começar com a regex do pathWithParams, se não colocar quer dizer que só precisa conter o regex e depois da URL pode ter um grupo de query

  return pathRegex
}