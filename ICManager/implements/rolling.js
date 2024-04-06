const db = require('../models');
const {Op}= require('sequelize');

const ITime = require('../utils/time');
const IObject = require('../utils/object');
const res = require('express/lib/response');

var inline_FindHierarchy = (object) => {

    console.log(`FindHierarchy`);

    console.log(object);

}
exports.FindHierarchy = inline_FindHierarchy;

var group_list = [];
var current_viceadmin = {};
var current_agent = {};
var current_shop = {};
var current_user = {};

var iLastClass = 0;

var database_list = [];

var inline_AddDataBase = (object) => {

    for ( var i in database_list)
    {
        if ( database_list[i].strNickname == object.strNickname )
        {
            return;
        }
    }

    database_list.push(object);
}

var inline_CalculateGroupList = async (iTClass) => {

    database_list = [];

    for ( var i in group_list)
    {
        console.log(`CalculateGroupList ${i}`);
        var tSlotR = 0,
            tBaccaratR = 0,
            tUnderOverR = 0,
            tBlackjackR = 0;

        for ( var j in group_list[i])
        {
            const cIndex = group_list[i].length-1-j;

            console.log(`CalculateGroupList Sub : ${cIndex}`);
            // tSlotR += parseFloat(group_list[i][cIndex].fSlot);
            // tBaccaratR += parseFloat(group_list[i][cIndex].fBaccarat);
            // tUnderOverR += parseFloat(group_list[i][cIndex].fUnderOver);
            // tBlackjackR += parseFloat(group_list[i][cIndex].fBlackjack);

            var fSlotTR = 0, 
                fSlotMR = 0,
                fBaccaratTR = 0,
                fBaccaratMR = 0,
                fUnderOverTR = 0,
                fUnderOverMR = 0,
                fBlackjackTR = 0,
                fBlackjackMR = 0;

            if ( iTClass == group_list[i][cIndex].iClass)
            {
                fSlotMR = parseFloat(group_list[i][cIndex].fSlot) - tSlotR;
                fSlotTR = group_list[i][cIndex].fSlot;
                fBaccaratMR = parseFloat(group_list[i][cIndex].fBaccarat) - tBaccaratR;
                fBaccaratTR = group_list[i][cIndex].fBaccarat;
                fUnderOverMR = parseFloat(group_list[i][cIndex].fUnderOver) - tUnderOverR;
                fUnderOverTR = group_list[i][cIndex].fUnderOver;
                fBlackjackMR = parseFloat(group_list[i][cIndex].fBlackjack) - tBlackjackR;
                fBlackjackTR = group_list[i][cIndex].fBlackjack;

                //if ( mr < 0 )
                if ( fSlotMR < 0) {
                    console.log('***************************************************** out of range fSlotMR');
                    console.log(fSlotMR + ' ' + fSlotTR + ' ' + tSlotR)
                    return ;
                }
                if ( fBaccaratMR < 0) {
                    console.log('***************************************************** out of range fBaccaratMR ');
                    return ;
                }
                if ( fUnderOverMR < 0) {
                    console.log('***************************************************** out of range  fUnderOverMR');
                    return ;
                }
                if ( fBlackjackMR < 0) {
                    console.log('***************************************************** out of fBlackjackMR ');
                    return ;
                }
                inline_AddDataBase({strNickname:group_list[i][cIndex].strNickname, 
                    fSlotTR:fSlotTR, fSlotMR:fSlotMR, fBaccaratTR:fBaccaratTR, fBaccaratMR:fBaccaratMR, 
                    fUnderOverTR:fUnderOverTR, fUnderOverMR:fUnderOverMR, fBlackjackTR:fBlackjackTR, fBlackjackMR:fBlackjackMR});
            }
            else
            {
                tSlotR += parseFloat(group_list[i][cIndex].fSlot);
                tBaccaratR += parseFloat(group_list[i][cIndex].fBaccarat);
                tUnderOverR += parseFloat(group_list[i][cIndex].fUnderOver);
                tBlackjackR += parseFloat(group_list[i][cIndex].fBlackjack);

                fSlotMR = group_list[i][cIndex].fSlot;
                fSlotTR = tSlotR;
                fBaccaratMR = group_list[i][cIndex].fBaccarat;
                fBaccaratTR = tBaccaratR;
                fUnderOverMR = group_list[i][cIndex].fUnderOver;
                fUnderOverTR = tUnderOverR;
                fBlackjackMR = group_list[i][cIndex].fBlackjack;
                fBlackjackTR = tBlackjackR;

                inline_AddDataBase({strNickname:group_list[i][cIndex].strNickname, 
                    fSlotTR:fSlotTR, fSlotMR:fSlotMR, fBaccaratTR:fBaccaratTR, fBaccaratMR:fBaccaratMR, 
                    fUnderOverTR:fUnderOverTR, fUnderOverMR:fUnderOverMR, fBlackjackTR:fBlackjackTR, fBlackjackMR:fBlackjackMR});

            }

            console.log(`${group_list[i][cIndex].strNickname}, TR : ${fSlotTR}, MR : ${fSlotMR}`);

        }
    }

    for ( var i in database_list )
    {
        var user = await db.Users.findOne({where:{strNickname:database_list[i].strNickname}});
        if ( user != null )
        {
            await user.update(database_list[i]);
        }
    }
}

var inline_AddGroupList = (iTClass, iClass, object) => {

    if ( iTClass == iClass ) {
        group_list.push([]);
    }
    else if ( iTClass < iClass ) {
        const iClassDiff = iClass-iLastClass;
        if ( iClassDiff == -2 && iClass == 6)
        {
            group_list.push([]);
            group_list[group_list.length-1].push(current_viceadmin);
            group_list[group_list.length-1].push(current_agent);
        }
        else if ( iClassDiff == -1 && iClass == 5)
        {
            group_list.push([]);
            group_list[group_list.length-1].push(current_viceadmin);
        }
        else if ( iClassDiff == 0 && iClass == 5)
        {
            group_list.push([]);
            group_list[group_list.length-1].push(current_viceadmin);
        }
    }
    group_list[group_list.length-1].push(object);
    iLastClass = iClass;
}


var inline_AddAgent = (iTClass, object) => {
    
    console.log('inline_AddAgent');
    //console.log(object);

    switch (parseInt(object.iClass))
    {
        case 4:
            current_viceadmin = {};
            current_viceadmin.strNickname = object.strNickname;
            current_viceadmin.iClass = parseInt(object.iClass);
            current_viceadmin.fSlot = object.fSlot;
            current_viceadmin.fBaccarat = object.fBaccarat;
            current_viceadmin.fUnderOver = object.fUnderOver;
            current_viceadmin.fBlackjack = object.fBlackjack;

            inline_AddGroupList(iTClass, current_viceadmin.iClass, current_viceadmin);

            break;
        case 5:
            current_agent = {};
            current_agent.strNickname = object.strNickname;
            current_agent.iClass = parseInt(object.iClass);
            current_agent.fSlot = object.fSlot;
            current_agent.fBaccarat = object.fBaccarat;
            current_agent.fUnderOver = object.fUnderOver;
            current_agent.fBlackjack = object.fBlackjack;

            inline_AddGroupList(iTClass, current_agent.iClass, current_agent);
            
            break;
        case 6:
            current_shop = {};
            current_shop.strNickname = object.strNickname;
            current_shop.iClass = parseInt(object.iClass);
            current_shop.fSlot = object.fSlot;
            current_shop.fBaccarat = object.fBaccarat;
            current_shop.fUnderOver = object.fUnderOver;
            current_shop.fBlackjack = object.fBlackjack;

            inline_AddGroupList(iTClass, current_shop.iClass, current_shop);

            break;
    }
}

let GetAgentFromParameter = (array, strNickname) => {
    
    for ( let i in array )
    {
        if ( array[i].strNickname == strNickname )
        {
            return {strNickname:array[i].strNickname,
            iClass:array[i].iClass,
            fSlotR:array[i].fSlot,
            fBaccaratR:array[i].fBaccarat,
            fUnderOverR:array[i].fUnderOver,
            fPBR:array[i].fPB,
            fPBSingleR:array[i].fPBSingle,
            fPBDoubleR:array[i].fPBDouble,
            fPBTripleR:array[i].fPBTriple
            };
            //array[i];
        }
    }
    return null;
}

var inline_ModifyRollingGroup = async (array)=> {

    console.log(array);

    let ret = {result:"OK"};
    let list = [];

    for ( var i = 0; i < array.length/9; ++i)
    {
        const cDefault = parseInt(i*9);

        var object = {};
        object.strNickname = array[cDefault+0];
        object.iClass = array[cDefault+1];
        object.fSlot = array[cDefault+2];
        object.fBaccarat = array[cDefault+3];
        object.fUnderOver = array[cDefault+4];
        object.fPB = array[cDefault+5];
        object.fPBSingle = array[cDefault+6];
        object.fPBDouble = array[cDefault+7];
        object.fPBTriple = array[cDefault+8];

        list.push(object);
    }

    ret.data = list;

    for ( let i in list )
    {
        console.log(list[i]);

        const [result] = await db.sequelize.query(
            `
            SELECT  t1.fBaccaratR AS fParentBaccaratR,
                    t1.fSlotR as fParentSlotR,
                    t1.fUnderOverR as fParentUnderOverR,
                    t1.fPBR as fParentPBR,
                    t1.fPBSingleR as fParentPBSingleR,
                    t1.fPBDoubleR as fParentPBDoubleR,
                    t1.fPBTripleR as fParentPBTripleR,
                    t1.strNickname as strParentNickname
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            WHERE t2.strNickname='${list[i].strNickname}';
            `
        );

        let parent = GetAgentFromParameter(list, result[0].strParentNickname);

        console.log(`parent`);
        console.log(parent);
        if ( parent == null )
            parent = result[0];

        if ( list[i].fBaccarat > parent.fParentBaccaratR ) {
            ret.result = 'FAIL';
            ret.name = `[${list[i].strNickname}] 바카라 롤링값은 상위보다 높을 수 없습니다`;
        } else if ( list[i].fSlot > parent.fParentSlotR ) {
            ret.result = 'FAIL';
            ret.name = `[${list[i].strNickname}] 슬롯 롤링값은 상위보다 높을 수 없습니다`;
        } else if ( list[i].fUnderOver > parent.fParentUnderOverR ) {
            ret.result = 'FAIL';
            ret.name = `[${list[i].strNickname}] 언더오버 롤링값은 상위보다 높을 수 없습니다`;
        }

        if (ret.result == 'FAIL')
            return ret;
    
        const me = await db.Users.findOne({where:{strNickname:list[i].strNickname}});
        if ( me != null )
        {
            console.log('me is ok');
            const children = await db.Users.findAll({
                where:{
                    iParentID:me.id,
                    iPermission: {
                        [Op.notIn]: [100]
                    },
                }
            });

            console.log(`${children.length}`);
    
            for ( let j in children )
            {
                let child = GetAgentFromParameter(list, children[j].strNickname);
                console.log(`GetAgentFromParameter : `);
                console.log(child);
                if ( child == null )
                    child= children[j];

                console.log(child);
                console.log(child.fBaccaratR)

                console.log(`me ${list[i].fBaccarat}, children ${child.fBaccaratR}, me ${list[i].fSlot}, children ${child.fSlotR}, me ${list[i].fUnderOver}, children ${child.fUnderOverR}`);

                if ( list[i].fBaccarat < child.fBaccaratR ) {
                    ret.result = "FAIL";
                    ret.name = `[${list[i].strNickname}] 바카라 롤링값은 하위(${child.strNickname})보다 낮을 수 없습니다.`;
                } else if ( list[i].fSlot < child.fSlotR ) {
                    ret.result = "FAIL";
                    ret.name = `[${list[i].strNickname}] 슬롯 롤링값은 하위(${child.strNickname})보다 낮을 수 없습니다.`;
                } else if ( list[i].fUnderOver < child.fUnderOverR ) {
                    ret.result = "FAIL";
                    ret.name = `[${list[i].strNickname}] 언더오버 롤링값은 하위(${child.strNickname})보다 낮을 수 없습니다.`;
                }
                if (ret.result == 'FAIL')
                    return ret;
            }
        }
    }

    return ret;
}


exports.ModifyRollingGroup = inline_ModifyRollingGroup;

