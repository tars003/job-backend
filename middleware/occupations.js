const formatOccupations = (occuArr) => {
    console.log(occuArr);
    const res = occuArr.map(occupation => {
        console.log(occupation)
        return (
            { "occupation" : occupation.toLowerCase() }
        );
    });
    return res;
}

module.exports = { formatOccupations };
