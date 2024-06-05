exports.RemoveUser = (list, objectData) => {

    console.log(`##### RemoveUser`);

    for ( let i in list )
    {
        if ( list[i].strID == objectData.strID && list[i].eType == objectData.eType )
        {
            list.splice(i, 1);
            return;            
        }
    }
}

exports.FindUser = (list, objectData) => {

    console.log(`FindUser`);
    console.log(objectData);

    for ( let i in list )
    {
        if ( list[i].strID == objectData.strID && list[i].eType == objectData.eType)
        {
            return list[i];
        }
    }
    return null;
}

exports.AddOnlineUser = (listOnlineUser, listLogout, objectData) => {

    const eTargetType = objectData.eType == 'USER' ? 'CMS' : 'USER';

    let user = this.FindUser(listOnlineUser, objectData);
    if ( null != user )
    {
        if ( user.eType == objectData.eType )
        {
        }
        else
        {
            //listLogout.push({eType:eTargetType, strID:objectData.strID});
            const o = {eType:eTargetType, strID:objectData.strID};
            this.AddUser(listLogout, o);
            user.eType = objectData.eType;
        }
    }
    else
    {
        //listOnlineUser.push({eType:objectData.eType, strID:objectData.strID});

        //const o = {eType:objectData.eType, strID:objectData.strID};

        this.AddUser(listOnlineUser, objectData)
    }
}

exports.AddUser = (list, objectData) => {

    let user = this.FindUser(list, objectData);
    if ( null == user )
    {
        list.push(objectData);
    }
}