import { get } from '../get'
import { post } from '../post'

export function getOrderListData(uid) {
    console.log(uid);
    const result = get(`/api/order?uid=${uid}`)
    return result
}

export function postComment(id, comment, star) {
    const result = post('/api/comment/add', {
        id: id,
        comment: comment,
        star: star
    })
    return result
}