import { get } from '../get'
import { post } from '../post'

export function login(obj) {
  const result = post('/api/users/login', obj);
  return result
}
