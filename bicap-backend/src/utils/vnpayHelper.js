const crypto = require('crypto');
const querystring = require('querystring');

/**
 * VNPay Payment Helper
 * Tích hợp thanh toán VNPay vào hệ thống
 */

class VNPayHelper {
    constructor() {
        // Lấy config từ environment variables
        this.vnp_TmnCode = process.env.VNPAY_TMN_CODE || '';
        this.vnp_HashSecret = process.env.VNPAY_HASH_SECRET || '';
        this.vnp_Url = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        this.vnp_ReturnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:5001/api/payments/vnpay-return';
        this.vnp_IpAddr = process.env.VNPAY_IP_ADDR || '127.0.0.1';
    }

    /**
     * Tạo mã tham chiếu giao dịch (TxnRef)
     * Format: {type}{timestamp}{random}
     * @param {string} type - Loại giao dịch: 'SUB' (subscription), 'ORD' (order)
     * @param {number} id - ID của subscription hoặc order
     * @returns {string} - Mã tham chiếu
     */
    generateTxnRef(type, id) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${type}${timestamp}${id}${random}`;
    }

    /**
     * Định dạng ngày theo chuẩn VNPay (yyyyMMddHHmmss)
     * Luôn sử dụng múi giờ Việt Nam (GMT+7)
     * @param {Date} date - Đối tượng ngày
     * @returns {string} - Chuỗi ngày định dạng
     */
    formatDate(date) {
        // VNPay yêu cầu GMT+7
        const vntzDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

        const year = vntzDate.getUTCFullYear();
        const month = (vntzDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = vntzDate.getUTCDate().toString().padStart(2, '0');
        const hour = vntzDate.getUTCHours().toString().padStart(2, '0');
        const minute = vntzDate.getUTCMinutes().toString().padStart(2, '0');
        const second = vntzDate.getUTCSeconds().toString().padStart(2, '0');
        return `${year}${month}${day}${hour}${minute}${second}`;
    }

    /**
     * Tạo secure hash cho VNPay
     * @param {Object} params - Object chứa các tham số
     * @returns {string} - Secure hash
     */
    /**
     * Tạo secure hash cho VNPay
     * @param {Object} params - Object chứa các tham số
     * @returns {string} - Secure hash
     */
    createSecureHash(params) {
        const sortedKeys = Object.keys(params).sort();

        // VNPay 2.1.0: Thử nghiệm - SignData là chuỗi đã ENCODE (Standard %20)
        const signData = sortedKeys
            .map(key => {
                const val = params[key];
                if (val === null || val === undefined || val === '') return null;
                return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
            })
            .filter(Boolean)
            .join('&');

        console.log('🔑 signData for Hash (ENCODED):', signData);

        const hmac = crypto.createHmac('sha512', this.vnp_HashSecret.trim());
        return hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    }

    /**
     * Tạo payment URL cho VNPay
     * @param {Object} paymentData - Dữ liệu thanh toán
     * @param {number} paymentData.amount - Số tiền (VND)
     * @param {string} paymentData.orderId - ID đơn hàng hoặc subscription
     * @param {string} paymentData.orderInfo - Thông tin đơn hàng
     * @param {string} paymentData.orderType - Loại đơn hàng
     * @param {string} paymentData.locale - Ngôn ngữ (vn/en)
     * @param {string} paymentData.txnRef - Mã tham chiếu (nếu không có sẽ tự tạo)
     * @param {string} paymentData.ipAddr - IP address của client
     * @returns {Object} - { paymentUrl, txnRef, secureHash }
     */
    createPaymentUrl(paymentData) {
        const {
            amount,
            orderId,
            orderInfo = 'Thanh toan don hang',
            orderType = 'other',
            locale = 'vn',
            txnRef = null,
            ipAddr = null
        } = paymentData;

        // Validate
        if (!this.vnp_TmnCode || !this.vnp_HashSecret) {
            console.error('❌ VNPay Config Missing:', { tmn: !!this.vnp_TmnCode, secret: !!this.vnp_HashSecret });
            throw new Error('VNPay configuration is missing. Please check VNPAY_TMN_CODE and VNPAY_HASH_SECRET in .env');
        }

        if (!amount || amount <= 0) {
            throw new Error('Invalid amount');
        }

        // Tạo TxnRef nếu chưa có
        const finalTxnRef = txnRef || this.generateTxnRef(orderType.substring(0, 3).toUpperCase(), orderId);

        // Chuẩn hoá IP Address: Strip ::ffff: (IPv4-mapped IPv6)
        let finalIpAddr = ipAddr || this.vnp_IpAddr;
        if (finalIpAddr.includes('::ffff:')) {
            finalIpAddr = finalIpAddr.replace('::ffff:', '');
        }

        // Chuẩn bị params (Sắp xếp theo thứ tự alphabet)
        const vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.vnp_TmnCode,
            vnp_Amount: Math.round(amount * 100),
            vnp_CurrCode: 'VND',
            vnp_TxnRef: finalTxnRef,
            vnp_OrderInfo: orderInfo.substring(0, 255),
            vnp_OrderType: 'other', // Quay lại giá trị 'other' (an toàn nhất cho sandbox)
            vnp_Locale: locale,
            vnp_ReturnUrl: this.vnp_ReturnUrl,
            vnp_IpAddr: '127.0.0.1', // Force IP v4 loopback
            vnp_CreateDate: this.formatDate(new Date()),
            vnp_ExpireDate: this.formatDate(new Date(Date.now() + 15 * 60 * 1000))
        };

        // 1. Tạo secure hash (SignData là ENCODED)
        const secureHash = this.createSecureHash(vnp_Params);

        // 2. Tạo payment URL (Dùng chuỗi ENCODED giống hệt signData)
        const queryStr = Object.keys(vnp_Params)
            .sort()
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(vnp_Params[key])}`)
            .join('&');

        const finalUrl = `${this.vnp_Url}?${queryStr}&vnp_SecureHash=${secureHash}`;

        console.log('🌐 Generated VNPay URL:', finalUrl);

        return {
            paymentUrl: finalUrl,
            txnRef: finalTxnRef,
            secureHash: secureHash,
            params: vnp_Params
        };
    }

    /**
     * Xác thực callback từ VNPay
     * @param {Object} queryParams - Query parameters từ VNPay callback
     * @returns {Object} - { isValid, data }
     */
    verifyCallback(queryParams) {
        try {
            const {
                vnp_SecureHash,
                vnp_TxnRef,
                vnp_ResponseCode,
                vnp_TransactionNo,
                vnp_TransactionStatus,
                vnp_Amount,
                ...otherParams
            } = queryParams;

            // Tạo lại hash để so sánh
            const secureHash = this.createSecureHash({
                ...otherParams,
                vnp_TxnRef,
                vnp_ResponseCode,
                vnp_TransactionNo,
                vnp_TransactionStatus,
                vnp_Amount
            });

            // So sánh hash
            const isValid = secureHash === vnp_SecureHash;

            return {
                isValid,
                data: {
                    txnRef: vnp_TxnRef,
                    responseCode: vnp_ResponseCode,
                    transactionNo: vnp_TransactionNo,
                    transactionStatus: vnp_TransactionStatus,
                    amount: vnp_Amount ? parseInt(vnp_Amount) / 100 : null, // Chia 100 để lấy số tiền thực
                    secureHash: vnp_SecureHash,
                    otherParams
                }
            };
        } catch (error) {
            console.error('Error verifying VNPay callback:', error);
            return {
                isValid: false,
                error: error.message
            };
        }
    }

    /**
     * Kiểm tra response code từ VNPay
     * @param {string} responseCode - Mã phản hồi
     * @returns {Object} - { success, message }
     */
    checkResponseCode(responseCode) {
        const responseCodes = {
            '00': { success: true, message: 'Giao dịch thành công' },
            '07': { success: false, message: 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)' },
            '09': { success: false, message: 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking' },
            '10': { success: false, message: 'Xác thực thông tin thẻ/tài khoản không đúng. Quá 3 lần' },
            '11': { success: false, message: 'Đã hết hạn chờ thanh toán. Xin vui lòng thực hiện lại giao dịch' },
            '12': { success: false, message: 'Thẻ/Tài khoản bị khóa' },
            '13': { success: false, message: 'Nhập sai mật khẩu xác thực giao dịch (OTP)' },
            '51': { success: false, message: 'Tài khoản không đủ số dư để thực hiện giao dịch' },
            '65': { success: false, message: 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày' },
            '75': { success: false, message: 'Ngân hàng thanh toán đang bảo trì' },
            '79': { success: false, message: 'Nhập sai mật khẩu thanh toán quá số lần quy định' },
            '99': { success: false, message: 'Lỗi không xác định' }
        };

        return responseCodes[responseCode] || { success: false, message: 'Mã lỗi không xác định' };
    }
}

// Export singleton instance
module.exports = new VNPayHelper();

