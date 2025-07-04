
import  express  from 'express';

import { register, login, testFun } from '../controllers/auth.controller';

const router = express.Router()


router.route("/join").post(register)
router.route("/test").get(testFun)
router.route("/login").post(login)

export default router