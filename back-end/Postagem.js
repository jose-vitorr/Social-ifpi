"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Postagem = void 0;

class Postagem {
    constructor(id, titulo, conteudo, autor, data, curtidas, visualizacoes = 0) {
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.autor = autor;
        this.data = data;
        this.curtidas = curtidas;
        this.visualizacoes = visualizacoes;
        this.comentarios = [];
    }

    getId() { return this.id; }
    getTitulo() { return this.titulo; }
    getConteudo() { return this.conteudo; }
    getAutor() { return this.autor; }
    getData() { return this.data; }
    getCurtidas() { return this.curtidas; }
    getVisualizacoes() { return this.visualizacoes; }
    getComentarios() { return this.comentarios; }

    adicionarComentario(comentario) {
        this.comentarios.push(comentario);
    }

    incrementarVisualizacoes() {
        this.visualizacoes++;
    }

    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo,
            conteudo: this.conteudo,
            autor: this.autor,
            data: this.data,
            curtidas: this.curtidas,
            visualizacoes: this.visualizacoes,
            comentarios: this.comentarios
        };
    }
}

exports.Postagem = Postagem;
