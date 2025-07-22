"use strict";

function getById(id) {
    return document.getElementById(id);
}

const apiUrl = 'http://localhost:3000/socialifpi/postagem';
const comentariosUrl = 'http://localhost:3000/socialifpi/postagem';

// Listar todas as postagens com comentários (com suporte a filtro de tag)
async function listarPostagens(tagFiltro = null) {
    const response = await fetch(apiUrl);
    let postagens = await response.json();

    if (tagFiltro) {
        postagens = postagens.filter(p => p.tags?.some(tag => tag.toLowerCase() === tagFiltro));
    }

    const postagensElement = getById('postagens');
    if (postagensElement) {
        postagensElement.innerHTML = '';
        postagens.forEach(postagem => {
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
            botaoExcluir.style.marginLeft = '10px';
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

            listarComentarios(postagem.id, listaComentarios);
        });
    }
}

// Curtir postagem
async function curtirPostagem(id, curtidasElement) {
    const response = await fetch(`${apiUrl}/${id}/curtir`, { method: 'POST' });
    const result = await response.json();
    curtidasElement.textContent = `Curtidas: ${result.curtidas}`;
}

// Incluir nova postagem
async function incluirPostagem(event) {
    event.preventDefault();

    const tituloInput = getById('titulo');
    const conteudoInput = getById('conteudo');
    const tagsInput = getById('tags');
    const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== "");;

    if (tituloInput && conteudoInput) {
        const novaPostagem = {
            titulo: tituloInput.value.trim(),
            conteudo: conteudoInput.value.trim(),
            data: new Date().toISOString(),
            curtidas: 0,
            visualizacoes: 0,
            tags
        };

        if (!novaPostagem.titulo || !novaPostagem.conteudo) {
            alert("Preencha todos os campos.");
            return;
        }

        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novaPostagem)
        });

        await listarPostagens();
        tituloInput.value = '';
        conteudoInput.value = '';
        tagsInput.value = '';
    }
}

// Excluir postagem
async function excluirPostagem(postagemId) {
    const confirmar = confirm("Tem certeza que deseja excluir esta postagem?");
    if (!confirmar) return;

    try {
        const response = await fetch(`${apiUrl}/${postagemId}`, { method: 'DELETE' });

        if (response.ok) {
            alert("Postagem excluída com sucesso.");
            listarPostagens();
        } else {
            const texto = await response.text();
            console.error("Erro no back-end:", texto);
            alert("Erro ao excluir a postagem.");
        }
    } catch (erro) {
        console.error("Erro ao tentar excluir:", erro);
        alert("Erro de rede ao excluir a postagem.");
    }
}

async function listarComentarios(postagemId, listaElement) {
    const response = await fetch(`${comentariosUrl}/${postagemId}/comentario`);
    if (response.ok) {
        const comentarios = await response.json();
        console.log("Comentários recebidos:", comentarios); // 🔍 Veja o que vem da API

        listaElement.innerHTML = '';
        comentarios.forEach(comentario => {
            const li = document.createElement('li');

            // Verifica se o texto realmente existe
            if (comentario.texto) {
                li.textContent = comentario.comentario?.texto || '[Comentário inválido]';
            } else {
                li.textContent = '[Comentário inválido]';
                console.warn("Comentário inválido:", comentario);
            }

            listaElement.appendChild(li);
        });
    } else {
        console.error("Erro ao buscar comentários");
    }
}

// Adicionar comentário
async function adicionarComentario(postagemId, texto, listaElement) {
    if (!texto.trim()) return;

    const novoComentario = {
        texto: texto.trim(),
        data: new Date().toISOString()
    };

    await fetch(`${comentariosUrl}/${postagemId}/comentario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoComentario)
    });

    listarComentarios(postagemId, listaElement);
}

// Filtro por tag
function filtrarPorTag() {
    const tag = getById('filtroTag').value.trim().toLowerCase();
    listarPostagens(tag);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    listarPostagens();

    const botaoNovaPostagem = getById("botaoNovaPostagem");
    if (botaoNovaPostagem) {
        botaoNovaPostagem.addEventListener('click', incluirPostagem);
    }

    const filtroTag = getById("filtroTag");
    if (filtroTag) {
        filtroTag.addEventListener('input', filtrarPorTag);
    }
});
