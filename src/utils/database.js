const getConnection = (request) => {
  return new Promise((resolve, reject) => {
    request.getConnection((error, connection) => {
      if (error) {
        reject(`Database failed ${error}`);
      } else {
        resolve(connection);
      }
    });
  });
};

const query = (connection, sql, bindings) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, bindings, (error, result) => {
      if (error) {
        reject(`Database failed ${error}`);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {getConnection, query};
