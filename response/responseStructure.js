const responseStructure = (responseSuccess, responseMessage, responseData) => {
  return {
    success: responseSuccess,
    message: responseMessage,
    data: responseData || []
  }
}

module.exports = { responseStructure }