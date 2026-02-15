import express from 'express';
import conn from '../mariadb.js';
import { body, param, validationResult } from 'express-validator';
const router = express.Router();

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next(); // 에러가 없다면 다음 할 일(미들웨어 또는 함수) 을 실행할 수 있게 해줌
  } else {
    return res.status(400).json({ errors: err.array() });
  }
};

router
  .route('/')
  .get(
    // 채널 전체 조회
    [body('userId').notEmpty().isInt().withMessage('숫자 입력 필요'), validate],
    async (req, res) => {
      const { userId } = req.body;

      try {
        const sql = `SELECT * FROM channels WHERE user_id = ?`;
        const [results] = await conn.query(sql, userId);

        if (results.length > 0) {
          return res.status(200).json(results);
        } else {
          return notFoundChannel(res);
        }
      } catch (err) {
        return res.status(500).json({ message: '서버 에러' });
      }
    },
  )
  .post(
    [
      body('userId').notEmpty().isInt().withMessage('숫자 입력 필요'),
      body('name').notEmpty().isString().withMessage('문자 입력 필요'),
      validate,
    ],
    async (req, res) => {
      // 채널 개별 생성 = db 에 저장
      const { name, userId } = req.body;

      try {
        // 1. 유저 존재 여부 확인
        const [user] = await conn.query('SELECT id FROM users WHERE id = ?', [
          userId,
        ]);
        if (user.length === 0) {
          return res
            .status(404)
            .json({ message: '존재하지 않는 userId 입니다.' });
        }

        // 2. 채널 생성
        const sql = 'INSERT INTO channels (name, user_id) VALUES (?, ?)';

        const [results] = await conn.query(sql, [name, userId]);
        if (results.affectedRows > 0) {
          return res.status(201).json({ id: results.insertId, name, userId });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).end();
      }
    },
  );

router
  .route('/:id')
  .get(
    [param('id').notEmpty().withMessage('채널 id 필요'), validate],
    async (req, res) => {
      // 채널 개별 조회

      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(400).json({ errors: err.array() });
      }

      let { id } = req.params;
      id = parseInt(id);

      try {
        const sql = `SELECT * FROM channels WHERE id = ?`;
        const [results] = await conn.query(sql, id);
        if (results.length) res.status(200).json(results);
        else {
          notFoundChannel(res);
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: '서버 에러' });
      }
    },
  )
  .put(
    [
      param('id').notEmpty().withMessage('채널 id 필요'),
      body('name').notEmpty().isString().withMessage('채널명 오류'),
      validate,
    ],
    async (req, res) => {
      // 채널 개별 수정
      let { id } = req.params;
      id = parseInt(id);

      let { name } = req.body;

      try {
        const sql = `UPDATE channels SET name = ? WHERE id = ?`;
        const values = [name, id];
        const [results] = await conn.query(sql, values);
        if (results.affectedRows === 0) {
          return res.status(400).end();
        } else {
          res.status(200).json(results);
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: '서버 에러' });
      }
    },
  )
  .delete(
    [param('id').notEmpty().withMessage('채널 id 필요'), validate],
    async (req, res) => {
      // 채널 개별 삭제
      let { id } = req.params;
      id = parseInt(id);

      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(400).json({ errors: err.array() });
      }

      try {
        const sql = `DELETE FROM channels WHERE id = ?`;
        const [results] = await conn.query(sql, id);

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

function notFoundChannel(res) {
  res.status(404).json({
    message: '채널 정보를 찾을 수 없습니다.',
  });
}

export default router;
