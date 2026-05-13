import { Router } from "express";
import { authMiddleware } from "./middleware/auth-middleware";
import { roleMiddleware } from "./middleware/role-middleware";

import * as UserController from "./controllers/users-controller";
import * as FinanceController from "./controllers/finance-controller";
import * as UnitControler from "./controllers/units-controller";


const router = Router();

router.get("/login", authMiddleware, UserController.getLogin);
router.post("/login", UserController.postLogin);

router.get("/unidades", UnitControler.getUnits);

router.get("/financeiro", authMiddleware, roleMiddleware(["admin", "manager"]), FinanceController.getFinance);

export default router;