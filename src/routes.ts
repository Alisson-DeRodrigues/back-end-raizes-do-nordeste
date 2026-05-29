import { Router } from "express";
import { authMiddleware } from "./middleware/auth-middleware";
import { roleMiddleware } from "./middleware/role-middleware";

import * as UserController from "./controllers/users-controller";
import * as FinanceController from "./controllers/finance-controller";
import * as UnitControler from "./controllers/units-controller";
import * as MenuController from "./controllers/menus-controller";
import * as OrderController from "./controllers/orders-controller";
import * as InventoryController from "./controllers/inventories-controller";
import * as PaymentController from "./controllers/payments-mock-controller";

const router = Router();

router.get("/login", authMiddleware, UserController.getLogin);
router.post("/login", UserController.postLogin);
router.post("/register", UserController.postClient);

router.get("/unidades", authMiddleware, roleMiddleware(["*"]), UnitControler.getAllUnits);

router.get("/estoques/:id", authMiddleware, roleMiddleware(["admin", "atendente", "cozinha"]), InventoryController.getInventoryItems);
router.post("/estoques", authMiddleware, roleMiddleware(["admin", "cozinha"]), InventoryController.updateInventoryItem);

router.post("/estoque", InventoryController.updateInventoryItem);

router.get("/cardapio/:id", authMiddleware, roleMiddleware(["*"]), MenuController.getMenuByUnitId);

router.get("/pedidos/:id", authMiddleware, roleMiddleware(["admin", "atendente", "cozinha"]), OrderController.getOrders);
router.get("/pedidos/itens/:id", authMiddleware, roleMiddleware(["admin", "atendente", "cozinha"]), OrderController.getOrderItems);
router.post("/pedidos", authMiddleware, roleMiddleware(["admin", "atendente", "cliente"]), OrderController.createOrder);
router.put("/pedidos/:id", authMiddleware, roleMiddleware(["admin", "atendente"]), OrderController.updateOrderStatus);
router.put("/pedidos/cancelar/:id", authMiddleware, roleMiddleware(["admin", "atendente", "cliente"]), OrderController.cancelOrder);

router.put("/pedido/:id", OrderController.updateOrderStatus);
router.post("/pedido", OrderController.createOrder);
router.put("/pedido/cancelar/:id", OrderController.cancelOrder);


router.post("/pagamentos/:id", authMiddleware, roleMiddleware(["admin", "atendente"]), PaymentController.processPaymentMock);
router.post("/pagamento/:id", PaymentController.processPaymentMock);

// log e auditoria
router.get("/pagamentos/log/:id", authMiddleware, roleMiddleware(["admin", "manager"]), () => {});
router.get("/estoques/log/:id", authMiddleware, roleMiddleware(["admin", "manager"]), () => {});


router.get("/financeiro", authMiddleware, roleMiddleware(["admin", "manager"]), FinanceController.getFinance);

export default router;