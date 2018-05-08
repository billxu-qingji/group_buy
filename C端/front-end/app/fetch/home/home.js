import { get } from '../get'

export function getAdData() {
    const result = get('/api/home/ad')
    return result
}

export function getListData(city, page) {
    const result = get('/api/home/list');
    return result
}