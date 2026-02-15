const express = require('express');
const router = express.Router();

router.use(express.json());

// 전체 도서 조회
router.get('/', (req, res) => {
  res.json('회원 가입');
});

// 개별 도서 조회
router.get('/:id', (req, res) => {
  res.json('회원 가입');
});

// 카테고리별 도서 목록 조회
router.get('/', (req, res) => {
  req.query.categoryID;
  res.json('회원 가입');
});

module.exports = router;
