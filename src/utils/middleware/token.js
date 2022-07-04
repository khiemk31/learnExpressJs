

import { decodeToken, query, getConnection } from '.';
import { isEmpty } from '../validate';

const checkToken = async (req, res, next) => {
  let token = null;
  try {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.split(' ')[1];
    } else {
      return res.status(401).json({ message: 'No access token' });
    }
    try {
      const data = await decodeToken(token);
      const userQuery = 'select * from user where deleted_at is null and user_id = ?';
      const connection = await getConnection(req);
      const user = await query(connection, userQuery, [data.user_id]);
      if (isEmpty(user)) {
        return res.status(404).json({ message: 'User not found' });
      } else {
        req.user_id = await data.user_id;
        req.role = await data.role;
        next();
      }
    } catch (error) {
      return res.status(500).json({ message: `${error}` });
    }
  } catch (error) {
    return res.status(401).json({ message: `Token invalid ${error}` });
  }
};

export default checkToken;