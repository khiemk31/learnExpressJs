const getTotalPage = (total, limit) => {
  return Math.ceil(total / limit);
};
module.exports = {getTotalPage};
