const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));

const db = require('../db');

const IHelper = require('../helpers/IHelper');


const {isLoggedIn, isNotLoggedIn} = require('./middleware');


router.get('/', async (req, res) => {
    let bLogin = false;
    if ( req.user != null )
    {
        bLogin = true;
    }
    const objectOutput = await IHelper.GetOutputRecords();

    let strGameName = 'Game';
    switch (req.query.id)
    {
    case '00':
        strGameName = '바카라 언오버'
        break;
    case '01':
        strGameName = '바카라'
        break;
    case '02':
        strGameName = '블랙잭'
        break;
    case '03':
        strGameName = '룰렛'
        break;
    case '04':
        strGameName = '식보'
        break;
    case '05':
        strGameName = '드래곤 타이거'
        break;
    case '07':
        strGameName = '바카라보험'
        break;
    case '08':
        strGameName = '트리플페이스카드'
        break;
    case '09':
        strGameName = 'BULLFIGHT'
        break;
    case '10':
        strGameName = '캐러비안스터드포커'
        break;
    case '11':
        strGameName = '마종'
        break;
    }

    res.render('desc_game01', {iLayout:0, bLogin:bLogin, user:req.user, messages:null, strFilename:`/img/${req.query.id}.jpg`, listOutputRecent:objectOutput.listOutputRecent, listOutputRank:objectOutput.listOutputRank, strGameName:strGameName});
});

module.exports = router;