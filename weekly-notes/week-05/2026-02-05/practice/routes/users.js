import express from 'express';
const router = express.Router();
import { body, param, validationResult } from 'express-validator';
import conn from '../mariadb.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// const dotenv =  require('dotenv');

dotenv.config();

router.use(express.json()); // http 외 모듈 'json' (json 을 body 에 꺼내서 쓰기위한 모듈)

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(400).json({ errors: err.array() });
  }
};

// 로그인
router.post(
  '/login',
  [
    body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
    body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
    validate,
  ],
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const sql = 'SELECT * FROM users WHERE email = ?';
      const values = [email];
      const [results] = await conn.query(sql, values);
      const loginUser = results[0];

      if (!loginUser) {
        return res.status(403).json({ message: '회원 정보가 없습니다.' });
      }
      if (loginUser.password !== password) {
        return res.status(400).json({ message: '비밀번호가 틀렸습니다.' });
      }
      const token = jwt.sign(
        // 토큰 발급
        { email: loginUser.email, name: loginUser.name },
        process.env.PRIVATE_KEY,
        {
          expiresIn: '30m', //유효기한 설정
          issuer: 'jiwon',
        },
      );
      res.cookie('token', token, { httpOnly: true });
      console.log(token);

      return res.status(200).json({
        message: `${loginUser.name}님 로그인 되었습니다.`,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: '서버 에러 발생' });
    }
  },
);

// 회원 가입
router.post(
  '/join',
  [
    body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
    body('name').notEmpty().isString().withMessage('이름 확인 필요'),
    body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
    body('contact').notEmpty().isString().withMessage('번호 확인 필요'),
    validate,
  ],
  async (req, res) => {
    const { email, name, password, contact } = req.body;

    try {
      const sql =
        'INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)';
      const values = [email, name, password, contact];
      const [results] = await conn.query(sql, values);
      if (results.affectedRows === 0) {
        return res.status(400).json(err.array());
      } else {
        res.status(200).json(results);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: '서버 에러' });
    }
  },
);

// 회원 개별 조회
router.get(
  '/users',
  [
    body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
    validate,
  ],
  async (req, res) => {
    const { email } = req.body;

    try {
      const sql = 'SELECT * FROM users WHERE email = ?';
      const values = [email];

      const [results] = await conn.query(sql, values);

      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(400).json(err.array());
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: '서버 에러' });
    }
  },
);

// 회원 개별 탈퇴
router.delete(
  '/users',
  [
    body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
    validate,
  ],
  async (req, res) => {
    const { email } = req.body;

    try {
      const sql = 'DELETE FROM users WHERE email = ?';
      const values = [email];

      const [results] = await conn.query(sql, values);

      if (results.affectedRows > 0) {
        return res.status(200).json(results);
      } else {
        return res
          .status(400)
          .json({ message: '삭제 실패 (존재하지 않는 회원)' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: '서버 에러' });
    }
  },
);

export default router;
