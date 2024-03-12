// import Mock from 'mockjs'
import { SUCCESS_CODE } from '@/constants'

const timeout = 1000
export default [
  {
    url: '/mock/systemManagement/deleteData',
    method: 'delete',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        message: '删除数据成功'
      }
    }
  }
]
