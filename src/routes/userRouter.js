import { Router } from "express";
import { register, login, checkUser, editUser, getUserById, registering, listProducts} from "../controllers/userController.js";

//MIDDLEWARES
import VerifyToken from "../helpers/verify-token.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/checkUser", checkUser);
router.get("/:id", getUserById);
router.put("/edit:id", VerifyToken, editUser);
router.post("/registeringMon", registering);
router.get("/listProducts", listProducts);

export default router;
