/**
 * 评价
*/
const { addAPIConfig, getAPIUrl } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');
// 增加接口映射
addAPIConfig('get_pendingcomment_list', '/goodsdetail/m/getpendingcomment'); // 待评价
addAPIConfig('get_comment_list', '/goodsdetail/m/getcommented'); // 已评价
addAPIConfig('commit_comment', '/goodsdetail/m/commitcomment'); // 提交评价
addAPIConfig('upload_comment_pic', '/goodsdetail/m/uploadcommentpic'); // 图片上传到服务器

// 待评价
const getPendingCommentList = ({
  pagesize = 10,
  pageindex = 1
}, autoShowLoading = true) => {
  return getRequest({
    name: 'get_pendingcomment_list',
    data: {
      pagesize,
      pageindex
    },
    autoShowLoading
  })
}
// 已评价
const getCommentList = ({
  pagesize = 10,
  pageindex = 1
}, autoShowLoading = true) => {
  return getRequest({
    name: 'get_comment_list',
    data: {
      pagesize,
      pageindex
    },
    autoShowLoading
  })
}
// 提交评价
const commit_comment = ({
  anonymity = "", orderlineid = "", picturename = "", stars = "", text = ""
}) => {
  return postRequest({
    name: 'commit_comment',
    data: {
      anonymity, orderlineid, picturename, stars, text
    }
  })
}
module.exports = {
  getPendingCommentList,
  getCommentList,
  commit_comment
}