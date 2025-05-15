import { Router } from "express";
import {
  issueDegreeController,
  verifyDegreeController,
  revokeDegreeController,
  getDegreesByAddressController,
} from "../controllers/degreeController";

const router = Router();

// Degree routes
router.post("/issue", issueDegreeController);
router.get("/verify/:degreeId", verifyDegreeController);
router.post("/revoke/:degreeId", revokeDegreeController);
router.get("/address/:address", getDegreesByAddressController);

export default router;
