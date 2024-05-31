- 2022-02-09
-- sequelize-cli, express-mysql-session, crypto 추가
```
npm install --save sequelize-cli express-mysql-session crypto dotenv
```
-- npx sequelize init
-- NODE_ENV 설정
```
SET NODE_ENV="production"
```

- 2022-02-11
-- logginedAt
-- sequelize-cli
```
npx sequelize seed:generate --name users
npx sequelize db:seed:all
```

- 2022-02-14
-- user, inout, betting_record 수정
-- nodemon 추가
```
npm run dev
```


```
[실행하기]
// 개발
npm run dev
// 운영
npm start
// 로컬
npm run local
```


```
[죽장 용어]
- 배팅 : 실제 게임시에 배팅한 금액
- 승리 : 배팅후 실제 승리한 금액
- 윈로스 : 승리에서 배팅 금액을 뺀 금액(승리 - 배팅)
- 수수료 : 배팅금액의 일정 비율의 수수료 발생(배팅금액 * 0.01)
- 롤링 : 배팅금액 * 롤링비율(지정) // 추가 수수료
- 합 : 윈로스 - 수수료를 제외한 금액(순이익이 됨)
    
[죽장 정산]
[부본]
- 합계 : B윈로스 + U윈로스 + S윈로스 + P윈로스 - 알값(배팅금액 * 0.085)
- 부본 죽장 : (B윈로스 * 죽장 비율) + (UO윈로스 * 죽장 비율) + (Slot윈로스 * 죽장 비율) + (PB윈로스 * 죽장 비율) / (부분죽장은 매출이 마이너스일 경우 미발생
- 최종 합계 : 합계 - 부본 죽장
[대본]  
- 합계 : B윈로스 + U윈로스 + S윈로스 + P윈로스 - 알값(배팅금액 * 0.085)
- 부본 죽장 : 부본의 죽장값
- 대본 알값 : ((B윈로스 + U윈로스) * 0.085) + (S윈로스 * 0.085) + (P윈로스 * 0.085) , 배팅시마다 발생되는 금액
- 대본 죽장 : (합계 - 부본죽장 - 알값) * 죽장 비율 / (대본죽장은 마이너스라도 발생)
- 최종 합계 : 합계 - 부본 죽장 - 대본 알값 - 대본 죽장
```