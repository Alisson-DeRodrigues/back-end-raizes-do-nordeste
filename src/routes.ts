import { Router } from "express";
import { authMiddleware } from "./middlewares/auth-middleware";
import { roleMiddleware } from "./middlewares/role-middleware";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger.json"

import * as UserController from "./controllers/users-controller";
import * as UnitControler from "./controllers/units-controller";
import * as MenuController from "./controllers/menus-controller";
import * as OrderController from "./controllers/orders-controller";
import * as InventoryController from "./controllers/inventories-controller";
import * as PaymentController from "./controllers/payments-controller";
import * as PaymentMockController from "./controllers/payments-mock-controller";
import * as CouponController from "./controllers/coupons-controller";

const router = Router();

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

router.post("/register", UserController.postClient);

router.get("/login", authMiddleware, UserController.getLogin);
router.post("/login", UserController.postLogin);
router.patch("/clientes/fidelidade", authMiddleware, roleMiddleware(["cliente"]), UserController.updateClientFidelityPoints);


router.get("/unidades", authMiddleware, roleMiddleware(["*"]), UnitControler.getAllUnits);


router.get("/estoques/:id", authMiddleware, roleMiddleware(["admin", "gerente", "atendente", "cozinha"]), InventoryController.getInventoryItems);
router.patch("/estoques/update", authMiddleware, roleMiddleware(["admin", "gerente", "cozinha"]), InventoryController.updateInventoryItem);
router.post("/estoques/new", authMiddleware, roleMiddleware(["admin", "gerente"]), InventoryController.createInventoryItem);
router.get("/estoques/log/:id", authMiddleware, roleMiddleware(["admin", "gerente"]), InventoryController.getInventoryLog);


router.get("/cardapio/:id", authMiddleware, roleMiddleware(["*"]), MenuController.getMenuByUnitId);
router.post("/cardapio", authMiddleware, roleMiddleware(["admin"]), MenuController.createMenuItem);
router.post("/cardapio/recipe", authMiddleware, roleMiddleware(["admin"]), MenuController.createRecipeItem);
router.get("/cardapio/recipe/:id", authMiddleware, roleMiddleware(["admin"]), MenuController.getRecipeByProductId);


router.get("/pedidos/:id", authMiddleware, roleMiddleware(["admin", "gerente", "atendente", "cozinha"]), OrderController.getAllOrders);
router.get("/pedidos/status/:id", authMiddleware, roleMiddleware(["admin", "gerente", "atendente", "cozinha", "cliente"]), OrderController.getOrderById);
router.get("/pedidos/itens/:id", authMiddleware, roleMiddleware(["admin", "atendente", "cozinha"]), OrderController.getOrderItems);
router.post("/pedidos", authMiddleware, roleMiddleware(["admin", "gerente", "atendente", "cozinha"]), OrderController.createOrder);
router.patch("/pedidos/:id", authMiddleware, roleMiddleware(["admin", "atendente", "cozinha"]), OrderController.updateOrderStatus);
router.patch("/pedidos/cancelar/:id", authMiddleware, roleMiddleware(["admin", "atendente", "cliente"]), OrderController.cancelOrder);


router.post("/pagamentos", authMiddleware, roleMiddleware(["admin", "gerente", "atendente"]), PaymentMockController.processPaymentMock);
router.get("/pagamentos/log/:id", authMiddleware, roleMiddleware(["admin", "gerente", "atendente"]), PaymentController.getPaymentLog);


router.get("/cupons", authMiddleware, roleMiddleware(["admin"]), CouponController.getCoupons);
router.post("/cupons", authMiddleware, roleMiddleware(["admin"]), CouponController.createCoupon);
router.post("/cupons/private", authMiddleware, roleMiddleware(["admin"]), CouponController.createPrivateCoupon);
router.post("/cupons/resgate", authMiddleware, roleMiddleware(["admin", "cliente"]), CouponController.redeemCoupon);


export default router;