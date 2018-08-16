/**
 * 帮助中心
 */
const {
  addAPIConfig
} = require('../utils/config.js');
const {
  getRequest,
  postRequest
} = require('../utils/request.js');

addAPIConfig('HELPER_FIRSTCATE','/help/m/get/firstcate')// 一级分类
addAPIConfig('HELPER_PROBLEMLIST','/help/m/get/problemlist')// 问题列表
addAPIConfig('HELPER_COMMPROBLEM','/help/m/get/commproblem')// 常见问题
addAPIConfig('HELPER_PROBLEMDETAILS','/help/m/get/problemdetails')// 问题详情
addAPIConfig('HELPER_PROBLEMSTATE','/help/m/update/problemstate')// 更新状态
addAPIConfig('HELPER_PROBLEMVIEWS','/help/m/update/problemviews') // 更新浏览数
//获取一级分类
const getFirstcate=(options={})=>{
  options.name ='HELPER_FIRSTCATE';
  return postRequest(options,{
    flag: 0 //0 买家,1卖家
  })
}
//获取二级问题列表
const getProbemList = (id,options = {}) => {
  options.name = 'HELPER_PROBLEMLIST';
  return postRequest(options, {
    qa_sort_id:id,
    flag: 0 //0 买家,1卖家
  })
}
// 获取常见问题
const getCommProblem = (options={})=>{
  options.name = 'HELPER_COMMPROBLEM';
  return postRequest(options, {
    flag: 0 //0 买家,1卖家
  })
}
// 获取问题详情
const getProblemDetail = (cateid,id,options = {}) => {
  options.name = 'HELPER_PROBLEMDETAILS';
  return postRequest(options, {
    qa_sort_id: cateid,
    qa_detail_id: id,
    flag: 0 //0 买家,1卖家
  })
}
// 获取问题详情
const updateProblemFlag = (id, flag, options = {}) => {
  options.name = 'HELPER_PROBLEMSTATE';
  return postRequest(options, {
    qa_detail_id: id,
    useful_flag: flag
  })
}
// 更新浏览数
const updateProblemViews = (id, options = {}) => {
  options.name = 'HELPER_PROBLEMVIEWS';
  return postRequest(options, {
    qa_detail_id: id
  })
}
module.exports={
  getFirstcate,
  getProbemList,
  getCommProblem,
  getProblemDetail,
  updateProblemFlag,
  updateProblemViews
}