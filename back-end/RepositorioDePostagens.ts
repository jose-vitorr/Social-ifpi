import { Postagem } from './Postagem';

export class RepositorioDePostagens {
    private postagens: Postagem[] = [];
    private nextId: number = 1;

    public incluir(postagem: Postagem): Postagem {
        const novaPostagem = new Postagem(
            this.nextId++,
            postagem.getTitulo(),
            postagem.getConteudo(),
            postagem.getAutor(),
            postagem.getData(),
            postagem.getCurtidas(),
            postagem.getVisualizacoes()
        );
        this.postagens.push(novaPostagem);
        return novaPostagem;
    }

    public alterar(id: number, titulo: string, conteudo: string, data: Date, curtidas: number): boolean {
        const postagemExistente = this.consultar(id);
        if (!postagemExistente) return false;

        const autor = postagemExistente.getAutor();
        const comentarios = postagemExistente.getComentarios();
        const visualizacoes = postagemExistente.getVisualizacoes();

        const postagemAtualizada = new Postagem(
            id,
            titulo,
            conteudo,
            autor,
            data,
            curtidas,
            visualizacoes
        );

        comentarios.forEach(c => postagemAtualizada.adicionarComentario(c));

        const index = this.postagens.findIndex(p => p.getId() === id);
        this.postagens[index] = postagemAtualizada;
        return true;
    }

    public consultar(id: number): Postagem | undefined {
        const postagem = this.postagens.find(postagem => postagem.getId() === id);
        if (postagem) {
            postagem.incrementarVisualizacoes();
        }
        return postagem;
    }

    public excluir(id: number): boolean {
        const index = this.postagens.findIndex(postagem => postagem.getId() === id);
        if (index !== -1) {
            this.postagens.splice(index, 1);
            return true;
        }
        return false;
    }

    public curtir(id: number): number | null {
        const postagem = this.consultar(id);
        if (!postagem) return null;

        // Incrementa diretamente o número de curtidas
        (postagem as any).curtidas++;
        return postagem.getCurtidas();
    }

    public listar(): any[] {
        return this.postagens
            .sort((a, b) => b.getData().getTime() - a.getData().getTime())
            .map(postagem => postagem.toJSON());
    }

    private gerarDataAleatoria(anosPassados: number = 5): Date {
        const hoje = new Date();
        const anoInicial = hoje.getFullYear() - anosPassados;
        const anoAleatorio = Math.floor(Math.random() * (hoje.getFullYear() - anoInicial)) + anoInicial;
        const mesAleatorio = Math.floor(Math.random() * 12);
        const diaAleatorio = Math.floor(Math.random() * 28) + 1;
        return new Date(anoAleatorio, mesAleatorio, diaAleatorio);
    }

    public povoar(): void {
        const dados: [string, string, string, number][] = [
            ['A Importância da Educação', 'A educação é a base para uma sociedade mais justa...', 'Maria', 10],
            ['Tecnologia e Inovação', 'Vivemos em uma era onde a tecnologia avança...', 'Carlos', 15],
            ['Sustentabilidade Ambiental', 'Preservar o meio ambiente é crucial...', 'João', 20],
            ['Saúde e Bem-Estar', 'Manter o bem-estar físico e mental é essencial...', 'Ana', 8],
            ['Economia Digital', 'A transformação digital está mudando tudo...', 'Pedro', 12],
            ['Impacto das Redes Sociais', 'As redes sociais têm um papel central...', 'Lucas', 7],
            ['Mobilidade Urbana', 'Soluções de mobilidade inteligente são o futuro...', 'Fernanda', 9],
            ['Educação Financeira', 'Gerir as finanças pessoais é fundamental...', 'Sofia', 5],
            ['Alimentação Saudável', 'Uma dieta equilibrada é essencial...', 'Daniel', 11],
            ['Inovações na Saúde', 'A tecnologia está revolucionando o setor de saúde...', 'Patrícia', 13],
        ];

        dados.forEach(([titulo, conteudo, autor, curtidas]) => {
            this.incluir(new Postagem(
                0,
                titulo,
                conteudo,
                autor,
                this.gerarDataAleatoria(),
                curtidas,
                0
            ));
        });
    }
}
