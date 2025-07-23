// ✅ app.js (backend) - corrigido
"use strict";
const express = require("express");
const { RepositorioDePostagens } = require("./RepositorioDePostagens");
const { Postagem } = require("./Postagem");
const cors = require("cors");

const app = express();
const repositorio = new RepositorioDePostagens();

app.use(express.json());
app.use(cors());

repositorio.povoar();

const PATH = '/socialifpi/postagem';
const PATH_ID = PATH + '/:id';
const PATH_CURTIR = PATH_ID + '/curtir';
const PATH_COMENTARIO = PATH_ID + '/comentario';

app.get(PATH, (req, res) => {
    const postagens = repositorio.listar();
    res.json(postagens);
});

app.get(PATH_ID, (req, res) => {
    const id = parseInt(req.params.id);
    const postagem = repositorio.consultar(id);
    if (!postagem) return res.status(404).json({ message: 'Postagem não encontrada' });
    res.json(postagem.toJSON());
});

app.post(PATH, (req, res) => {
    const { titulo, conteudo, autor, data, curtidas, tags } = req.body;
    const novaPostagem = new Postagem(0, titulo, conteudo, autor, new Date(data), curtidas || 0, 0, tags || []);
    const postagemIncluida = repositorio.incluir(novaPostagem);
    res.status(201).json(postagemIncluida);
});

app.put(PATH_ID, (req, res) => {
    const id = parseInt(req.params.id);
    const { titulo, conteudo, data, curtidas, tags } = req.body;
    const sucesso = repositorio.alterar(id, titulo, conteudo, data, curtidas, tags);
    if (!sucesso) return res.status(404).json({ message: 'Postagem não encontrada' });
    res.status(200).json({ message: 'Postagem alterada com sucesso' });
});

app.delete(PATH_ID, (req, res) => {
    const id = parseInt(req.params.id);
    const sucesso = repositorio.excluir(id);
    if (!sucesso) return res.status(404).json({ message: 'Postagem não encontrada' });
    res.status(200).json({ message: 'Postagem excluída com sucesso' });
});

app.post(PATH_CURTIR, (req, res) => {
    const id = parseInt(req.params.id);
    const curtidas = repositorio.curtir(id);
    if (curtidas == null) return res.status(404).json({ message: 'Postagem não encontrada' });
    res.json({ message: 'Postagem curtida com sucesso', curtidas });
});

app.post(PATH_COMENTARIO, (req, res) => {
    const id = parseInt(req.params.id);
    const { comentario, data } = req.body;
    const postagem = repositorio.consultar(id);
    if (!postagem) return res.status(404).json({ message: 'Postagem não encontrada' });
    postagem.adicionarComentario(comentario, data);
    res.status(201).json({
        message: 'Comentário adicionado com sucesso',
        comentarios: postagem.getComentarios()
    });
});

app.get(PATH_COMENTARIO, (req, res) => {
    const id = parseInt(req.params.id);
    const postagem = repositorio.consultar(id);
    if (!postagem) return res.status(404).json({ message: 'Postagem não encontrada' });
    res.json(postagem.getComentarios());
});

app.use((req, res) => res.status(404).send('Não encontrado'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
