document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Seleção de Elementos ---
    const form = document.getElementById('form-admin');
    const inputNome = document.getElementById('admin_nome');
    const inputEmail = document.getElementById('admin_email');
    const btnLimpar = document.getElementById('btn-limpar');
    const listaUsuarios = document.getElementById('lista-usuarios');
    const btnExcluirTodos = document.getElementById('btn-excluir-todos');
    const inputPesquisa = document.getElementById('input-pesquisa');

    // Chave para salvar no Local Storage
    const STORAGE_KEY = 'usuarios_ong_leitor';

    // --- 2. Funções de Manipulação de Dados (Model) ---

    // Ler dados do Local Storage
    function getUsuariosSalvos() {
        const usuariosJSON = localStorage.getItem(STORAGE_KEY);
        return usuariosJSON ? JSON.parse(usuariosJSON) : [];
    }

    // Salvar dados no Local Storage
    function salvarUsuarios(lista) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
        atualizarVisualizacao(lista); // Atualiza a tela sempre que salva
    }

    // Adicionar novo usuário
    function adicionarUsuario(nome, email) {
        const usuarios = getUsuariosSalvos();
        
        const novoUsuario = {
            id: Date.now(), // Gera um ID único baseado no tempo
            nome: nome,
            email: email,
            dataCadastro: new Date().toLocaleString('pt-BR')
        };

        usuarios.push(novoUsuario);
        salvarUsuarios(usuarios);
    }

    // Excluir usuário único
    function excluirUsuario(id) {
        if(confirm("Tem certeza que deseja excluir este usuário?")) {
            let usuarios = getUsuariosSalvos();
            // Filtra a lista removendo o usuário com o ID correspondente
            usuarios = usuarios.filter(user => user.id !== id);
            salvarUsuarios(usuarios);
        }
    }

    // Excluir todos os usuários
    function excluirTodosUsuarios() {
        if(confirm("ATENÇÃO: Isso apagará todos os registros. Confirma?")) {
            localStorage.removeItem(STORAGE_KEY);
            atualizarVisualizacao([]);
        }
    }

    // --- 3. Funções de Interface (View) ---

    // Renderiza a lista na tela (recebe uma lista como parâmetro para permitir filtros)
    function renderizarLista(lista) {
        listaUsuarios.innerHTML = ''; // Limpa a lista atual

        if (lista.length === 0) {
            listaUsuarios.innerHTML = '<li style="justify-content:center; color:#888;">Nenhum registro encontrado.</li>';
            btnExcluirTodos.style.display = 'none';
            return;
        }

        btnExcluirTodos.style.display = 'block';

        lista.forEach(usuario => {
            const li = document.createElement('li');
            
            // Estrutura interna do LI
            li.innerHTML = `
                <div class="user-info">
                    <strong>${usuario.nome}</strong>
                    <span style="font-size: 0.9em; color: #555;">${usuario.email}</span>
                    <span style="font-size: 0.75em; color: #999;">Cadastrado em: ${usuario.dataCadastro}</span>
                </div>
                <button class="btn-delete-item" title="Excluir" data-id="${usuario.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            // Adiciona evento de clique ao botão de excluir deste item específico
            const btnDelete = li.querySelector('.btn-delete-item');
            btnDelete.addEventListener('click', function() {
                // Recupera o ID salvo no atributo data-id e converte para número
                const idParaExcluir = Number(this.getAttribute('data-id'));
                excluirUsuario(idParaExcluir);
            });

            listaUsuarios.appendChild(li);
        });
    }

    // Função central para atualizar a tela (lida com o estado atual da pesquisa)
    function atualizarVisualizacao(listaCompleta = null) {
        // Se não passar lista, pega do storage
        const lista = listaCompleta || getUsuariosSalvos();
        
        // Aplica o filtro da pesquisa se houver texto digitado
        const termo = inputPesquisa.value.toLowerCase();
        
        const listaFiltrada = lista.filter(usuario => {
            return usuario.nome.toLowerCase().includes(termo) || 
                   usuario.email.toLowerCase().includes(termo);
        });

        renderizarLista(listaFiltrada);
    }

    // --- 4. Event Listeners (Controller) ---

    // Evento: Enviar Formulário (Cadastrar)
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = inputNome.value.trim();
        const email = inputEmail.value.trim();

        if(nome && email) {
            adicionarUsuario(nome, email);
            form.reset(); // Limpa os campos
            inputNome.focus(); // Devolve o foco
            alert("Usuário cadastrado com sucesso!");
        }
    });

    // Evento: Botão Limpar Campos
    btnLimpar.addEventListener('click', function() {
        form.reset();
        inputNome.focus();
    });

    // Evento: Botão Excluir Todos
    btnExcluirTodos.addEventListener('click', excluirTodosUsuarios);

    // Evento: Pesquisa (digitação em tempo real)
    inputPesquisa.addEventListener('input', function() {
        atualizarVisualizacao();
    });

    // --- 5. Inicialização ---
    // Carrega a lista assim que a página abre
    atualizarVisualizacao();

});