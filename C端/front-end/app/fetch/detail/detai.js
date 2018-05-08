import { get } from '../get'
import { post } from '../post';

export function getInfoData(id) {
    const result = get(`/api/detail/info?id=${id}`)
    return result
}

export function getCommentData(page, id) {
    const result = get(`/api/detail/comment?id=${id}`)
    return result
}

export function buyGoods(obj) {
    const result = post(`/api/detail/buy`, obj)
    return result;
}

export function addFav(obj) {
    const result = post(`/api/detail/fav/add`, obj);
    return result;
}

export function delFav(obj) {
    const result = post(`/api/detail/fav/del`, obj);
    return result;
}

export function getFav(userId) {
    const result = get(`/api/detail/fav?userid=${userId}`);
    
    return result;
}