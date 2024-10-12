const githubUsername = 'davinyleticia'; // Substitua pelo seu usuário do GitHub
const gitlabUsername = 'davinyleticia'; // Substitua pelo seu usuário do GitLab
const reposPorPagina = 15;
let paginaAtual = 1;

async function buscarRepos() {
    // Buscar repositórios do GitHub
    const githubResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
    const githubData = await githubResponse.json();

    // Buscar repositórios do GitLab
    const gitlabResponse = await fetch(`https://gitlab.com/api/v4/users/${gitlabUsername}/projects`);
    const gitlabData = await gitlabResponse.json();

    // Definir o avatar e o nome do usuário do GitHub
    document.getElementById('github-avatar').src = `https://avatars.githubusercontent.com/${githubUsername}`;
    document.getElementById('github-name').textContent = githubUsername;

    // Combinar repositórios de ambas as plataformas
    const todosRepos = [...githubData, ...gitlabData];
    exibirRepos(todosRepos);
}

function exibirRepos(repos) {
    const repoList = document.getElementById('repo-list');
    const totalRepos = repos.length;
    const totalPaginas = Math.ceil(totalRepos / reposPorPagina);

    // Limpa a lista de repositórios
    repoList.innerHTML = '';

    // Calcula o índice inicial e final para a paginação
    const indiceInicial = (paginaAtual - 1) * reposPorPagina;
    const indiceFinal = Math.min(indiceInicial + reposPorPagina, totalRepos);

    for (let i = indiceInicial; i < indiceFinal; i++) {
        const repo = repos[i];
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span><a href="${repo.html_url || repo.web_url}" target="_blank">${repo.name || repo.path}</a></span><span>${repo.updated_at ? `Atualizado em: ${new Date(repo.updated_at || repo.last_activity_at).toLocaleDateString()}` : ''}</span>`;
        repoList.appendChild(listItem);
    }

    // Atualiza a contagem de repositórios
    document.getElementById('repo-count').textContent = totalRepos;

    // Atualiza a informação de paginação
    document.getElementById('page-info').textContent = `Página ${paginaAtual} de ${totalPaginas}`;

    // Habilita ou desabilita os botões de paginação
    document.getElementById('prev').disabled = paginaAtual === 1;
    document.getElementById('next').disabled = paginaAtual === totalPaginas;
}

// Funções para navegação nas páginas
document.getElementById('prev').onclick = () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        buscarRepos();
    }
};

document.getElementById('next').onclick = () => {
    paginaAtual++;
    buscarRepos();
};

// Carregar repositórios ao iniciar
buscarRepos();