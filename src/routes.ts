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
router.post("/clientes/fidelidade", authMiddleware, roleMiddleware(["cliente"]), UserController.updateClientFidelityPoints);


router.get("/unidades", authMiddleware, roleMiddleware(["*"]), UnitControler.getAllUnits);


router.get("/estoques/:id", authMiddleware, roleMiddleware(["admin", "atendente", "cozinha"]), InventoryController.getInventoryItems);
router.post("/estoques/update", authMiddleware, roleMiddleware(["admin", "cozinha"]), InventoryController.updateInventoryItem);
router.post("/estoques/new", authMiddleware, roleMiddleware(["admin"]), InventoryController.createInventoryItem);
router.get("/estoques/log/:id", authMiddleware, roleMiddleware(["admin", "manager"]), InventoryController.getInventoryLog);

router.post("/estoque", InventoryController.updateInventoryItem);
router.post("/estoque/new", InventoryController.createInventoryItem);
router.get("/estoque/log/:id", InventoryController.getInventoryLog);


router.get("/cardapio/:id", authMiddleware, roleMiddleware(["*"]), MenuController.getMenuByUnitId);
router.post("/cardapio", authMiddleware, roleMiddleware(["admin"]), MenuController.createMenuItem);
router.post("/cardapio/recipe", authMiddleware, roleMiddleware(["admin"]), MenuController.createRecipeItem);
router.get("/cardapio/recipe/:id", authMiddleware, roleMiddleware(["admin"]), MenuController.getRecipeByProductId);

router.get("/cardapios/:id", MenuController.getMenuByUnitId);
router.post("/cardapios", MenuController.createMenuItem);
router.post("/cardapios/recipe", MenuController.createRecipeItem);
router.get("/cardapios/recipe/:id", MenuController.getRecipeByProductId);


router.get("/pedidos/:id", authMiddleware, roleMiddleware(["admin", "atendente", "cozinha"]), OrderController.getOrders);
router.get("/pedidos/itens/:id", authMiddleware, roleMiddleware(["admin", "atendente", "cozinha"]), OrderController.getOrderItems);
router.post("/pedidos", authMiddleware, roleMiddleware(["admin", "atendente", "cliente"]), OrderController.createOrder);
router.put("/pedidos/:id", authMiddleware, roleMiddleware(["admin", "atendente"]), OrderController.updateOrderStatus);
router.put("/pedidos/cancelar/:id", authMiddleware, roleMiddleware(["admin", "atendente", "cliente"]), OrderController.cancelOrder);

router.put("/pedido/:id", OrderController.updateOrderStatus);
router.post("/pedido", OrderController.createOrder);
router.put("/pedido/cancelar/:id", OrderController.cancelOrder);


router.post("/pagamentos", authMiddleware, roleMiddleware(["admin", "atendente"]), PaymentMockController.processPaymentMock);
router.post("/pagamento", PaymentMockController.processPaymentMock);
router.get("/pagamentos/log/:id", authMiddleware, roleMiddleware(["admin", "manager"]), PaymentController.getPaymentLog);

router.get("/pagamento/log/:id", PaymentController.getPaymentLog);

router.get("/cupons/:id", authMiddleware, roleMiddleware(["admin"]), CouponController.getCoupons);
router.post("/cupons", authMiddleware, roleMiddleware(["admin"]), CouponController.createCoupon);
router.post("/cupons/private", authMiddleware, roleMiddleware(["admin"]), CouponController.createPrivateCoupon);
router.post("/cupons/resgate", authMiddleware, roleMiddleware(["admin", "cliente"]), CouponController.redeemCoupon);

router.get("/cupon", CouponController.getCoupons);
router.post("/cupon", CouponController.createCoupon);
router.post("/cupon/private", CouponController.createPrivateCoupon);
router.post("/cupon/resgate", CouponController.redeemCoupon);

export default router;