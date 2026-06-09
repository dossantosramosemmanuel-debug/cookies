// ============================================================================
// EXEMPLOS AVANÇADOS E CASOS DE USO REAL COM COOKIES
// ============================================================================

/**
 * EXEMPLO 1: Sistema de Preferências do Usuário
 * Salva múltiplas preferências em um único objeto JSON
 */
class PreferenciasUsuario {
    constructor() {
        this.nomePreferencias = "preferencias_usuario";
        this.carregarPreferencias();
    }

    carregarPreferencias() {
        const dados = localStorage.getItem(this.nomePreferencias);
        this.dados = dados ? JSON.parse(dados) : this.obterPadrao();
    }

    obterPadrao() {
        return {
            tema: "claro",
            idioma: "pt-BR",
            tamanhoFonte: 14,
            notificacoes: true,
            som: true
        };
    }

    salvar() {
        localStorage.setItem(this.nomePreferencias, JSON.stringify(this.dados));
    }

    atualizar(propriedade, valor) {
        this.dados[propriedade] = valor;
        this.salvar();
        console.log(`Preferência atualizada: ${propriedade} = ${valor}`);
    }

    obter(propriedade) {
        return this.dados[propriedade];
    }
}

// Uso:
// const prefs = new PreferenciasUsuario();
// prefs.atualizar("tema", "escuro");
// console.log(prefs.obter("tema")); // "escuro"


/**
 * EXEMPLO 2: Carrinho de Compras Persistente
 * Gerencia produtos salvos em cookie
 */
class CarrinhoPersistente {
    constructor() {
        this.nomeCookie = "carrinho_compras";
        this.carregarCarrinho();
    }

    carregarCarrinho() {
        const carrinho = obterCookie(this.nomeCookie);
        this.itens = carrinho ? JSON.parse(carrinho) : [];
    }

    salvarCarrinho() {
        criarCookie(this.nomeCookie, JSON.stringify(this.itens), 7);
    }

    adicionarProduto(id, nome, preco, quantidade = 1) {
        const produtoExistente = this.itens.find(item => item.id === id);

        if (produtoExistente) {
            produtoExistente.quantidade += quantidade;
        } else {
            this.itens.push({ id, nome, preco, quantidade });
        }

        this.salvarCarrinho();
        console.log(`Produto adicionado: ${nome}`);
    }

    removerProduto(id) {
        this.itens = this.itens.filter(item => item.id !== id);
        this.salvarCarrinho();
    }

    obterTotal() {
        return this.itens.reduce((total, item) => {
            return total + (item.preco * item.quantidade);
        }, 0);
    }

    listarItens() {
        console.table(this.itens);
        console.log(`Total: R$ ${this.obterTotal().toFixed(2)}`);
    }

    limpar() {
        this.itens = [];
        this.salvarCarrinho();
    }
}

// Uso:
// const carrinho = new CarrinhoPersistente();
// carrinho.adicionarProduto(1, "Notebook", 3000, 1);
// carrinho.adicionarProduto(2, "Mouse", 50, 2);
// carrinho.listarItens();


/**
 * EXEMPLO 3: Contador de Visitas com Data
 * Rastreia quantas vezes o usuário visitou e quando
 */
class ContadorVisitas {
    constructor() {
        this.nomeVisitas = "historico_visitas";
        this.nomeUltimVisita = "ultima_visita";
    }

    registrarVisita() {
        const dataAtual = new Date().toLocaleString("pt-BR");
        
        // Obter histórico
        const historico = localStorage.getItem(this.nomeVisitas);
        const visitas = historico ? JSON.parse(historico) : [];

        // Adicionar nova visita
        visitas.push(dataAtual);

        // Manter apenas últimas 100 visitas
        if (visitas.length > 100) {
            visitas.shift();
        }

        // Salvar
        localStorage.setItem(this.nomeVisitas, JSON.stringify(visitas));
        localStorage.setItem(this.nomeUltimVisita, dataAtual);

        return visitas.length;
    }

    obterTotalVisitas() {
        const historico = localStorage.getItem(this.nomeVisitas);
        return historico ? JSON.parse(historico).length : 0;
    }

    obterUltimaVisita() {
        return localStorage.getItem(this.nomeUltimVisita);
    }

    obterHistorico() {
        const historico = localStorage.getItem(this.nomeVisitas);
        return historico ? JSON.parse(historico) : [];
    }
}

// Uso:
// const contador = new ContadorVisitas();
// contador.registrarVisita();
// console.log(`Total de visitas: ${contador.obterTotalVisitas()}`);
// console.log(`Última visita: ${contador.obterUltimaVisita()}`);


/**
 * EXEMPLO 4: Sistema de Notificações com Cookies
 * Mostra notificação apenas uma vez
 */
class GerenciadorNotificacoes {
    constructor() {
        this.prefixo = "notificacao_";
        this.duracao = 5000; // 5 segundos
    }

    jaMostrou(id) {
        return !!localStorage.getItem(this.prefixo + id);
    }

    marcarComoMostrado(id) {
        localStorage.setItem(this.prefixo + id, "true");
    }

    mostrarApenasUmaVez(id, mensagem, tipo = "info") {
        if (!this.jaMostrou(id)) {
            this.exibirNotificacao(mensagem, tipo);
            this.marcarComoMostrado(id);
            return true;
        }
        return false;
    }

    exibirNotificacao(mensagem, tipo) {
        const notif = document.createElement("div");
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${tipo === 'sucesso' ? '#28a745' : '#dc3545'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        notif.textContent = mensagem;
        document.body.appendChild(notif);

        setTimeout(() => notif.remove(), this.duracao);
    }

    limpar(id) {
        localStorage.removeItem(this.prefixo + id);
    }
}

// Uso:
// const notificacoes = new GerenciadorNotificacoes();
// notificacoes.mostrarApenasUmaVez("boas_vindas", "Bem-vindo de volta!");


/**
 * EXEMPLO 5: Sessão do Usuário Segura
 * Gerencia sessão com tokens e dados de usuário
 */
class SessaoUsuario {
    constructor() {
        this.nomeToken = "auth_token";
        this.nomeUsuario = "usuario_logado";
        this.tempoExpiracao = 3600; // 1 hora
    }

    login(email, senha) {
        // Em produção, isso viria de um servidor
        const token = this.gerarToken();
        const dataExpiracao = new Date();
        dataExpiracao.setSeconds(dataExpiracao.getSeconds() + this.tempoExpiracao);

        // Salvar com flag secure (simular)
        localStorage.setItem(this.nomeToken, token);
        localStorage.setItem(this.nomeUsuario, JSON.stringify({
            email: email,
            loginEm: new Date().toISOString(),
            expiraEm: dataExpiracao.toISOString()
        }));

        return { token, email };
    }

    logout() {
        localStorage.removeItem(this.nomeToken);
        localStorage.removeItem(this.nomeUsuario);
    }

    estaLogado() {
        const token = localStorage.getItem(this.nomeToken);
        const usuario = localStorage.getItem(this.nomeUsuario);

        if (!token || !usuario) return false;

        try {
            const dados = JSON.parse(usuario);
            const expiracao = new Date(dados.expiraEm);
            return expiracao > new Date();
        } catch {
            return false;
        }
    }

    obterUsuarioLogado() {
        if (!this.estaLogado()) return null;
        return JSON.parse(localStorage.getItem(this.nomeUsuario));
    }

    gerarToken() {
        return Math.random().toString(36).substring(2, 15) +
               Math.random().toString(36).substring(2, 15);
    }
}

// Uso:
// const sessao = new SessaoUsuario();
// sessao.login("usuario@email.com", "senha123");
// console.log(sessao.estaLogado()); // true
// console.log(sessao.obterUsuarioLogado());


/**
 * EXEMPLO 6: Validador de Cookies
 * Verifica e gerencia a validade de cookies
 */
class ValidadorCookies {
    static validarTamanho(valor) {
        // Cookie tem máximo ~4KB
        const tamanho = new Blob([valor]).size;
        return tamanho < 4096;
    }

    static validarNome(nome) {
        // Nomes válidos: alfanuméricos, sublinhado, hífen
        const regex = /^[a-zA-Z0-9_-]+$/;
        return regex.test(nome) && nome.length > 0;
    }

    static sanitizar(texto) {
        // Remove caracteres perigosos
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    static criarSeguro(nome, valor, dias = 7, opcoes = {}) {
        // Validar
        if (!this.validarNome(nome)) {
            throw new Error("Nome de cookie inválido");
        }

        if (!this.validarTamanho(valor)) {
            throw new Error("Valor de cookie muito grande (máx 4KB)");
        }

        // Codificar
        const valorCodificado = encodeURIComponent(valor);

        // Calcular expiração
        const data = new Date();
        data.setTime(data.getTime() + (dias * 24 * 60 * 60 * 1000));

        // Construir cookie com segurança
        let cookie = `${nome}=${valorCodificado};expires=${data.toUTCString()};path=/`;

        if (opcoes.domain) {
            cookie += `;domain=${opcoes.domain}`;
        }

        if (opcoes.secure) {
            cookie += `;secure`;
        }

        if (opcoes.samesite) {
            cookie += `;samesite=${opcoes.samesite}`;
        }

        document.cookie = cookie;
        return true;
    }
}

// Uso:
// ValidadorCookies.criarSeguro("usuario", "João", 30, { 
//     secure: true, 
//     samesite: "Strict" 
// });


/**
 * EXEMPLO 7: Sincronizador de Dados entre Abas
 * Usa eventos de storage para sincronizar dados
 */
class SincronizadorAbas {
    constructor() {
        this.callbacks = {};
        this.iniciar();
    }

    iniciar() {
        window.addEventListener('storage', (evento) => {
            if (this.callbacks[evento.key]) {
                this.callbacks[evento.key](evento.newValue);
            }
        });
    }

    registrar(chave, callback) {
        this.callbacks[chave] = callback;
    }

    enviar(chave, valor) {
        localStorage.setItem(chave, valor);
    }

    remover(chave) {
        localStorage.removeItem(chave);
    }
}

// Uso em aba 1:
// const sync = new SincronizadorAbas();
// sync.registrar("statusUsuario", (novoStatus) => {
//     console.log("Status mudou em outra aba:", novoStatus);
// });

// Uso em aba 2:
// sync.enviar("statusUsuario", "online");


/**
 * EXEMPLO 8: Cache de Dados com Expiração
 * Simples sistema de cache com validade
 */
class CacheComExpiracao {
    constructor(prefixo = "cache_") {
        this.prefixo = prefixo;
    }

    salvar(chave, valor, minutos = 60) {
        const dados = {
            valor: valor,
            expiraEm: new Date().getTime() + (minutos * 60 * 1000)
        };
        localStorage.setItem(this.prefixo + chave, JSON.stringify(dados));
    }

    obter(chave) {
        const dados = localStorage.getItem(this.prefixo + chave);

        if (!dados) return null;

        try {
            const obj = JSON.parse(dados);

            // Verificar expiração
            if (obj.expiraEm < new Date().getTime()) {
                this.deletar(chave);
                return null;
            }

            return obj.valor;
        } catch {
            return null;
        }
    }

    deletar(chave) {
        localStorage.removeItem(this.prefixo + chave);
    }

    limparExpirados() {
        for (let i = 0; i < localStorage.length; i++) {
            const chave = localStorage.key(i);
            if (chave.startsWith(this.prefixo)) {
                this.obter(chave); // Checa expiração e deleta se necessário
            }
        }
    }
}

// Uso:
// const cache = new CacheComExpiracao();
// cache.salvar("dados_api", { id: 1, nome: "Teste" }, 30); // Válido por 30 min
// console.log(cache.obter("dados_api")); // { id: 1, nome: "Teste" }


// ============================================================================
// TESTES E DEMONSTRAÇÕES
// ============================================================================

function executarDemonstracao() {
    console.log("=== DEMONSTRAÇÃO DE COOKIES AVANÇADOS ===\n");

    // Teste 1: Preferências
    console.log("1. Testando Preferências do Usuário:");
    const prefs = new PreferenciasUsuario();
    prefs.atualizar("tema", "escuro");
    console.log("Tema atual:", prefs.obter("tema"));

    // Teste 2: Carrinho
    console.log("\n2. Testando Carrinho de Compras:");
    const carrinho = new CarrinhoPersistente();
    carrinho.adicionarProduto(1, "Notebook", 3000, 1);
    carrinho.adicionarProduto(2, "Mouse", 50, 2);
    carrinho.listarItens();

    // Teste 3: Contador
    console.log("\n3. Testando Contador de Visitas:");
    const contador = new ContadorVisitas();
    contador.registrarVisita();
    console.log("Total:", contador.obterTotalVisitas());

    console.log("✅ Todas as demonstrações foram executadas!");
}

// Descomentar para testar:
// executarDemonstracao();
