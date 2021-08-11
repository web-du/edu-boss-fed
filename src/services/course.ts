/**
 * 课程相关请求模块
 */

import request from '@/utils/request'
// eslint-disable-next-line
export const getQueryCourses = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}
// eslint-disable-next-line
export const changeState = (params: any) => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}
// eslint-disable-next-line
export const saveOrUpdateCourse = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}
// eslint-disable-next-line
export const uploadCourseImage = (data: any, onUploadProgress: (progressEvent: ProgressEvent) => void) => {
  // 该接口要求的请求数据类型是：multipart/form-data
  // 所以需要提交 FormData 数据对象
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    // HTML5 新增的上传响应事件：progress
    onUploadProgress
  })
}
// eslint-disable-next-line
export const getCourseById = (courseId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}
