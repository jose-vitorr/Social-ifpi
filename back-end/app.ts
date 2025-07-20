import express, { NextFunction, Request, Response } from 'express';
import { RepositorioDePostagens } from './RepositorioDePostagens';
import { Postagem } from './Postagem';
import cors from 'cors';

const app = express();
const repositorio = new RepositorioDePostagens();

// Configurações do Express
app.use(express.json());
app.use(cors());

// Povoar o repositório com postagens iniciais
repositorio.povoar();

// Constantes de caminhos
const PATH = '/socialifpi/postagem';
const PATH_ID = `${PATH}/:id`;
const PATH_CURTIR = `${PATH_ID}/curtir`;
const PATH_COMENTARIO = `${PATH_ID}/comentario`;

// Listar todas as postagens
app.get(PATH, (req: Request, res: Response) => {
    res.json(repositorio.listar());
});

// Consultar postagem por ID
app.get(PATH_ID, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const postagem = repositorio.consultar(id);

    if (!postagem) {
        return res.status(404).json({ message: 'Postagem não encontrada' });
    }

    res.json(postagem.toJSON());
});

// Incluir nova postagem
app.post(PATH, (req: Request, res: Response) => {
    const { titulo, conteudo, autor, data, curtidas } = req.body;
    const novaPostagem = new Postagem(0, titulo, conteudo, autor, new Date(data), curtidas || 0);
    const postagemIncluida = repositorio.incluir(novaPostagem);
    res.status(201).json(postagemIncluida);
});

// Alterar postagem
app.put(PATH_ID, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { titulo, conteudo, data, curtidas } = req.body;
    const sucesso = repositorio.alterar(id, titulo, conteudo, data, curtidas);

    if (!sucesso) {
        return res.status(404).json({ message: 'Postagem não encontrada' });
    }

    res.status(200).json({ message: 'Postagem alterada com sucesso' });
});

// Excluir postagem
app.delete(PATH_ID, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const sucesso = repositorio.excluir(id);

    if (!sucesso) {
        return res.status(404).json({ message: 'Postagem não encontrada' });
    }

    res.status(200).json({ message: 'Postagem excluída com sucesso' });
});

// Curtir postagem
app.post(PATH_CURTIR, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const curtidas = repositorio.curtir(id);

    if (curtidas == null) {
        return res.status(404).json({ message: 'Postagem não encontrada' });
    }

    res.json({ message: 'Postagem curtida com sucesso', curtidas });
});

// Adicionar comentário
app.post(PATH_COMENTARIO, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { comentario } = req.body;
    const postagem = repositorio.consultar(id);

    if (!postagem) {
        return res.status(404).json({ message: 'Postagem não encontrada' });
    }

    postagem.adicionarComentario(comentario);
    res.status(201).json({
        message: 'Comentário adicionado com sucesso',
        comentarios: postagem.getComentarios()
    });
});

// Listar comentários de uma postagem
app.get(PATH_COMENTARIO, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const postagem = repositorio.consultar(id);

    if (!postagem) {
        return res.status(404).json({ message: 'Postagem não encontrada' });
    }

    res.json(postagem.getComentarios());
});

// Middleware de rota não encontrada
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('Não encontrado');
});

// Inicializar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
