const { updateCustomerModel, getCustomerByCsIdModel } = require('../models/CustomerModel')

const {
  statusUpdateCustomer,
  statusUpdateFail,
  statusServerError,
  statusNotFound,
  statusGet
} = require('../helpers/status')

module.exports = {
  updateCustomerByCsId: async (req, res, _next) => {
    const { csId } = req.params

    try {
      const findData = await getCustomerByCsIdModel(csId)

      if (findData.length) {
        req.body.image = req.file === undefined ? findData[0].cs_pic_image : req.file.filename

        const data = {
          ...req.body,
          cs_pic_image: req.body.image
        }

        delete data.image

        const result = await updateCustomerModel(csId, data)

        if (result.affectedRows) {
          statusUpdateCustomer(res, findData[0].cs_pic_image)
        } else {
          statusUpdateFail(res)
        }
      } else {
        statusNotFound(res)
      }
    } catch (err) {
      statusServerError(res)
    }
  },

  getCustomerByCsId: async (req, res, _next) => {
    const { csId } = req.params

    try {
      const result = await getCustomerByCsIdModel(csId)

      if (result.length) {
        statusGet(res, result)
      } else {
        statusNotFound(res)
      }
    } catch (error) {
      statusServerError(res)
    }
  }
}
