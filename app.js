const express = require('express')
require('dotenv').config()
const cors = require('cors')
const helmet = require('helmet')
const { rateLimit } = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const allRoutes = require('./routes')
const {
  urlNotFoundError,
  globalError,
} = require('./middlewares/errorMiddleware')
const deviceInfoMiddleware = require('./middlewares/deviceInfoMiddleware')
const fileUpload = require('express-fileupload')

// Uncaught Exception Handler
process.on('uncaughtException', (error) => {
  console.log({ name: error.name, message: error.message })
  console.log('Uncaught exception occurred! shutting down...')
  process.exit(1)
})

const app = express()
const port = process.env.PORT

// Rate Limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 50 requests per `window` (here, per minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) =>
    res.status(options.statusCode).json({
      message: options.message,
    }),
})

// Middlewares
app.use(
  cors({
    origin: [
      'https://schoolapi.silicornya.net',
      'https://school.silicornya.net',
      'https://schoolstaff.silicornya.net',
      'http://27.147.163.201:5173',
      'http://27.147.163.201:5174',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://127.0.0.1:5000',
      '*',
    ],
    credentials: true,
  })
)
app.use(helmet())
app.set('trust proxy', 1)
app.use(limiter)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(deviceInfoMiddleware)
app.use(
  fileUpload({
    createParentPath: true,
  })
)

// Static file upload/serve middleware
app.use(
  '/uploads',
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Expose-Headers', 'Content-Disposition')
    res.header('Cross-Origin-Resource-Policy', 'cross-origin')
    res.header('Content-Disposition', 'attachment')

    next()
  },
  express.static('uploads')
)

// Routes
app.get('/', (req, res) =>
  res.json({
    message: 'Server is running...',
  })
)
app.use('/api', allRoutes)

// Error Handlers
app.use(globalError)
app.all('*', urlNotFoundError)

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Unhandled Rejection Handler
process.on('unhandledRejection', (error) => {
  console.log({
    name: error.name,
    message: error.message,
    stackTrace: error.stack,
  })
  console.log('Unhandled rejection occurred! shutting down...')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
})
