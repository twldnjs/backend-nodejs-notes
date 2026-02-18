# SQL 기초

## 목차

1. [SQL이란?](#sql이란)
2. [SQL 종류](#sql-종류)
3. [기본 문법](#기본-문법)
4. [GROUP BY (그룹화)](#group-by-그룹화)
5. [HAVING](#having)
6. [ORDER BY (정렬)](#order-by-정렬)
7. [LIMIT (개수 제한)](#limit-개수-제한)
8. [JOIN (테이블 연결)](#join-테이블-연결)
9. [제약 조건 (Constraints)](#제약-조건-constraints)
10. [PK & FK 정리](#pk--fk-정리)

## SQL이란?

- Structured Query Language
- 데이터베이스와 소통하는 언어

## SQL 종류

### DDL (Data Definition Language) - 구조 정의

- CREATE: 테이블/DB 생성
- ALTER: 테이블 구조 수정
- DROP: 테이블/DB 삭제

### DML (Data Manipulation Language) - 데이터 조작

- SELECT: 조회
  • WHERE: 조건
  • JOIN: 테이블 연결
  • GROUP BY: 그룹화
  • ORDER BY: 정렬
- INSERT: 삽입
- UPDATE: 수정
- DELETE: 삭제

### DCL (Data Control Language) - 권한 제어

- GRANT: 권한 부여
- REVOKE: 권한 회수

### TCL (Transaction Control Language) - 트랜잭션

- COMMIT: 확정
- ROLLBACK: 취소

## 기본 문법

### SELECT 문

```sql
SELECT 컬럼명 FROM 테이블명 WHERE 조건;
```

**예시:**

```sql
SELECT name, email FROM users WHERE age > 20;
```

```sql
SELECT 컬럼
FROM 테이블1
JOIN 테이블2 ON 연결조건;
```

### INSERT 문

```sql
INSERT INTO 테이블명 (컬럼1, 컬럼2) VALUES (값1, 값2);
```

**예시:**

```sql
INSERT INTO users (name, email, age)
VALUES ('김철수', 'kim@example.com', 25);
```

### WHERE 조건

- = : 같음
- != 또는 <> : 다름
- > : 크다
- < : 작다
- > = : 크거나 같다
- <= : 작거나 같다
- LIKE : 패턴 매칭
- IN : 목록에 포함
- BETWEEN : 범위

### 연산자

- AND: 그리고
- OR: 또는
- NOT: 아님

### 함수

- COUNT(): 개수
- SUM(): 합계
- AVG(): 평균
- MAX(): 최대값
- MIN(): 최소값

### GROUP BY (그룹화)

- 특정 컬럼 기준으로 묶어서 집계

```sql
SELECT user_id, COUNT(\*)
FROM posts
GROUP BY user_id;
```

### HAVING

- GROUP BY 결과에 조건 걸기

```sql
SELECT user_id, COUNT(*)
FROM posts
GROUP BY user_id
HAVING COUNT(*) >= 2;
```

### ORDER BY (정렬)

```sql
SELECT *
FROM users
ORDER BY age DESC;
```

    •	ASC (오름차순, 기본값)
    •	DESC (내림차순)

### LIMIT (개수 제한)

```sql
SELECT *
FROM users
LIMIT 5;
```

### JOIN (테이블 연결)

- 여러 테이블을 공통 컬럼(PK/FK) 기준으로 합쳐 조회
- 데이터가 저장되거나 변경되지는 않음 (조회 전용)

- JOIN 종류
  • INNER JOIN: 양쪽 모두 존재하는 데이터만
  • LEFT JOIN: 왼쪽 테이블은 모두 조회
  • RIGHT JOIN: 오른쪽 테이블은 모두 조회
  • FULL JOIN: 양쪽 모두 조회 (MySQL은 직접 지원 안 함)

```sql
SELECT 컬럼
FROM 테이블1
JOIN 테이블2 ON 연결조건;
```

**예시:**

```sql
SELECT p.title, u.name
FROM posts p
JOIN users u
ON p.user_id = u.user_id;
```

### 제약 조건 (Constraints)

    •	PRIMARY KEY: 기본키 (중복 X, NULL X)
    •	FOREIGN KEY: 외래키 (다른 테이블 참조)
    •	NOT NULL: NULL 허용 안 함
    •	UNIQUE: 중복 허용 안 함
    •	DEFAULT: 기본값 설정
    •	CHECK: 조건 제한 (MySQL은 제한적)

### PK & FK 정리

PK (Primary Key)
• 각 행을 구분하는 고유 값
• 중복 불가
• NULL 불가

FK (Foreign Key)
• 다른 테이블의 PK를 참조
• 참조 무결성 유지
• ON DELETE / ON UPDATE 옵션 설정 가능
