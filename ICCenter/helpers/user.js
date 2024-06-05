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

    const objectTarget = {strID:objectData.strID, eType:eTargetType};

    
    let target = this.FindUser(listOnlineUser, objectTarget);
    if ( null != target )
    {
        //listLogout.push({eType:eTargetType, strID:objectData.strID});
        const o = {eType:eTargetType, strID:objectTarget.strID};
        this.AddUser(listLogout, o);
        //user.eType = objectData.eType;
    }

    let user = this.FindUser(listOnlineUser, objectData);
    if ( user == null )
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