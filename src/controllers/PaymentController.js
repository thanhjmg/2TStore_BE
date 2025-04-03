const axios = require("axios");
const crypto = require("crypto");

const PaymentController = {
  momoPayment: async (req, res) => {
    try {
      const { amount, orderId } = req.body;

      var accessKey = "F8BBA842ECF85";
      var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
      var partnerCode = "MOMO";
      var orderInfo = "Thanh toán đơn hàng";
      var redirectUrl = "https://yourdomain.com/payment-success";
      var ipnUrl =
        "https://2a78-2402-800-6344-7e5-d9e9-e046-d7ba-6dc.ngrok-free.app/api/callback";

      var requestId = orderId;
      var extraData = "";
      var lang = "vi";

      // 🟢 Sử dụng "payWithMethod" để hiển thị các phương thức thanh toán
      var requestType = "payWithMethod";

      // 🔥 Thêm payType: "qr" để hiển thị thẻ ATM & các phương thức khác
      var payType = "qr";

      // Tạo chữ ký (HMAC SHA256)
      var rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
      var signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      // Tạo body request
      const requestBody = {
        partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        extraData,
        signature,
        payType,
        timeout: 300,
        // 🟢 Thêm payType để hiển thị tùy chọn thanh toán
      };

      // Gửi request đến MoMo
      const response = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/create",
        requestBody,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      res.json(response.data); // Trả về URL thanh toán cho client
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  callbackPayment: async (req, res) => {
    console.log("Call back:");
    console.log(req.body);
  },
  checkPaymentStatus: async (req, res) => {
    const { orderId } = req.body;
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const requestId = orderId;
    const lang = "vi";

    // Tạo chữ ký
    var rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    // Tạo request body
    const requestBody = JSON.stringify({
      partnerCode,
      requestId,
      orderId,
      lang,
      signature,
    });

    // Gửi request kiểm tra trạng thái giao dịch
    const options = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/query",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestBody,
    };

    let result = await axios(options);
    return res.status(200).json(result.data);
  },
};

module.exports = PaymentController;
