function getById(id: string): HTMLElement | null {
    return document.getElementById(id);
}

const apiUrl = 'http://localhost:3000/socialifpi/postagem';
const comentariosUrl = 'http://localhost:3000/socialifpi/postagem';

interface Postagem {
    id: number;
    titulo: string;
    conteudo: string;
    data: string;
    curtidas: number;
    visualizacoes: number;
    tags: string[];
}

interface Comentario {
    texto: string;
    data: string;
}

// Listar postagens (padrão ou filtradas)
async function listarPostagens(postagens: Postagem[] | null = null): Promise<void> {
    const response = postagens ? null : await fetch(apiUrl);
    const todasPostagens: Postagem[] = postagens || await response!.json();

    const postagensElement = getById('postagens');
    if (!postagensElement) return;

    postagensElement.innerHTML = '';
    for (const postagem of todasPostagens) {
        const article = document.createElement('article');

        const titulo = document.createElement('h2');
        titulo.textContent = postagem.titulo;

        const conteudo = document.createElement('p');
        conteudo.textContent = postagem.conteudo;

        const data = document.createElement('p');
        data.className = 'data';
        data.textContent = new Date(postagem.data).toLocaleDateString();

        const curtidas = document.createElement('p');
        curtidas.textContent = `Curtidas: ${postagem.curtidas}`;
        curtidas.style.fontWeight = 'bold';

        const visualizacoes = document.createElement('p');
        visualizacoes.textContent = `Visualizações: ${postagem.visualizacoes}`;
        visualizacoes.style.fontStyle = 'italic';

        const botaoCurtir = document.createElement('button');
        botaoCurtir.textContent = 'Curtir';
        botaoCurtir.addEventListener('click', () => curtirPostagem(postagem.id, curtidas));

        const botaoExcluir = document.createElement('button');
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.addEventListener('click', () => excluirPostagem(postagem.id));

        const comentariosDiv = document.createElement('div');
        comentariosDiv.className = 'comentarios';

        const listaComentarios = document.createElement('ul');
        comentariosDiv.appendChild(listaComentarios);

        const inputComentario = document.createElement('input');
        inputComentario.type = 'text';
        inputComentario.placeholder = 'Escreva um comentário';

        const botaoComentar = document.createElement('button');
        botaoComentar.textContent = 'Comentar';
        botaoComentar.addEventListener('click', () => {
            adicionarComentario(postagem.id, inputComentario.value, listaComentarios);
            inputComentario.value = '';
        });

        if (postagem.tags && postagem.tags.length > 0) {
            const tagsParagrafo = document.createElement('p');
            tagsParagrafo.textContent = "Tags: " + postagem.tags.join(', ');
            tagsParagrafo.style.fontStyle = 'italic';
            tagsParagrafo.style.color = '#555';
            article.appendChild(tagsParagrafo);
        }

        comentariosDiv.appendChild(inputComentario);
        comentariosDiv.appendChild(botaoComentar);

        article.appendChild(titulo);
        article.appendChild(conteudo);
        article.appendChild(data);
        article.appendChild(curtidas);
        article.appendChild(visualizacoes);
        article.appendChild(botaoCurtir);
        article.appendChild(botaoExcluir);
        article.appendChild(document.createElement('hr'));
        article.appendChild(comentariosDiv);

        postagensElement.appendChild(article);

        await listarComentarios(postagem.id, listaComentarios);
    }
}

// Curtir postagem
async function curtirPostagem(id: number, curtidasElement: HTMLParagraphElement): Promise<void> {
    const response = await fetch(`${apiUrl}/${id}/curtir`, {
        method: 'POST'
    });
    const result = await response.json();
    curtidasElement.textContent = `Curtidas: ${result.curtidas}`;
}

// Incluir nova postagem
async function incluirPostagem(event: Event): Promise<void> {
    event.preventDefault();

    const tituloInput = getById('titulo') as HTMLInputElement;
    const conteudoInput = getById('conteudo') as HTMLInputElement;
    const tagsInput = getById('tags') as HTMLInputElement;

    if (tituloInput && conteudoInput) {
        const novaPostagem = {
            titulo: tituloInput.value.trim(),
            conteudo: conteudoInput.value.trim(),
            data: new Date().toISOString(),
            curtidas: 0,
            visualizacoes: 0,
            tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        };

        if (!novaPostagem.titulo || !novaPostagem.conteudo) {
            alert("Preencha todos os campos.");
            return;
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaPostagem)
        });

        if (response.ok) {
            await listarPostagens();
            tituloInput.value = '';
            conteudoInput.value = '';
            tagsInput.value = '';
        } else {
            alert("Erro ao cadastrar postagem.");
        }
    }
}

// Excluir postagem
async function excluirPostagem(postagemId: number) {
    const confirmar = confirm("Tem certeza que deseja excluir esta postagem?");
    if (!confirmar) return;

    const response = await fetch(`${apiUrl}/${postagemId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert("Postagem excluída com sucesso.");
        listarPostagens();
    } else {
        alert("Erro ao excluir a postagem.");
    }
}

// Listar comentários
async function listarComentarios(postagemId: number, listaElement: HTMLUListElement): Promise<void> {
    const response = await fetch(`${comentariosUrl}/${postagemId}/comentario`);
    if (response.ok) {
        let comentarios: Comentario[] = await response.json();

        // Ordenar por data decrescente
        comentarios = comentarios.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        listaElement.innerHTML = '';
        comentarios.forEach(comentario => {
            const li = document.createElement("li");

            const texto = comentario?.texto || "[Comentário inválido]";

            const dataFormatada = new Date(comentario.data).toLocaleString("pt-BR", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            li.textContent = `${texto} - ${dataFormatada}`;
            listaElement.appendChild(li);
        });
    } else {
        console.error("Erro ao buscar comentários");
    }
}

// Adicionar comentário
async function adicionarComentario(postagemId: number, texto: string, listaElement: HTMLUListElement): Promise<void> {
    if (!texto.trim()) return;

    const novoComentario = {
        texto: texto.trim(),
        data: new Date().toISOString()
    };

    const response = await fetch(`${comentariosUrl}/${postagemId}/comentario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoComentario)
    });

    if (response.ok) {
        await listarComentarios(postagemId, listaElement);
    } else {
        alert("Erro ao adicionar comentário.");
    }
}

// Buscar postagens por título
async function buscarPostagensPorTitulo(tituloBusca: string): Promise<void> {
    const response = await fetch(apiUrl);
    const postagens: Postagem[] = await response.json();

    const postagensFiltradas = postagens.filter(postagem =>
        postagem.titulo.toLowerCase().includes(tituloBusca.toLowerCase())
    );

    await listarPostagens(postagensFiltradas);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    listarPostagens();

    const botaoNovaPostagem = getById("botaoNovaPostagem");
    if (botaoNovaPostagem) {
        botaoNovaPostagem.addEventListener('click', incluirPostagem);
    }

    const botaoBuscarTitulo = getById("botaoBuscarTitulo");
    const filtroTituloInput = getById("filtroTitulo") as HTMLInputElement;
git
    if (botaoBuscarTitulo && filtroTituloInput) {
        botaoBuscarTitulo.addEventListener('click', () => {
            const tituloBusca = filtroTituloInput.value.trim();
            buscarPostagensPorTitulo(tituloBusca);
        });
    }
});
