import {Router} from "express";
import multer from "multer";
import SuperheroController from "../controllers/SuperheroController";
const router = Router();
const upload = multer();

router.post('/superheroes', upload.single('image'), SuperheroController.addSuperhero);
router.get('/superheroes', SuperheroController.getAllSuperheroes);
router.get('/superheroes/:id', SuperheroController.getSuperheroById);
router.patch('/superheroes/:id', SuperheroController.updateSuperhero);
router.delete('/superheroes/:id', SuperheroController.removeSuperhero);

export default router;
