import { get } from '../get'
import { getCategoryId } from '../../util';

export function getSearchData(page = 0, cityName = '杭州', category = '', keyword = '') {
    const result = get(`/api/search?page=${page}&cityName=${cityName}&category=${getCategoryId(category)}&keyword=${keyword}`)
    return result
}