"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Postagem = void 0;

class Postagem {
    constructor(id, titulo, conteudo, autor, data, curtidas, visualizacoes = 0, tags = []) {
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.autor = autor;
        this.data = data;
        this.curtidas = curtidas;
        this.visualizacoes = visualizacoes;
        this.tags = tags;               // ✅ Adiciona o campo tags
        this.comentarios = [];
    }

    getId() { return this.id; }
    getTitulo() { return this.titulo; }
    getConteudo() { return this.conteudo; }
    getAutor() { return this.autor; }
    getData() { return this.data; }
    getCurtidas() { return this.curtidas; }
    getVisualizacoes() { return this.visualizacoes; }
    getTags() { return this.tags || []; }
    getComentarios() { return this.comentarios; }

    /**
     * Adiciona um comentário com texto e data
     * @param {string} comentario - O texto do comentário
     * @param {string} data - A data em string ou ISO, opcional
     */
    adicionarComentario(comentario, data) {
        this.comentarios.push({
            texto: comentario,
            data: data ? new Date(data) : new Date()
        });
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
            tags: this.tags,                  // ✅ Inclui as tags no JSON retornado
            comentarios: this.comentarios
        };
    }
}

exports.Postagem = Postagem;
