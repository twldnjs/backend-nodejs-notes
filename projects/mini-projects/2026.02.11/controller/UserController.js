const conn = require('../mariadb'); // db 모듈
const { StatusCodes } = require('http-status-codes'); // status code 모듈
const jwt = require('jsonwebtoken'); // jwt 모듈
const crypto = require('crypto'); // crypto 모듈 : 암호화
const dotenv = require('dotenv'); // dotenv 모듈
dotenv.config();

const join = (req, res) => {
  const { email, password } = req.body;

  // 회원가입 시 비밀번호를 암호화된 비밀번호와, salt 값을 같이 DB에 저장
  const salt = crypto.randomBytes(16).toString('base64'); // 계속 값이 변함 -> 디비에 저장
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('base64');

  // 로그인 시, 이메일&비밀번호 (날 것) => salt 값 꺼내서 비밀번호 암호화 해보고 => 디비 비밀번호랑 비교

  const sql = 'INSERT INTO users (email, password, salt) VALUES (?, ?, ?)';

  const values = [email, hashPassword, salt];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.CREATED).json(results);
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  conn.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const loginUser = results[0];

    if (!loginUser) {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }

    if (!loginUser.salt) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
    // salt 값 꺼내서 비밀번호 암호화 해보고
    const hashPassword = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 64, 'sha512')
      .toString('base64');

    //=> 디비 비밀번호랑 비교
    if (loginUser && loginUser.password === hashPassword) {
      const token = jwt.sign(
        {
          email: loginUser.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: '5m',
          issuer: 'jiwon',
        },
      );
      // 토큰 쿠키에 담기
      res.cookie('token', token, {
        httpOnly: true,
      });
      console.log('token:', token);

      return res.status(StatusCodes.OK).json(results);
    } else {
      res.status(StatusCodes.UNAUTHORIZED).end(); // 401: Unauthorized
    }
  });
};

const passwordResetRequest = (req, res) => {
  const { email } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  conn.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    // 이메일로 유저가 있는지 찾아봅니다.
    const user = results[0];
    if (user) {
      return res.status(StatusCodes.OK).json({
        email: email, // 비밀번호 초기화에서 쓸 수 있게 값을 보내줌
      });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const passwordReset = (req, res) => {
  const { email, password } = req.body;
  const sql = 'UPDATE users SET password = ?, salt = ? WHERE email = ?'; // password 값을 바꿈 ,email 값이 맞는 유저의

  const salt = crypto.randomBytes(16).toString('base64');
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('base64');
  const values = [hashPassword, salt, email];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.affectedRows === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '해당 이메일 유저 없음',
        results,
      });
    } else {
      return res.status(StatusCodes.OK).json({
        message: '비밀번호 변경 완료',
        results,
      });
    }
  });
};

module.exports = { join, login, passwordResetRequest, passwordReset };
