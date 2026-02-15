const express = require('express');
const router = express.Router();

router.use(express.json());

// 주문하기
router.post('/', (req, res) => {
  res.json('주문 성공');
});

// 주문 목록 조회
router.get('/', (req, res) => {
  res.json('주문 목록 조회');
});

// 장바구니 도서 삭제
router.get('/:id', (req, res) => {
  res.json('주문 상세 상품 조회');
});

// // 장바구니에서 선택한 주문 예상 상품 목록 조회
// router.get('/carts', (req, res) => {
//   res.json('장바구니 조회');
// });

module.exports = router;
