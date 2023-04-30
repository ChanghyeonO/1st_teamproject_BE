const buildResponse = (error, data) => {
    return {
        error: error ?? null,
        data: data
    }
}

module.exports = buildResponse;