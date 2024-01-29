const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    //set default
    statusCode : err.statusCode  || StatusCodes.INTERNAL_SERVER_ERROR ,
    msg:err.message ||  'Something went wrong try again later'
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  //Validation error
  if(err.name === 'ValidationError'){
    // console.log(Object.values(err.errors));
    customError.msg = Object.values(err.errors).map((item)=>item.message).join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  // duplicate email error 
  if(err.code && err.code === 11000){
    customError.msg =`Duplicate value for ${Object.keys(err.keyValue)} field, please choose another value`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }
  // Cast error
  if(err.name === 'CastError'){
    customError.msg = `No item find with id: ${err.value}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({msg:customError.msg})
}

module.exports = errorHandlerMiddleware
