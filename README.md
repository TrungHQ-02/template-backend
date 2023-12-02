# Template dự án Nodejs, expressjs và sequelize

Template cho phát triển dự án backend, sử dụng Nodejs, expressjs, và sequelize.
Hiện tại template có các chức năng sau

- Sequelize ORM kết nối với MySQL database
- Middlewares authentication middleware với JWT và image uploading middleware lên Firebase storage
- Validators validate dữ liệu gửi trong API request
- Swagger dùng để đặc tả API
- Log hệ thống đưa log hệ thống vào CSDL
- Các hàm tiện ích, helpers tạo code ngẫu nhiên (cho xác thực email), lấy IP, ký vào jwt, đa ngôn ngữ, gửi code về email sử dụng nodemailer
- Bảo mật headers sử dụng helmet
- CORS cho phép CORS
- Compression gzip data

br

## Manual Installation

- git clone
- npm install install các dependencies và dev dependencies
- tạo file .env các biến môi trường, có các biến như .env.example file
- npm run dev

br

## Environment Variables

Các trường của env được miêu tả sau đây

```js
PORT = cổng chạy backend
JWT_SECRET_KEY = khóa để ký jwt access token
REFRESH_TOKEN_SECRET_KEY = khóa để ký refresh token
MAIL_USERNAME = địa chỉ mail để gửi email
MAIL_PASSWORD = app password của mail
MAIL_HOST = smtp.gmail.com
MAIL_PORT = 587

FIREBASE_API_KEY = config ở firebase
FIREBASE_AUTH_DOMAIN =config ở firebase
FIREBASE_PROJECT_ID = config ở firebase
FIREBASE_STORAGE_BUCKET = config ở firebase
FIREBASE_MESSAGING_SENDER_ID = config ở firebase
FIREBASE_APP_ID = config ở firebase
FIREBASE_MEASUREMENT_ID = config ở firebase
```

br

## API Documentation

Để xem tài liệu API, vào link sau sau khi chạy backend
httplocalhost{PORT}apidocs

### API Endpoints

Các API endpoint hiện có
User Auth Routes

- Register - POST apiuser
- Login - POST apiuserlogin
- Logout - POST apiuserlogout
- Verify Email - POST apiuserverify-email
- Refresh Token - POST apiuserrefresh-token
- Forgot Password - POST apiuserforgot-password
- Send Verification Code - POST apiusersend-verification-code

User Edit Routes

- Edit User - PUT apiuser
- Change Password - POST apiuserchange-password

Other User Routes

- Get User - GET apiuser
- Delete User - DELETE apiuser

br

## Authentication

Sử dụng check-auth cho các route cần xác thực người dùng, khi gửi request cần gửi access token kèm theo

```js
const express = require(express);
const router = express.Router();
const userController = require(..controllersuser);
const { auth, imageUpload } = require(..middlewares);

router.put(, auth, imageUpload, userController.editUser);
```

## Database connection

Có một số cách để connect database thành công

Tạo db có tên 'crossplatform' ở local sau đó tạo các bảng có schema như folder models

- Ví dụ với XAMPP, chạy apache và mysql
- Tạo db có tên crossplatform
- Tạo các table với schema có trong folder models

Sử dụng sequelize

- Tương tự, tạo db có tên crossplatform
  Trong file modelsindex.js, có hai phần code được comment

```js
sequelize
  .sync({
    force true,
  })
  .then(() = {
    console.log(Database is updated);
  })
  .catch((error) = {
    console.log(error);
  });

sequelize
  .sync()
  .then(() = {
    console.log(Database is updated);
  })
  .catch((error) = {
    console.log(error);
  });
```

- Hãy mở comment phần có sync({force true}) nếu bạn muốn tạo mới toàn bộ bảng trong db và xóa dữ liệu mỗi lần server chạy lại (khuyên dùng nếu bạn chưa có cấu trúc bảng, sau khi chạy 1 lần hãy tắt nó đi)
- Hãy mở comment phần còn lại nếu bạn muốn tạo mới bảng, nhưng mỗi lần chạy lại server thì nó sẽ không xóa dữ liệu trong db của bạn
- Chạy server để kết nối db crossplatform
- Chạy file index.js để có bảng

## Contact for help

Email vào hoangquoctrung018@gmail.com

**THANK YOU!**
