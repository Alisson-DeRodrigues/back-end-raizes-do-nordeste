import { Router } from "express";
import { authMiddleware } from "./middleware/auth-middleware";
import { roleMiddleware } from "./middleware/role-middleware";

import * as UserController from "./controllers/users-controller";
import * as FinanceController from "./controllers/finance-controller";
import * as UnitControler from "./controllers/units-controller";
import * as MenuController from "./controllers/menus-controller";
import * as OrderController from "./controllers/orders-controlller";
import * as InventoryController from "./controllers/inventories-controller";

const router = Router();

router.get("/login", authMiddleware, UserController.getLogin);
router.post("/login", UserController.postLogin);

router.get("/unidades", UnitControler.getUnits);

router.get("/estoque/:id", InventoryController.getInventoryItems);

router.get("/cardapio/:id", MenuController.getMenu);

router.get("/pedidos/:id", OrderController.getOrders);
router.get("/pedidos/items/:id", OrderController.getOrderItems);


router.get("/financeiro", authMiddleware, roleMiddleware(["admin", "manager"]), FinanceController.getFinance);

export default router;