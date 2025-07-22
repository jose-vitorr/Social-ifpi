"use strict";
const express = require("express");
const { RepositorioDePostagens } = require("./RepositorioDePostagens");
const { Postagem } = require("./Postagem");
const cors = require("cors");

const app = express();
const repositorio = new RepositorioDePostagens();

// Configurações do Express
app.use(express.json());
app.use(cors());

// Povoar o repositório com postagens iniciais
repositorio.povoar();

// Constantes de caminhos
const PATH = '/socialifpi/postagem';
const PATH_ID = PATH + '/:id';
const PATH_CURTIR = PATH_ID + '/curtir';
const PATH_COMENTARIO = PATH_ID + '/comentario';

// Listar todas as postagens
app.get(PATH, (req, res) => {
    const postagens = repositorio.listar();
    res.json(postagens);
});

// Consultar postagem por ID
app.get(PATH_ID, (req, res) => {
    const id = parseInt(req.params.id);
    const postagem = repositorio.consultar(id);

    if (!postagem) {
        res.status(404).json({ message: 'Postagem não encontrada' });
        return;
    }

    res.json(postagem.toJSON());
});


// Incluir nova postagem
app.post(PATH, (req, res) => {
    const { titulo, conteudo, autor, data, curtidas } = req.body;
    const novaPostagem = new Postagem(0, titulo, conteudo, autor, new Date(data), curtidas || 0);
    const postagemIncluida = repositorio.incluir(novaPostagem);
    res.status(201).json(postagemIncluida);
});

// Alterar postagem
app.put(PATH_ID, (req, res) => {
    const id = parseInt(req.params.id);
    const { titulo, conteudo, data, curtidas } = req.body;
    const sucesso = repositorio.alterar(id, titulo, conteudo, data, curtidas);

    if (!sucesso) {
        res.status(404).json({ message: 'Postagem não encontrada' });
        return;
    }

    res.status(200).json({ message: 'Postagem alterada com sucesso' });
});

// Excluir postagem
app.delete(PATH_ID, (req, res) => {
    const id = parseInt(req.params.id);
    const sucesso = repositorio.excluir(id);

    if (!sucesso) {
        res.status(404).json({ message: 'Postagem não encontrada' });
        return;
    }

    res.status(200).json({ message: 'Postagem excluída com sucesso' });
});

// Curtir postagem
app.post(PATH_CURTIR, (req, res) => {
    const id = parseInt(req.params.id);
    const curtidas = repositorio.curtir(id);

    if (curtidas == null) {
        res.status(404).json({ message: 'Postagem não encontrada' });
        return;
    }

    res.json({ message: 'Postagem curtida com sucesso', curtidas });
});

// Adicionar comentário
app.post(PATH_COMENTARIO, (req, res) => {
    const id = parseInt(req.params.id);
    const { comentario, data } = req.body;

    const postagem = repositorio.consultar(id);

    if (!postagem) {
        res.status(404).json({ message: 'Postagem não encontrada' });
        return;
    }
    postagem.adicionarComentario(comentario, data);
    res.status(201).json({
        message: 'Comentário adicionado com sucesso',
        comentarios: postagem.getComentarios()
    });
});

// ✅ Novo endpoint: Listar comentários de uma postagem
app.get(PATH_COMENTARIO, (req, res) => {
    const id = parseInt(req.params.id);
    const postagem = repositorio.consultar(id);

    if (!postagem) {
        res.status(404).json({ message: 'Postagem não encontrada' });
        return;
    }

    res.json(postagem.getComentarios());
});


// Middleware de rota não encontrada
app.use((req, res, next) => {
    res.status(404).send('Não encontrado');
});

// Inicializar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
