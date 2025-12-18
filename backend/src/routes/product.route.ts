import { Router } from "express";
import { 
  getAllProducts, 
  createProduct, 
  seedProducts 
} from "../controllers/product.controllers"; 
import { getProductBySlug } from "../controllers/product.controllers"; 

const router = Router();


router.get("/", getAllProducts); 


router.post("/", createProduct);


router.post("/seed", seedProducts); 

router.get("/:slug", getProductBySlug); 

export default router;