import express from "express";
import expenseRoutes from "./expenses";
import householdRoutes from "./households";
import userRoutes from "./users"

const router = express()

router.get("/health", (req, res) => {
    res.send({ status: "healthy" });
});

router.use("/expenses", expenseRoutes);
router.use("/households", householdRoutes);
router.use("/users", userRoutes);

export default router;