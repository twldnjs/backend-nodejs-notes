# SQL 쿼리 예제 모음

## 목차

1. [기본 CRUD](#기본-crud)
2. [조건 검색](#조건-검색)
3. [정렬과 제한](#정렬과-제한)
4. [집계 함수](#집계-함수)
5. [JOIN](#join)
6. [서브쿼리](#서브쿼리)
7. [날짜 처리](#날짜-처리)
8. [문자열 처리](#문자열-처리)

---

## 기본 CRUD

### 전체 조회

```sql
SELECT * FROM users;
```

### 특정 컬럼만 조회

```sql
SELECT name, email FROM users;
```

### 조건부 조회

```sql
SELECT * FROM users WHERE age >= 20;
```

### 데이터 삽입

```sql
INSERT INTO users (name, email, age)
VALUES ('김철수', 'kim@example.com', 25);
```

### 여러 행 삽입

```sql
INSERT INTO users (name, email, age) VALUES
('김철수', 'kim@example.com', 25),
('이영희', 'lee@example.com', 28),
('박민수', 'park@example.com', 30);
```

### 데이터 수정

```sql
UPDATE users
SET age = 26
WHERE user_id = 1;
```

### 여러 컬럼 수정

```sql
UPDATE users
SET age = 26, email = 'newemail@example.com'
WHERE user_id = 1;
```

### 데이터 삭제

```sql
DELETE FROM users WHERE user_id = 1;
```

---

## 조건 검색

### 범위 검색

```sql
-- 20살 이상 30살 이하
SELECT * FROM users WHERE age BETWEEN 20 AND 30;
```

### 목록 검색

```sql
-- 서울, 부산, 대구 거주자
SELECT * FROM users WHERE city IN ('서울', '부산', '대구');
```

### 패턴 검색 (LIKE)

```sql
-- 이름이 '김'으로 시작
SELECT * FROM users WHERE name LIKE '김%';

-- 이메일에 'gmail' 포함
SELECT * FROM users WHERE email LIKE '%gmail%';

-- 이름이 3글자
SELECT * FROM users WHERE name LIKE '___';
```

### NULL 체크

```sql
-- 이메일이 없는 사용자
SELECT * FROM users WHERE email IS NULL;

-- 이메일이 있는 사용자
SELECT * FROM users WHERE email IS NOT NULL;
```

### 복합 조건

```sql
-- 20대이면서 서울 거주
SELECT * FROM users
WHERE age BETWEEN 20 AND 29 AND city = '서울';

-- 20세 미만이거나 60세 이상
SELECT * FROM users
WHERE age < 20 OR age >= 60;
```

---

## 정렬과 제한

### 오름차순 정렬

```sql
SELECT * FROM users ORDER BY age ASC;
-- ASC는 생략 가능
SELECT * FROM users ORDER BY age;
```

### 내림차순 정렬

```sql
SELECT * FROM users ORDER BY age DESC;
```

### 다중 정렬

```sql
-- 나이 내림차순, 같으면 이름 오름차순
SELECT * FROM users
ORDER BY age DESC, name ASC;
```

### 상위 N개만 조회

```sql
-- 나이가 많은 상위 5명
SELECT * FROM users
ORDER BY age DESC
LIMIT 5;
```

### 페이징 (OFFSET)

```sql
-- 11번째부터 10개 (2페이지)
SELECT * FROM users
ORDER BY user_id
LIMIT 10 OFFSET 10;
```

---

## 집계 함수

### 전체 개수

```sql
SELECT COUNT(*) FROM users;
```

### 조건부 개수

```sql
SELECT COUNT(*) FROM users WHERE age >= 20;
```

### NULL 제외 개수

```sql
SELECT COUNT(email) FROM users;  -- email이 NULL인 행은 제외
```

### 중복 제거 개수

```sql
SELECT COUNT(DISTINCT city) FROM users;  -- 도시 종류 개수
```

### 합계

```sql
SELECT SUM(price) FROM orders;
```

### 평균

```sql
SELECT AVG(age) FROM users;
```

### 최대값/최소값

```sql
SELECT MAX(age), MIN(age) FROM users;
```

### 그룹별 집계

```sql
-- 도시별 사용자 수
SELECT city, COUNT(*) as user_count
FROM users
GROUP BY city;

-- 도시별 평균 나이
SELECT city, AVG(age) as avg_age
FROM users
GROUP BY city;
```

### HAVING (그룹 조건)

```sql
-- 사용자가 10명 이상인 도시만
SELECT city, COUNT(*) as user_count
FROM users
GROUP BY city
HAVING COUNT(*) >= 10;
```

---

## JOIN

### INNER JOIN (교집합)

```sql
-- 게시글과 작성자 정보
SELECT
    p.title,
    p.content,
    u.name AS author,
    u.email
FROM posts p
INNER JOIN users u ON p.user_id = u.user_id;
```

### LEFT JOIN (왼쪽 테이블 기준)

```sql
-- 모든 사용자와 그들의 게시글 (게시글 없어도 사용자는 표시)
SELECT
    u.name,
    u.email,
    p.title
FROM users u
LEFT JOIN posts p ON u.user_id = p.user_id;
```

### 게시글이 없는 사용자 찾기

```sql
SELECT
    u.name,
    u.email
FROM users u
LEFT JOIN posts p ON u.user_id = p.user_id
WHERE p.post_id IS NULL;
```

### 여러 테이블 JOIN

```sql
-- 게시글, 작성자, 카테고리
SELECT
    p.title,
    u.name AS author,
    c.category_name
FROM posts p
JOIN users u ON p.user_id = u.user_id
JOIN categories c ON p.category_id = c.category_id;
```

---

## 서브쿼리

### WHERE 절의 서브쿼리

```sql
-- 평균 나이보다 많은 사용자
SELECT * FROM users
WHERE age > (SELECT AVG(age) FROM users);
```

### IN과 서브쿼리

```sql
-- 게시글이 있는 사용자만
SELECT * FROM users
WHERE user_id IN (SELECT DISTINCT user_id FROM posts);
```

### EXISTS

```sql
-- 게시글이 있는 사용자
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM posts p
    WHERE p.user_id = u.user_id
);
```

### FROM 절의 서브쿼리

```sql
-- 도시별 평균 나이가 30 이상인 도시
SELECT city, avg_age
FROM (
    SELECT city, AVG(age) as avg_age
    FROM users
    GROUP BY city
) AS city_stats
WHERE avg_age >= 30;
```

---

## 날짜 처리

### 현재 날짜/시간

```sql
SELECT NOW();                    -- 현재 날짜시간
SELECT CURDATE();                -- 현재 날짜
SELECT CURTIME();                -- 현재 시간
```

### 날짜 조건 검색

```sql
-- 오늘 가입한 사용자
SELECT * FROM users
WHERE DATE(created_at) = CURDATE();

-- 최근 7일 이내 가입
SELECT * FROM users
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- 2024년 가입자
SELECT * FROM users
WHERE YEAR(created_at) = 2024;

-- 2월 가입자
SELECT * FROM users
WHERE MONTH(created_at) = 2;
```

### 날짜 차이

```sql
-- 가입한 지 며칠 되었는지
SELECT
    name,
    DATEDIFF(NOW(), created_at) AS days_since_joined
FROM users;
```

### 날짜 포맷

```sql
SELECT
    name,
    DATE_FORMAT(created_at, '%Y-%m-%d') AS join_date
FROM users;
```

---

## 문자열 처리

### 문자열 합치기

```sql
SELECT CONCAT(name, ' (', email, ')') AS user_info
FROM users;
```

### 대소문자 변환

```sql
SELECT
    UPPER(name) AS uppercase_name,
    LOWER(email) AS lowercase_email
FROM users;
```

### 문자열 자르기

```sql
-- 앞 3글자
SELECT SUBSTRING(name, 1, 3) FROM users;

-- 뒤 4글자
SELECT RIGHT(email, 4) FROM users;
```

### 공백 제거

```sql
SELECT TRIM(name) FROM users;           -- 양쪽 공백
SELECT LTRIM(name) FROM users;          -- 왼쪽 공백
SELECT RTRIM(name) FROM users;          -- 오른쪽 공백
```

### 문자열 길이

```sql
SELECT name, LENGTH(name) AS name_length
FROM users;
```

### 문자열 치환

```sql
SELECT REPLACE(email, 'gmail.com', 'naver.com')
FROM users;
```

---

## 실전 활용 예제

### 사용자 통계

```sql
-- 가입일별 사용자 수
SELECT
    DATE(created_at) AS join_date,
    COUNT(*) AS new_users
FROM users
GROUP BY DATE(created_at)
ORDER BY join_date DESC;
```

### 인기 게시글 TOP 10

```sql
SELECT
    p.title,
    u.name AS author,
    p.views,
    p.likes
FROM posts p
JOIN users u ON p.user_id = u.user_id
ORDER BY p.views DESC, p.likes DESC
LIMIT 10;
```

### 활동적인 사용자 (게시글 5개 이상)

```sql
SELECT
    u.name,
    u.email,
    COUNT(p.post_id) AS post_count
FROM users u
LEFT JOIN posts p ON u.user_id = p.user_id
GROUP BY u.user_id, u.name, u.email
HAVING COUNT(p.post_id) >= 5
ORDER BY post_count DESC;
```

### 최근 30일 가입자 중 게시글 없는 사람

```sql
SELECT
    u.name,
    u.email,
    u.created_at
FROM users u
LEFT JOIN posts p ON u.user_id = p.user_id
WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  AND p.post_id IS NULL;
```

---

## 데이터베이스 관리

### 테이블 생성

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 테이블 구조 확인

```sql
DESCRIBE users;
SHOW CREATE TABLE users;
```

### 컬럼 추가

```sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

### 컬럼 수정

```sql
ALTER TABLE users MODIFY COLUMN name VARCHAR(100);
```

### 컬럼 삭제

```sql
ALTER TABLE users DROP COLUMN phone;
```

### 인덱스 생성

```sql
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_name_age ON users(name, age);
```

### 트랜잭션

```sql
START TRANSACTION;

UPDATE accounts SET balance = balance - 10000 WHERE user_id = 1;
UPDATE accounts SET balance = balance + 10000 WHERE user_id = 2;

COMMIT;  -- 또는 ROLLBACK;
```
