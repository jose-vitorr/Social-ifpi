export class Postagem {
    private id: number;
    private titulo: string;
    private conteudo: string;
    private autor: string;
    private data: Date;
    private curtidas: number;
    private comentarios: string[];

    constructor(id: number, titulo: string, conteudo: string, autor: string, data: Date, curtidas: number) {
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.autor = autor;
        this.data = data;
        this.curtidas = curtidas;
        this.comentarios = [];
    }

    public getId(): number {
        return this.id;
    }

    public getTitulo(): string {
        return this.titulo;
    }

    public getConteudo(): string {
        return this.conteudo;
    }

    public getAutor(): string {
        return this.autor;
    }

    public getData(): Date {
        return this.data;
    }

    public getCurtidas(): number {
        return this.curtidas;
    }

    public getComentarios(): string[] {
        return this.comentarios;
    }

    public adicionarComentario(comentario: string): void {
        this.comentarios.push(comentario);
    }

    public toJSON(): any {
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
