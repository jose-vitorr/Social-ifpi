"use strict";

const apiUrl = 'http://localhost:3000/socialifpi/postagem';
const container = document.getElementById("postagensContainer");

const form = document.getElementById("formNovaPostagem");
const filtroTagInput = document.getElementById("filtroTag");
const filtroTagBtn = document.getElementById("filtroTagBtn");
const filtroTituloInput = document.getElementById("filtroTitulo");
const botaoBuscarTitulo = document.getElementById("botaoBuscarTitulo");

async function listarPostagens(filtroTag = '', filtroTitulo = '') {
    try {
        const response = await fetch(apiUrl);
        const postagens = await response.json();

        if (!Array.isArray(postagens)) {
            console.error("Erro: resposta da API não é um array:", postagens);
            return;
        }

        const filtradas = postagens.filter(p => {
            const contemTag = filtroTag === '' || (Array.isArray(p.tags) && p.tags.map(tag => tag.toLowerCase()).includes(filtroTag.toLowerCase()));
            const contemTitulo = filtroTitulo === '' || (p.titulo && p.titulo.toLowerCase().includes(filtroTitulo.toLowerCase()));
            return contemTag && contemTitulo;
        });

        container.innerHTML = "";

        filtradas.forEach(p => {
            const div = document.createElement("div");
            div.classList.add("postagem");

            div.innerHTML = `
                <h3>${p.titulo}</h3>
                <p>${p.conteudo}</p>
                <p><strong>Autor:</strong> ${p.autor}</p>
                <p><strong>Tags:</strong> ${(Array.isArray(p.tags) ? p.tags.join(', ') : 'Nenhuma')}</p>
                <p><strong>Visualizações:</strong> ${p.visualizacoes || 0}</p>
                <p><strong>Curtidas:</strong> ${p.curtidas || 0}</p>
                
                <button onclick="curtirPostagem(${p.id})">Curtir</button>
                <button onclick="excluirPostagem(${p.id})">Excluir</button>

                <div>
                    <h4>Comentários:</h4>
                    <ul>
                        ${Array.isArray(p.comentarios) && p.comentarios.length > 0
                            ? p.comentarios.map(c => `<li>${c.texto} (${new Date(c.data).toLocaleDateString()})</li>`).join('')
                            : '<li>Nenhum comentário ainda</li>'
                        }
                    </ul>

                    <input type="text" id="comentario-${p.id}" placeholder="Adicionar comentário">
                    <button onclick="adicionarComentario(${p.id})">Comentar</button>
                </div>
            `;

            container.appendChild(div);
        });
    } catch (err) {
        console.error("Erro ao listar postagens:", err);
    }
}

async function curtirPostagem(id) {
    try {
        await fetch(`${apiUrl}/${id}/curtir`, {
            method: 'POST'
        });
        listarPostagens();
    } catch (err) {
        console.error("Erro ao curtir postagem:", err);
    }
}

async function adicionarComentario(id) {
    const input = document.getElementById(`comentario-${id}`);
    const textoComentario = input.value.trim();

    if (!textoComentario) return;

    try {
        await fetch(`${apiUrl}/${id}/comentario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comentario: textoComentario })
        });

        input.value = '';
        listarPostagens();
    } catch (err) {
        console.error("Erro ao adicionar comentário:", err);
    }
}

async function excluirPostagem(id) {
    const confirmacao = confirm("Tem certeza que deseja excluir esta postagem?");
    if (!confirmacao) return;

    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });

        listarPostagens();
    } catch (err) {
        console.error("Erro ao excluir postagem:", err);
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const novaPostagem = {
        titulo: document.getElementById("titulo").value,
        conteudo: document.getElementById("conteudo").value,
        autor: document.getElementById("autor").value,
        data: new Date().toISOString(),
        tags: document.getElementById("tags").value
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novaPostagem)
        });

        if (!response.ok) throw new Error("Erro ao criar postagem");

        await listarPostagens();
        form.reset();
    } catch (err) {
        console.error("Erro ao enviar nova postagem:", err);
    }
});

// Filtro por tag
filtroTagBtn.addEventListener("click", () => {
    listarPostagens(filtroTagInput.value, filtroTituloInput.value);
});

// Filtro por título
botaoBuscarTitulo.addEventListener("click", () => {
    listarPostagens(filtroTagInput.value, filtroTituloInput.value);
});

// Carregar postagens ao iniciar
listarPostagens();
