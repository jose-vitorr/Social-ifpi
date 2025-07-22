import { Postagem } from './Postagem';

export class RepositorioDePostagens {
    private postagens: Postagem[] = [];

    adicionar(postagem: Postagem): void {
        this.postagens.push(postagem);
    }

    listar(): Postagem[] {
        // Ordena por data decrescente (mais recente primeiro)
        return this.postagens.sort((a, b) => b.data.getTime() - a.data.getTime());
    }

    obterPorId(id: string): Postagem | undefined {
        return this.postagens.find(p => p.id === id);
    }

    excluir(id: string): boolean {
        const index = this.postagens.findIndex(p => p.id === id);
        if (index !== -1) {
            this.postagens.splice(index, 1);
            return true;
        }
        return false;
    }

    curtir(id: string): number | null {
        const postagem = this.postagens.find(p => p.id === id);
        if (postagem) {
            postagem.curtidas += 1;
            return postagem.curtidas;
        }
        return null;
    }

    adicionarVisualizacao(id: string): number | null {
        const postagem = this.postagens.find(p => p.id === id);
        if (postagem) {
            postagem.visualizacoes += 1;
            return postagem.visualizacoes;
        }
        return null;
    }

    buscarPorTag(tag: string): Postagem[] {
        return this.postagens.filter(p => p.tags.includes(tag));
    }
}
