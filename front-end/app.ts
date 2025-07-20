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
}

interface Comentario {
    texto: string;
}

// Listar todas as postagens
async function listarPostagens(): Promise<void> {
    const response = await fetch(apiUrl);
    const postagens: Postagem[] = await response.json();
    const postagensElement = getById('postagens');
    if (!postagensElement) return;

    postagensElement.innerHTML = '';
    for (const postagem of postagens) {
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

        comentariosDiv.appendChild(inputComentario);
        comentariosDiv.appendChild(botaoComentar);

        article.appendChild(titulo);
        article.appendChild(conteudo);
        article.appendChild(data);
        article.appendChild(curtidas);
        article.appendChild(visualizacoes);
        article.appendChild(botaoCurtir);
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

    if (tituloInput && conteudoInput) {
        const novaPostagem = {
            titulo: tituloInput.value.trim(),
            conteudo: conteudoInput.value.trim(),
            data: new Date().toISOString(),
            curtidas: 0
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
        } else {
            alert("Erro ao cadastrar postagem.");
        }
    }
}

// Listar comentários
async function listarComentarios(postagemId: number, listaElement: HTMLUListElement): Promise<void> {
    const response = await fetch(`${comentariosUrl}/${postagemId}/comentario`);
    if (response.ok) {
        const comentarios: Comentario[] = await response.json();
        listaElement.innerHTML = '';
        comentarios.forEach(comentario => {
            const li = document.createElement('li');
            li.textContent = comentario.texto;
            listaElement.appendChild(li);
        });
    }
}

// Adicionar comentário
async function adicionarComentario(postagemId: number, texto: string, listaElement: HTMLUListElement): Promise<void> {
    if (!texto.trim()) return;

    const novoComentario = {
        comentario: { texto }
    };

    await fetch(`${comentariosUrl}/${postagemId}/comentario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoComentario)
    });

    listarComentarios(postagemId, listaElement);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    listarPostagens();

    const botaoNovaPostagem = getById("botaoNovaPostagem");
    if (botaoNovaPostagem) {
        botaoNovaPostagem.addEventListener('click', incluirPostagem);
    }
});
