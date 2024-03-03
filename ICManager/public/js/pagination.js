function getPagination(limit, totalCount, currentPage) {
    console.log(`getPagination=limit:${limit} totalCount:${totalCount} currentPage:${currentPage}`);
    let tag = ``;
    let iLimit = parseInt(limit);
    let totalPage = totalCount > iLimit ? parseInt(Math.ceil(totalCount / iLimit)) : 0;

    let startPage = 1;
    if (currentPage > 10) {
        if (currentPage%10 == 0) {
            startPage = currentPage-9;
        } else {
            startPage = currentPage-parseInt(currentPage%10)+1;
        }
    }
    let endPage = startPage+10 < totalPage ? startPage+10 : totalPage;

    // 이전버튼
    if (totalPage > 10 && startPage > 1) {
        tag = `<a href="javascript:OnClickPage(${startPage-1});" class="prev"></a>`;
    }

    for (let i = startPage; i<=endPage; i++) {
        let subTag = ``;
        if (i === currentPage) {
            subTag =`<a href="javascript:OnClickPage(${i});" class="on">${i}</a>`;
        } else {
            subTag = `<a href="javascript:OnClickPage(${i});">${i}</a>`;
        }
        tag = `${tag}${subTag}`;
    }

    if (startPage + 10 < totalPage) {
        let subTag = `<a href="javascript:OnClickPage(${endPage});" class="next"></a>`;
        tag = `${tag}${subTag}`;
    }

    return tag;
}

function getNo(limit, totalCount, currentPage, index) {
    let iTotal = parseInt(totalCount);
    let iLimit = parseInt(limit);
    let iPageCount = (parseInt(currentPage) - 1) * iLimit;
    if (iTotal > iPageCount) {
        return iTotal - iPageCount - parseInt(index);
    }
    return iTotal - index;
}