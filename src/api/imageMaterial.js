import service from '@/utils/request'

// 图库分类列表
export const imageClass = (page) => {
  return service({
    url: `/admin/image_class/${page}`
  })
}

// 增加图库分类
/**
 * 
 * @param {*} name 图库分类名称
 * @param {*} order 排序
 * @returns 
 */
export const addImageClass = (name, order) => {
  return service({
    url: `/admin/image_class`,
    method: 'post',
    data: {
      name,
      order
    }
  })
}

// 编辑图库分类
export const editImageClass = (id, name, order) => {
  return service({
    url: `/admin/image_class/${id}`,
    method: 'post',
    data: {
      name,
      order
    }
  })
}

// 删除图库分类
export const delImageCLass = (id) => {
  return service({
    url: `/admin/image_class/${id}/delete`,
    method: 'post'
  })
}

// 指定分类下的图片列表
export const specifiedImageList = (id, page) => {
  return service({
    url: `/admin/image_class/${id}/image/${page}`
  })
}

// 修改图片名称
export const updateImageName = (id, name) => {
  return service({
    url: `/admin/image/${id}`,
    method: 'post',
    data: {
      name
    }
  })
}

// 删除图片
/**
 * 
 * @param {Array} ids 图片ID组成的一维数组
 * @returns 
 */
export const deleteImage = (ids) => {
  return service({
    url: '/admin/image/delete_all',
    method: 'post',
    data: {
      ids
    }
  })
}

// 图片上传
// 
/**
 * @param {Number} image_class_id 图库分类ID
 * @param {Number} img 图片文件地址
 * @returns 
 */
// export const uploadImage = (image_class_id, img) => {
//   return service({
//     url: '/admin/image/upload',
//     method: 'post',
//     data: {
//       image_class_id,
//       img
//     }
//   })
// }

export const imageUploadAction = 'api/admin/image/upload'
