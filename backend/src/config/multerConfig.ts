import multer from "multer";
import path from "path";

// Configuração de armazenamento personalizada
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define o destino dos arquivos carregados
    cb(null, path.join(__dirname, "../../uploads")); // Salvar na pasta 'uploads'
  },
  filename: (req, file, cb) => {
    // Gera o nome do arquivo com a extensão original
    const ext = path.extname(file.originalname); // Obtém a extensão do arquivo
    const filename = `${Date.now()}${ext}`; // Gera um nome único
    cb(null, filename);
  },
});

// Exporta a configuração do Multer
const upload = multer({ storage });

export default upload;
