const getName = (url) => {
    const linkArr = url.split('/')
    const imgName = linkArr[linkArr.length - 1]
    const imgID = imgName.split('.')[0]
    return imgID
}

module.exports = getName;