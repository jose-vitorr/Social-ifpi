export class Postagem {
    constructor(
        public id: string,
        public titulo: string,
        public conteudo: string,
        public autor: string,
        public data: Date,
        public curtidas: number = 0,
        public visualizacoes: number = 0,
        public comentarios: string[] = [],
        public tags: string[] = []
    ) {
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.autor = autor;
        this.data = data;
        this.curtidas = curtidas;
        this.visualizacoes = visualizacoes;
        this.tags = [];
        this.comentarios = [];
    }

    public getId(): string {
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

    public getVisualizacoes(): number {
        return this.visualizacoes;
    }

    public getComentarios(): string[] {
        return this.comentarios;
    }


    public getTags(): string[] {
        return this.tags || [];
    }

    public adicionarComentario(comentario: string): void {
        this.comentarios.push(comentario);
    }

    public incrementarVisualizacoes(): void {
        this.visualizacoes++;
    }

    public toJSON(): any {
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
