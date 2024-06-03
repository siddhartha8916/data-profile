import express from 'express'
import dataProfileRoutes from './data-profile.routes'

const router = express.Router()

router.use('/data-profile', dataProfileRoutes)

export default router
