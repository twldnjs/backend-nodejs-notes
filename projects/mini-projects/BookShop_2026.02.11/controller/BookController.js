const conn = require('../mariadb'); // db 모듈
const { StatusCodes } = require('http-status-codes'); // status code 모듈

// 요약된 전체 도서 조회
const allBooks = (req, res) => {
  const { category_id } = req.query;

  if (category_id) {
    let sql = 'SELECT * FROM books WHERE category_id = ?';
    conn.query(sql, category_id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      if (results.length) return res.status(StatusCodes.OK).json(results);
      else return res.status(StatusCodes.NOT_FOUND).end();
    });
  } else {
    let sql = 'SELECT * FROM books';
    conn.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.OK).json(results);
    });
  }
};

// 개별 도서 조회
const bookDetail = (req, res) => {
  const book_id = req.params.id;
  let { user_id } = req.body;

  let sql =
    'SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes, (SELECT EXISTS(SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked FROM books LEFT JOIN category ON books.category_id = category.category.id WHERE books.id = ?';

  const values = [user_id, book_id, book_id];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results[0]) return res.status(StatusCodes.OK).json(results[0]);
    else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

module.exports = {
  allBooks,
  bookDetail,
};

// let offset = limit * (currentPage-1)
// let sql = SELECT *, (SELECT * FROM likes WHERE books.id=liked_book_id) AS likes FROM books;
