const nvl = (str) => {
    return str || "";
}

const strIsEmpty = (str) => {
	if (typeof str == "undefined" || str == null || str == "") return true;
	else return false;
}

module.exports = {
    nvl,
    strIsEmpty
}