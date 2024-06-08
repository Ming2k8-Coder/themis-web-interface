module.exports = {
	contestName: 'Trình chấm Themis',
	// Cổng máy chủ, mặc định 80 thì không cần thêm số cổng sau ip xx.xx.xx.xx:<số cổng>
	port: 80,
	sessionSecret: 'gisjWikvZWHMiQzNmTV7',
	// Bảng xếp hạng
	allowScoreboard: true,
	registration: {
		// Cho phép đăng kí?
		allow: false,
		recaptcha: {
			// Cần captcha? nên để false nếu là nhóm nhỏ
			enable: true,
			siteKey: '',
			secretKey: ''
		}
	},
	// Chế độ kì thi 
	contestMode: {
		// on/off
		enabled: false,
		// Month is 0 based (0 = January)
		// năm,tháng,ngày,giờ,phút,giây
		startTime: new Date(2024, 12, 31, 23, 59, 59),
		endTime: new Date(2025, 12, 31, 23, 59, 59),
		// Ẩn kết quả khi chấm? (tự on khi (đặt contest và hết endtime) hoặc contest off )
		hideLogs: true
	},
	// Config the rate-limiter(hạn chế yêu cầu (máy chủ yếu))
	rateLimiter: {
		// every limiter has 4 parameters:
		// - free tries: The number of request that can be assigned within the time window without any wait.
		// - min wait: The minimum wait time between 2 limited requests. (in seconds)
		// - max wait: The maximum wait time between 2 limited requests.
		// - life time: The lifetime of a logged request.
		// For each site, set the rate limiter value to an array of 4 numbers to activathe the rate limiter,
		// or set to null to disable it.
		// For example, the previously used config:
		// submit: [30, 2 * 60 * 60, 2 * 60 * 60, 60 * 60],
		// register: [30, 25 * 60 * 60, 25 * 60 * 60, 24 * 60 * 60],
		// logRequest: [2400, 2 * 60 * 60, 2 * 60 * 60, 60 * 60]
		// dài nhỉ, tóm gọn lại là như sau
		// bên dưới là 3 trang, thay <null> thành 
		// <[số lượt yêu cầu tối đa trong 1 khoảng t/g ngắn,
		// 	 t/g đợi tối thiểu giữa 2 lượt yêu cầu bị drop,
		//	 t/g đợi tối đa giữa 2 lượt yêu cầu bị drop,
		//   đ biết để như trên ]
		// nhớ dấu ,
		submit: null,
		register: null,
		logRequest: null
	}
};
