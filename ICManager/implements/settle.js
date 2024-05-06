const db = require('../models');

let GetAgentFromParameter = (array, strNickname) => {
    
    for ( let i in array )
    {
        if ( array[i].strNickname == strNickname )
        {
            return array[i];
        }
    }
    return null;
}

var inline_ModifySettleGroup = async (array)=> {

    console.log(array);

    let ret = {result:"OK"};
    let list = [];

    for ( var i = 0; i < array.length/6; ++i)
    {
        const cDefault = parseInt(i*6);

        var object = {};
        object.strNickname = array[cDefault+0];
        object.iClass = array[cDefault+1];
        object.fSettleBaccarat = array[cDefault+2];
        object.fSettleSlot = array[cDefault+3];
        object.fSettlePBA = array[cDefault+4];
        object.fSettlePBB = array[cDefault+5];
        // object.fBaccarat = array[cDefault+3];
        // object.fUnderOver = array[cDefault+4];

        list.push(object);
    }

    ret.data = list;

    console.log(list);

    for ( let i in list )
    {
        console.log(list[i]);

        // const [result] = await db.sequelize.query(
        //     `
        //     SELECT  t1.fBaccaratR AS fParentBaccaratR,
        //             t1.fSlotR as fParentSlotR,
        //             t1.fUnderOverR as fParentUnderOverR
        //     FROM users AS t1
        //     LEFT JOIN users AS t2 ON t2.iParentID = t1.id
        //     WHERE t2.strNickname="${list[i].strNickname}";
        //     `
        // );

        const [result] = await db.sequelize.query(
            `
            SELECT  t1.fSettleBaccarat AS fParentSettleBaccarat,
                    t1.fSettleSlot AS fParentSettleSlot,
                    t1.fSettlePBA AS fParentSettlePBA,
                    t1.fSettlePBB AS fParentSettlePBB,
                    t1.strNickname as strParentNickname
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            WHERE t2.strNickname='${list[i].strNickname}';
            `
        );
        console.log(`Level ${list[i].iClass} : ${result[0].fParentSettleBaccarat}, ${result[0].fParentSettleSlot}`);

        let parent = GetAgentFromParameter(list, result[0].strParentNickname);

        console.log(`parent`);
        console.log(parent);
        if ( parent == null )
            parent = result[0];
    
        if ( list[i].fSettleBaccarat > parent.fParentSettleBaccarat || 
            list[i].fSettleSlot > parent.fParentSettleSlot ||
            list[i].fSettlePBA > parent.fParentSettlePBA ||
            list[i].fSettlePBB > parent.fParentSettlePBB )
        {
            ret.result = "FAIL";
            ret.name = `
            ${list[i].strNickname}
            상위 보다 값이 큽니다.
            Baccarat 상위 : ${parent.fParentSettleBaccarat}, ${list[i].strNickname} : ${list[i].fSettleBaccarat}
            Slot 상위 : ${parent.fParentSettleSlot}, ${list[i].strNickname} : ${list[i].fSettleSlot}
            PBA : ${parent.fParentSettlePBA}, ${list[i].strNickname} : ${list[i].fSettlePBA}
            PBB : ${parent.fParentSettlePBB}, ${list[i].strNickname} : ${list[i].fSettlePBB}
            `;

            return ret;
        }
    
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
    
            for ( let j in children )
            {
                console.log(`children => ${children[j].strNickname}`);

                let child = GetAgentFromParameter(list, children[j].strNickname);
                console.log(`GetAgentFromParameter : `);
                console.log(child);
                if ( child == null )
                    child= children[j];

                console.log(child);
                console.log(child.fBaccaratR)

                console.log(`me ${list[i].fBaccarat}, children ${child.fBaccaratR}, me ${list[i].fSlot}, children ${child.fSlotR}, me ${list[i].fUnderOver}, children ${child.fUnderOverR}`);

                //console.log(`Me ${list[i].strNickname} : ${list[i].fSettle}, Child ${children[j]}`);
                if ( list[i].fSettleBaccarat < child.fSettleBaccarat || 
                    list[i].fSettleSlot < child.fSettleSlot ||
                    list[i].fSettlePBA < child.fSettlePBA ||
                    list[i].fSettlePBB < child.fSettlePBB) 
                {
    
                    console.log(`me ${list[i].fSettleBaccarat}, children ${child.fSettleBaccarat}`);
                    console.log(`me ${list[i].fSettleSlot}, children ${child.fSettleSlot}`);
                    ret.result = "FAIL";
                    ret.name = `
                    ${list[i].strNickname}
                    하위보다 값이 작습니다.
                    Baccarat -> 하위 : ${child.fSettleBaccarat}, ${me.strNickname} : ${list[i].fSettleBaccarat}
                    Slot -> 하위 : ${child.fSettleSlot}, ${me.strNickname} : ${list[i].fSettleSlot}
                    Slot -> 하위 : ${child.fSettlePBA}, ${me.strNickname} : ${list[i].fSettlePBA}
                    Slot -> 하위 : ${child.fSettlePBB}, ${me.strNickname} : ${list[i].fSettlePBB}
                    `;
                    return ret;
                }
            }
        }
    }

    return ret;
}
exports.ModifySettleGroup = inline_ModifySettleGroup;

var inline_ModifySettleForce = async (array)=> {

    console.log(array);

    let ret = {result:"OK"};
    let list = [];

    for ( var i = 0; i < array.length/6; ++i)
    {
        const cDefault = parseInt(i*6);

        var object = {};
        object.strNickname = array[cDefault+0];
        object.iClass = array[cDefault+1];
        object.fSettleBaccarat = array[cDefault+2];
        object.fSettleSlot = array[cDefault+3];
        object.fSettlePBA = array[cDefault+4];
        object.fSettlePBB = array[cDefault+5];
        // object.fBaccarat = array[cDefault+3];
        // object.fUnderOver = array[cDefault+4];

        list.push(object);
    }

    ret.data = list;

    // 입력값 체크
    for (let i in list) {
        if (list[i].fSettleBaccarat < 0) {
            ret.result = 'Error';
            ret.name = '바카라 죽장값을 확인해주세요';
            break;
        } else if (list[i].fSettleSlot < 0) {
            ret.result = 'Error';
            ret.name = '슬롯 죽장값을 확인해주세요';
            break;
        }
    }


    return ret;
}
exports.ModifySettleForce = inline_ModifySettleForce;
