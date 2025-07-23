import express, { Request, Response } from 'express';
import cors from 'cors';
import { RepositorioDePostagens } from './RepositorioDePostagens';
import { Postagem } from './Postagem';

const app = express();
const PORT = 3000;
const repositorio = new RepositorioDePostagens();

// Middleware
app.use(cors());
app.use(express.json());

// Rota: Listar todas as postagens
app.get('/socialifpi/postagem', (req: Request, res: Response) => {
    const postagens = repositorio.listar();
    res.json(postagens);
});

// Rota: Obter uma postagem por ID
app.get('/socialifpi/postagem/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const postagem = repositorio.obterPorId(id);
    if (postagem) {
        res.json(postagem);
    } else {
        res.status(404).json({ mensagem: 'Postagem não encontrada' });
    }
});

// Rota: Criar nova postagem
app.post('/socialifpi/postagem', (req: Request, res: Response) => {
    const { id, titulo, conteudo, autor, tags } = req.body;

    if (!id || !titulo || !conteudo || !autor) {
        return res.status(400).json({ mensagem: 'Campos obrigatórios ausentes' });
    }

    const novaPostagem = new Postagem(
        id,
        titulo,
        conteudo,
        autor,
        new Date(),
        0, // curtidas
        0, // visualizações
        tags || [] // tags como array de string
    );

    repositorio.adicionar(novaPostagem);
    res.status(201).json(novaPostagem);
});

// Rota: Curtir postagem
app.post('/socialifpi/postagem/:id/curtir', (req: Request, res: Response) => {
    const { id } = req.params;
    const curtidas = repositorio.curtir(id);

    if (curtidas !== null) {
        res.json({ curtidas });
    } else {
        res.status(404).json({ mensagem: 'Postagem não encontrada' });
    }
});

// Rota: Excluir postagem
app.delete('/socialifpi/postagem/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const removido = repositorio.excluir(id);

    if (removido) {
        res.json({ mensagem: 'Postagem excluída com sucesso' });
    } else {
        res.status(404).json({ mensagem: 'Postagem não encontrada' });
    }
});

// Rota: Buscar por tag (ex: ?tag=tecnologia)
app.get('/socialifpi/postagem/buscar/por-tag', (req: Request, res: Response) => {
    const { tag } = req.query;
    if (typeof tag !== 'string') {
        return res.status(400).json({ mensagem: 'Tag inválida' });
    }

    const resultados = repositorio.buscarPorTag(tag);
    res.json(resultados);
});

// Inicia servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
