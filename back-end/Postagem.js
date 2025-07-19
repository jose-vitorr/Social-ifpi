"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Postagem = void 0;

class Postagem {
    constructor(id, titulo, conteudo, autor, data, curtidas) {
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.autor = autor;
        this.data = data;
        this.curtidas = curtidas;
        this.comentarios = [];
    }

    getId() {
        return this.id;
    }

    getTitulo() {
        return this.titulo;
    }

    getConteudo() {
        return this.conteudo;
    }

    getAutor() {
        return this.autor;
    }

    getData() {
        return this.data;
    }

    getCurtidas() {
        return this.curtidas;
    }

    getComentarios() {
        return this.comentarios;
    }

    adicionarComentario(comentario) {
        this.comentarios.push(comentario);
    }

    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo,
            conteudo: this.conteudo,
            autor: this.autor,
            data: this.data,
            curtidas: this.curtidas,
            comentarios: this.comentarios
        };
    }
}

exports.Postagem = Postagem;
