import { request } from '@/utils/request.js'

export const getProfiles = username => {
  return request({
    method: 'GET',
    url: `/api/profiles/${username}`,
  })
}