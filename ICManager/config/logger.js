const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const process = require('process');

const { combine, timestamp, label, printf } = winston.format;

//* 로그 파일 저장 경로 → 루트 경로/logs 폴더
const logDir = `${process.cwd()}/logs`;

// 로그 출력 포맷
const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`; // 날짜 [시스템이름] 로그레벨 메세지
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
    //* 로그 출력 형식 정의
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        label({ label: 'ICManager' }), // 어플리케이션 이름
        logFormat, // log 출력 포맷
    ),

    //* 실제 로그를 어떻게 기록을 한 것인가 정의
    transports: [
        //* info 레벨 로그를 저장할 파일 설정 (info: 2 보다 높은 error: 0 와 warn: 1 로그들도 자동 포함해서 저장)
        new winstonDaily({
            level: 'info', // info 레벨에선
            datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
            dirname: logDir, // 파일 경로
            filename: `%DATE%.log`, // 파일 이름
            maxFiles: 30, // 최근 30일치 로그 파일을 남김
            zippedArchive: true, // 아카이브된 로그 파일을 gzip으로 압축할지 여부
        }),
        //* error 레벨 로그를 저장할 파일 설정 (info에 자동 포함되지만 일부러 따로 빼서 설정)
        new winstonDaily({
            level: 'error', // error 레벨에선
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error', // /logs/error 하위에 저장
            filename: `%DATE%.error.log`, // 에러 로그는 2020-05-28.error.log 형식으로 저장
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
    //* uncaughtException 발생시 파일 설정
    exceptionHandlers: [
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.exception.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
});

//* Production 환경이 아닌, 개발 환경일 경우 파일 들어가서 일일히 로그 확인하기 번거로우니까 화면에서 바로 찍게 설정 (로그 파일은 여전히 생성됨)
if (process.env.NODE_ENV !== 'production' || process.env.WINSTON_LOGGER_LEVEL === 5) {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
                // winston.format.printf(context => {
                //     // const msgstr = JSON.stringify(context.message, null, '\t')
                //     return `[${context.level}]${context.message}`
                // }),
            ),
        }),
    );
}

module.exports = logger;

