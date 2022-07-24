const user = require('./controller/user');
const category = require('./controller/category');
const product = require('./controller/product');
const bill = require('./controller/bill');
const view = require('./controller/main');
const middleware = require('../src/utils/middleware/authenToken.middleware');

module.exports = (router) => {
  //Main Router
  router.get('/main', middleware.requireAuth, view.main);
  //category API
  router.get('/category/getAll', category.getAll);
  //category Web View
  router.get('/category/', category.category);
  router.get('/category/remove/:id', category.removeCategory);
  router.get('/insertCategory', category.getAddCategory);
  router.post('/addCategory', category.addCategory);
  router.post('/category/update', category.update);
  router.post('/category/search', category.search);
  router.get('/category/getUpdateCategory/:id', category.getUpdateCategory);
  router.get('/category/deleted', category.getCategoryDeleted);
  router.get('/category/updated', category.getCategoryUpdated);
  router.get('/category/created', category.getCategoryCreated);
  //Product API
  router.get('/product/getAllProductByCategory', product.getAllProductByCategory);
  router.get('/product/getProductByCategory', product.getProductByCategory);
  router.get('/product/getProductDiscount', product.getProductDiscount);
  router.get('/product/detail/:id', product.getProductDetail);
  router.get('/product/getAllProductDiscount', product.getAllProductDiscount);
  //Product Web View
  router.get('/updateProduct/:id', middleware.requireAuth, product.getUpdate);
  router.post('/product/update', middleware.requireAuth, product.update);
  router.post('/product/search', middleware.requireAuth, product.search);
  router.get('/product/productDetail/:id', middleware.requireAuth, product.productDetail);
  router.get('/product/listProductCreated', middleware.requireAuth, product.listProductCreated);
  router.get('/product/listProductDeleted', middleware.requireAuth, product.listProductDeleted);
  router.post('/product/addProduct', middleware.requireAuth, product.add);
  router.get('/product/insertProduct', middleware.requireAuth, product.insertProduct);
  router.get('/product', middleware.requireAuth, product.product);
  router.get('/product/remove/:id', middleware.requireAuth, product.removeProduct);
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
  router.get('/getAllUser', middleware.requireAuth, user.getAllUserTest);
  router.get('/login', user.loginWeb);
  router.post('/login', user.loginAdmin);
  router.get('/user', middleware.requireAuth, user.getAll);
  router.get('/getUser', middleware.requireAuth, user.getAllUser);
  router.get('/getAllAdmin', middleware.requireAuth, user.getAllAdmin);
  router.get('/getSupperAdmin', middleware.requireAuth, user.getSupperAdmin);
  router.get('/getUserBlock', middleware.requireAuth, user.getUserBlock);
  //Bill API
  router.post('/bill/add', bill.add);
  router.get('/bill/getListBill/:id', bill.getListBill);
  router.get('/bill/getBillDetail/:id', bill.getBillDetail);
  router.put('/bill/cancelOrder', bill.cancelOrder);
  router.put('/bill/feedback', bill.feedback);
  router.put('/bill/returnRequest', bill.returnRequest);
  //Bill Web View
  router.get('/bill', middleware.requireAuth, bill.bill);
  router.get('/bill/getBillDetailWeb/:id', middleware.requireAuth, bill.getBillDetailWeb);
  router.get('/bill/getAll', middleware.requireAuth, bill.getAll);
  router.get('/bill/getWaiting', middleware.requireAuth, bill.getWaiting);
  router.get('/bill/getDelivering', middleware.requireAuth, bill.getDelivering);
  router.get('/bill/getDelivered', middleware.requireAuth, bill.getDelivered);
  router.get('/bill/getRequestCancellation', middleware.requireAuth, bill.getRequestCancellation);
  router.get('/bill/getCancelled', middleware.requireAuth, bill.getCancelled);
  router.get('/bill/getRefuse', middleware.requireAuth, bill.getRefuse);
  router.get('/bill/billConfirm/:id', middleware.requireAuth, bill.billConfirm);
  router.get('/bill/billDone/:id', middleware.requireAuth, bill.billDone);
  router.get('/bill/billCancel/:id', middleware.requireAuth, bill.billCancel);
  router.get('/bill/billCancelDone/:id', middleware.requireAuth, bill.billCancelDone);
  router.get('/bill/refuseToCancelBill/:id', middleware.requireAuth, bill.refuseToCancelBill);
};
