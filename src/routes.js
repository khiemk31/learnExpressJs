const user = require('./controller/user');
const category = require('./controller/category');
const size = require('./controller/size');
const product = require('./controller/product');
const bill = require('./controller/bill');
const view = require('./controller/main');

module.exports = (router) => {
  //Main Router
  router.get('/main', view.main);
  //category API
  router.get('/category/', category.category);
  router.get('/category/remove/:id', category.removeCategory);
  router.get('/insertCategory', category.getAddCategory);
  router.post('/addCategory', category.addCategory);
  router.get('/category/getUpdateCategory/:id', category.getUpdateCategory);
  router.post('/category/update', category.update);
  router.post('/category/search', category.search);
  router.get('/category/getAll', category.getAll);
  router.post('/category/update', category.update);
  router.get('/category/deleted', category.getCategoryDeleted);
  router.get('/category/updated', category.getCategoryUpdated);
  router.get('/category/created', category.getCategoryCreated);
  //Product API
  router.get('/product/getAll', product.getList);
  router.get('/product/getProductByCategory/:id', product.getProductByCategory);
  router.get('/product/getProductDiscount', product.getProductDiscount);
  router.get('/product/getProductByPrice', product.getProductByPrice);
  router.get('/product/detail/:id', product.getProductDetail);
  //Product Web View
  router.get('/updateProduct/:id', product.getUpdate);
  router.post('/product/update', product.update);
  router.post('/product/search', product.search);
  router.get('/product/productDetail/:id', product.productDetail);
  router.get('/product/listProductCreated', product.listProductCreated);
  router.get('/product/listProductDeleted', product.listProductDeleted);
  router.post('/product/addProduct', product.add);
  router.get('/product/insertProduct', product.insertProduct);
  router.get('/product', product.product);
  router.get('/product/remove/:id', product.removeProduct);
  //User API
  router.get('/user/getuser', user.getUser);
  router.get('/user/userDetail/:id', user.userDetail);
  router.post('/user/searchUser', user.searchUser);
  router.get('/user/insertUser', user.getInsertUser);
  router.post('/user/insertUser', user.postInsertUser);
  router.get('/user/remove/:id', user.blockUser);
  router.get('/user/active/:id', user.activeUser);
  router.post('/user/checkUser', user.checkUser);
  router.get('/user/getAddress/:id', user.getAddress);
  router.put('/user/updateAddress', user.updateAddress);
  router.post('/user/register', user.register);
  router.post('/user/login', user.login);
  router.put('/user/recoveryPass', user.recoveryPassword);
  router.put('/user/update', user.update);
  router.get('/user/detail/:id', user.detail);
  router.post('/user/send-otp', user.apiSendOTP);
  router.post('/user/verify-otp', user.verifyOTP);
  //User Web View
  router.get('/getAllUser', user.getAllUserTest);
  router.get('/login', user.login);
  router.post('/adminLogin2', user.adminLogin2);
  router.post('/login', user.validateLoginAdmin, user.loginAdmin);
  router.get('/user', user.getAll);
  router.get('/getUser', user.getAllUser);
  router.get('/getAllAdmin', user.getAllAdmin);
  router.get('/getSupperAdmin', user.getSupperAdmin);
  router.get('/getUserBlock', user.getUserBlock);
  //Size API
  router.post('/size/add', size.insertSize);
  //Bill API
  router.post('/bill/add', bill.add);
  router.get('/bill/getListBill/:id', bill.getListBill);
  router.get('/bill/getBillDetail/:id', bill.getBillDetail);
  router.put('/bill/cancelOrder', bill.cancelOrder);
  router.put('/bill/feedback', bill.feedback);
  router.put('/bill/returnRequest', bill.returnRequest);
  //Bill Web View
  router.get('/bill', bill.bill);
  router.get('/bill/getBillDetailWeb/:id', bill.getBillDetailWeb);
  router.get('/bill/getAll', bill.getAll);
  router.get('/bill/getWaiting', bill.getWaiting);
  router.get('/bill/getDelivering', bill.getDelivering);
  router.get('/bill/getDelivered', bill.getDelivered);
  router.get('/bill/getRequestCancellation', bill.getRequestCancellation);
  router.get('/bill/getCancelled', bill.getCancelled);
  router.get('/bill/getRefuse', bill.getRefuse);
  router.get('/bill/billConfirm/:id', bill.billConfirm);
  router.get('/bill/billDone/:id', bill.billDone);
  router.get('/bill/billCancel/:id', bill.billCancel);
  router.get('/bill/billCancelDone/:id', bill.billCancelDone);
  router.get('/bill/refuseToCancelBill/:id', bill.refuseToCancelBill);
};
