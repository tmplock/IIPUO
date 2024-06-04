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
        if ( list[i].strID == objectData.strID )
        {
            return list[i];
        }
    }
    return null;
}

exports.AddOnlineUser = (listOnlineUser, objectData) => {

    const eTargetType = objectData.eType == 'USER' ? 'CMS' : 'USER';

    let user = this.FindUser(listOnlineUser, {strID:objectData.strID});
    if ( null != user )
    {
        if ( user.eType == objectData.eType )
        {
        }
        else
        {
            listLogout.push({eType:eTargetType, strID:objectData.strID});
            user.eType = objectData.eType;
        }
    }
    else
    {
        listOnlineUser.push({eType:objectData.eType, strID:objectData.strID});
    }
}
