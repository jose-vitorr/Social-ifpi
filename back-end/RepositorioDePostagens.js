"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioDePostagens = void 0;
const Postagem_1 = require("./Postagem");

 class RepositorioDePostagens {
    constructor() {
        this.postagens = [];
        this.nextId = 1;
    }

    incluir(postagem) {
        const novaPostagem = new Postagem_1.Postagem(
            this.nextId++,
            postagem.getTitulo(),
            postagem.getConteudo(),
            postagem.getAutor(),
            postagem.getData(),
            postagem.getCurtidas(),
            postagem.getVisualizacoes(),
            postagem.getTags() // aqui agora recebe tags
        );
        this.postagens.push(novaPostagem);
        return novaPostagem;
    }

    alterar(id, titulo, conteudo, data, curtidas, tags = []) {
        const postagemExistente = this.consultar(id);
        if (!postagemExistente) return false;

        const autor = postagemExistente.getAutor();
        const comentarios = postagemExistente.getComentarios();
        const visualizacoes = postagemExistente.getVisualizacoes();

        const postagemAtualizada = new Postagem_1.Postagem(
            id, titulo, conteudo, autor, data, curtidas, visualizacoes, tags
        );

        comentarios.forEach(c => postagemAtualizada.adicionarComentario(c));

        const index = this.postagens.findIndex(p => p.getId() === id);
        this.postagens[index] = postagemAtualizada;
        return true;
    }

    consultar(id) {
        const postagem = this.postagens.find(postagem => postagem.getId() === id);
        if (postagem) {
            postagem.incrementarVisualizacoes();
        }
        return postagem;
    }

    excluir(id) {
        const index = this.postagens.findIndex(postagem => postagem.getId() === id);
        if (index !== -1) {
            this.postagens.splice(index, 1);
            return true;
        }
        return false;
    }

    curtir(id) {
        const postagem = this.consultar(id);
        if (!postagem) return null;
        postagem.curtidas++;
        return postagem.getCurtidas();
    }

    listar() {
        return this.postagens
            .sort((a, b) => b.getData().getTime() - a.getData().getTime())
            .map(postagem => postagem.toJSON());
    }

    gerarDataAleatoria(anosPassados = 5) {
        const hoje = new Date();
        const anoInicial = hoje.getFullYear() - anosPassados;
        const anoAleatorio = Math.floor(Math.random() * (hoje.getFullYear() - anoInicial)) + anoInicial;
        const mesAleatorio = Math.floor(Math.random() * 12);
        const diaAleatorio = Math.floor(Math.random() * 28) + 1;
        return new Date(anoAleatorio, mesAleatorio, diaAleatorio);
    }

    povoar() {
        const dados = [
            ['A Importância da Educação', 'A educação é a base para uma sociedade mais justa...', 'Maria', 10, ['educação']],
            ['Tecnologia e Inovação', 'Vivemos em uma era onde a tecnologia avança...', 'Carlos', 15, ['tecnologia']],
            ['Sustentabilidade Ambiental', 'Preservar o meio ambiente é crucial...', 'João', 20, ['meio ambiente']],
            ['Saúde e Bem-Estar', 'Manter o bem-estar físico e mental é essencial...', 'Ana', 8, ['saúde']],
            ['Economia Digital', 'A transformação digital está mudando tudo...', 'Pedro', 12, ['economia']],
            ['Impacto das Redes Sociais', 'As redes sociais têm um papel central...', 'Lucas', 7, ['sociedade']],
            ['Mobilidade Urbana', 'Soluções de mobilidade inteligente são o futuro...', 'Fernanda', 9, ['mobilidade']],
            ['Educação Financeira', 'Gerir as finanças pessoais é fundamental...', 'Sofia', 5, ['finanças']],
            ['Alimentação Saudável', 'Uma dieta equilibrada é essencial...', 'Daniel', 11, ['alimentação']],
            ['Inovações na Saúde', 'A tecnologia está revolucionando o setor de saúde...', 'Patrícia', 13, ['saúde', 'tecnologia']],
        ];

        dados.forEach(([titulo, conteudo, autor, curtidas, tags]) => {
            this.incluir(new Postagem_1.Postagem(
                0, titulo, conteudo, autor, this.gerarDataAleatoria(), curtidas, 0, tags
            ));
        });
    }
}

exports.RepositorioDePostagens = RepositorioDePostagens;
