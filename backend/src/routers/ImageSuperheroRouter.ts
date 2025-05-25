import {Router} from "express";
import ImageSuperheroController from "../controllers/ImageSuperheroController";
import {upload} from "../utils/multer";
const router = Router();

router.delete('/images/:id', ImageSuperheroController.deleteImageSuperhero);
router.patch('/superheroes/images/:id', upload.array('images'), ImageSuperheroController.addImagesToSuperhero);

export default router;