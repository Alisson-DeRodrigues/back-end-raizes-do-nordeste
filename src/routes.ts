import { Router } from "express";
import { authMiddleware } from "./middleware/auth-middleware";
import { roleMiddleware } from "./middleware/role-middleware";

import * as UserController from "./controllers/users-controller";
import * as FinanceController from "./controllers/finance-controller";
import * as UnitControler from "./controllers/units-controller";
import * as MenuController from "./controllers/menus-controller";
import * as OrderController from "./controllers/orders-controlller";
import * as InventoryController from "./controllers/inventories-controller";
import * as PaymentController from "./controllers/payments-mock-controller";

const router = Router();

router.get("/login", authMiddleware, UserController.getLogin);
router.post("/login", UserController.postLogin);
router.post("/register", UserController.postClient);

router.get("/unidades", authMiddleware, roleMiddleware(["*"]), UnitControler.getUnits);

router.get("/estoques/:id", authMiddleware, roleMiddleware(["admin", "atendente", "cozinha"]), InventoryController.getInventoryItems);

router.get("/cardapio/:id", authMiddleware, roleMiddleware(["*"]), MenuController.getMenu);

router.get("/pedidos/:id", authMiddleware, roleMiddleware(["admin", "atendente", "cozinha"]), OrderController.getOrders);
router.get("/pedidos/items/:id", authMiddleware, roleMiddleware(["admin", "atendente", "cozinha"]), OrderController.getOrderItems);

router.get("/pagamentos/:id", authMiddleware, roleMiddleware(["admin", "atendente"]), PaymentController.processPaymentMock);

// log e auditoria
router.get("/pagamentos-historico/:id", authMiddleware, roleMiddleware(["admin", "manager"]), () => {});
router.get("/estoques-historico/:id", authMiddleware, roleMiddleware(["admin", "manager"]), () => {});


router.get("/financeiro", authMiddleware, roleMiddleware(["admin", "manager"]), FinanceController.getFinance);

export default router;