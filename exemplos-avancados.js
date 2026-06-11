// ============================================================================
// EXEMPLOS AVANÇADOS E CASOS DE USO REAL COM COOKIES
// ============================================================================

/**
 * EXEMPLO 1: Sistema de Preferências do Usuário
 * Salva múltiplas preferências em um único objeto JSON
 */
class PreferenciasUsuario {
    constructor() {
        this.nomePreferencias = "preferencias_usuario"; // chave usada no localStorage
        this.carregarPreferencias(); // carregar preferências ao instanciar
    }

    carregarPreferencias() {
        const dados = localStorage.getItem(this.nomePreferencias); // buscar dados salvos
        this.dados = dados ? JSON.parse(dados) : this.obterPadrao(); // usar padrão se não houver dados
    }

    obterPadrao() {
        return {
            tema: "claro", // valor padrão para tema
            idioma: "pt-BR", // idioma padrão do usuário
            tamanhoFonte: 14, // tamanho de fonte padrão
            notificacoes: true, // notificações ativadas por padrão
            som: true // som ativado por padrão
        };
    }

    salvar() {
        localStorage.setItem(this.nomePreferencias, JSON.stringify(this.dados)); // gravar preferências como JSON
    }

    atualizar(propriedade, valor) {
        this.dados[propriedade] = valor; // atualizar a propriedade informada
        this.salvar(); // salvar as preferências atualizadas
        console.log(`Preferência atualizada: ${propriedade} = ${valor}`); // log no console do navegador
    }

    obter(propriedade) {
        return this.dados[propriedade]; // retornar valor da preferência solicitada
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
        this.nomeCookie = "carrinho_compras"; // nome do cookie que guardará o carrinho
        this.carregarCarrinho(); // carregar carrinho da memória ao criar a instância
    }

    carregarCarrinho() {
        const carrinho = obterCookie(this.nomeCookie); // tentar ler cookie existente
        this.itens = carrinho ? JSON.parse(carrinho) : []; // converter JSON em array ou criar array vazio
    }

    salvarCarrinho() {
        criarCookie(this.nomeCookie, JSON.stringify(this.itens), 7); // salvar carrinho como cookie válido por 7 dias
    }

    adicionarProduto(id, nome, preco, quantidade = 1) {
        const produtoExistente = this.itens.find(item => item.id === id); // buscar produto já existente

        if (produtoExistente) {
            produtoExistente.quantidade += quantidade; // somar quantidade se produto existir
        } else {
            this.itens.push({ id, nome, preco, quantidade }); // adicionar novo produto ao carrinho
        }

        this.salvarCarrinho(); // salvar carrinho atualizado
        console.log(`Produto adicionado: ${nome}`); // log de ação
    }

    removerProduto(id) {
        this.itens = this.itens.filter(item => item.id !== id); // remover produto por id
        this.salvarCarrinho(); // salvar carrinho atualizado após remoção
    }

    obterTotal() {
        return this.itens.reduce((total, item) => {
            return total + (item.preco * item.quantidade); // somar subtotal de cada item
        }, 0);
    }

    listarItens() {
        console.table(this.itens); // exibir itens em tabela no console do navegador
        console.log(`Total: R$ ${this.obterTotal().toFixed(2)}`); // exibir valor total formatado
    }

    limpar() {
        this.itens = []; // esvaziar lista de itens
        this.salvarCarrinho(); // salvar carrinho vazio
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
        this.nomeVisitas = "historico_visitas"; // chave para histórico de visitas
        this.nomeUltimVisita = "ultima_visita"; // chave para última visita
    }

    registrarVisita() {
        const dataAtual = new Date().toLocaleString("pt-BR"); // data/hora atual formatada
        
        const historico = localStorage.getItem(this.nomeVisitas); // pegar histórico salvo
        const visitas = historico ? JSON.parse(historico) : []; // decodificar ou iniciar como array vazio

        visitas.push(dataAtual); // adicionar nova entrada ao histórico

        if (visitas.length > 100) {
            visitas.shift(); // manter apenas as últimas 100 visitas
        }

        localStorage.setItem(this.nomeVisitas, JSON.stringify(visitas)); // salvar histórico atualizado
        localStorage.setItem(this.nomeUltimVisita, dataAtual); // salvar data da última visita

        return visitas.length; // retornar total de visitas registradas
    }

    obterTotalVisitas() {
        const historico = localStorage.getItem(this.nomeVisitas); // buscar histórico salvo
        return historico ? JSON.parse(historico).length : 0; // retornar quantidade de registros
    }

    obterUltimaVisita() {
        return localStorage.getItem(this.nomeUltimVisita); // retornar última visita salva
    }

    obterHistorico() {
        const historico = localStorage.getItem(this.nomeVisitas); // buscar histórico salvo
        return historico ? JSON.parse(historico) : []; // retornar array de histórico ou vazio
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
        this.prefixo = "notificacao_"; // prefixo para as chaves no localStorage
        this.duracao = 5000; // duração da notificação em milissegundos
    }

    jaMostrou(id) {
        return !!localStorage.getItem(this.prefixo + id); // retorna true se já existe registro
    }

    marcarComoMostrado(id) {
        localStorage.setItem(this.prefixo + id, "true"); // marcar notificação como exibida
    }

    mostrarApenasUmaVez(id, mensagem, tipo = "info") {
        if (!this.jaMostrou(id)) {
            this.exibirNotificacao(mensagem, tipo); // exibir a notificação se ainda não foi mostrada
            this.marcarComoMostrado(id); // registrar que foi mostrada
            return true; // indicar que a notificação foi exibida agora
        }
        return false; // indicar que a notificação já tinha sido exibida
    }

    exibirNotificacao(mensagem, tipo) {
        const notif = document.createElement("div"); // criar elemento de notificação
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${tipo === 'sucesso' ? '#28a745' : '#dc3545'}; // cor de fundo baseada no tipo
            color: white;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `; // aplicar estilo direto ao elemento
        notif.textContent = mensagem; // texto da notificação
        document.body.appendChild(notif); // adicionar ao corpo da página

        setTimeout(() => notif.remove(), this.duracao); // remover após a duração definida
    }

    limpar(id) {
        localStorage.removeItem(this.prefixo + id); // remover registro do localStorage
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
        this.nomeToken = "auth_token"; // chave para o token de autenticação
        this.nomeUsuario = "usuario_logado"; // chave para os dados do usuário
        this.tempoExpiracao = 3600; // tempo de expiração em segundos (1 hora)
    }

    login(email, senha) {
        const token = this.gerarToken(); // gerar token aleatório
        const dataExpiracao = new Date(); // criar objeto Date atual
        dataExpiracao.setSeconds(dataExpiracao.getSeconds() + this.tempoExpiracao); // definir expiração daqui a 1 hora

        localStorage.setItem(this.nomeToken, token); // salvar token no localStorage
        localStorage.setItem(this.nomeUsuario, JSON.stringify({
            email: email,
            loginEm: new Date().toISOString(), // registrar horário de login
            expiraEm: dataExpiracao.toISOString() // registrar horário de expiração
        }));

        return { token, email }; // retornar dados simulados de login
    }

    logout() {
        localStorage.removeItem(this.nomeToken); // remover token
        localStorage.removeItem(this.nomeUsuario); // remover dados do usuário
    }

    estaLogado() {
        const token = localStorage.getItem(this.nomeToken); // ler token salvo
        const usuario = localStorage.getItem(this.nomeUsuario); // ler dados do usuário salvo

        if (!token || !usuario) return false; // se faltar token ou dados, não está logado

        try {
            const dados = JSON.parse(usuario); // converter JSON para objeto
            const expiracao = new Date(dados.expiraEm); // criar data de expiração
            return expiracao > new Date(); // retornar true se ainda não expirou
        } catch {
            return false; // se falhar ao parsear, considerar sessão inválida
        }
    }

    obterUsuarioLogado() {
        if (!this.estaLogado()) return null; // se não estiver logado, retorna null
        return JSON.parse(localStorage.getItem(this.nomeUsuario)); // retornar dados do usuário
    }

    gerarToken() {
        return Math.random().toString(36).substring(2, 15) +
               Math.random().toString(36).substring(2, 15); // gerar string aleatória como token
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
        const tamanho = new Blob([valor]).size; // calcular tamanho em bytes do valor
        return tamanho < 4096; // validar se cabe dentro do limite aproximado de 4KB
    }

    static validarNome(nome) {
        const regex = /^[a-zA-Z0-9_-]+$/; // somente caracteres válidos para nome de cookie
        return regex.test(nome) && nome.length > 0; // nome deve ser não vazio e compatível
    }

    static sanitizar(texto) {
        const div = document.createElement('div'); // criar elemento temporário
        div.textContent = texto; // definir conteúdo seguro
        return div.innerHTML; // retornar versão sanitizada
    }

    static criarSeguro(nome, valor, dias = 7, opcoes = {}) {
        if (!this.validarNome(nome)) {
            throw new Error("Nome de cookie inválido"); // lançar erro em caso de nome inválido
        }

        if (!this.validarTamanho(valor)) {
            throw new Error("Valor de cookie muito grande (máx 4KB)"); // lançar erro se valor exceder tamanho
        }

        const valorCodificado = encodeURIComponent(valor); // codificar valor para uso no cookie

        const data = new Date();
        data.setTime(data.getTime() + (dias * 24 * 60 * 60 * 1000)); // calcular expiração

        let cookie = `${nome}=${valorCodificado};expires=${data.toUTCString()};path=/`; // montar string do cookie

        if (opcoes.domain) {
            cookie += `;domain=${opcoes.domain}`; // adicionar domínio se fornecido
        }

        if (opcoes.secure) {
            cookie += `;secure`; // adicionar flag secure se solicitado
        }

        if (opcoes.samesite) {
            cookie += `;samesite=${opcoes.samesite}`; // adicionar política SameSite
        }

        document.cookie = cookie; // gravar cookie seguro
        return true; // indicar sucesso
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
        this.callbacks = {}; // guardar funções de retorno por chave
        this.iniciar(); // iniciar escuta de eventos storage
    }

    iniciar() {
        window.addEventListener('storage', (evento) => {
            if (this.callbacks[evento.key]) {
                this.callbacks[evento.key](evento.newValue); // chamar callback quando a chave mudar
            }
        });
    }

    registrar(chave, callback) {
        this.callbacks[chave] = callback; // registrar callback para determinada chave
    }

    enviar(chave, valor) {
        localStorage.setItem(chave, valor); // escrever valor no localStorage e disparar evento em outras abas
    }

    remover(chave) {
        localStorage.removeItem(chave); // remover item do localStorage
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
        this.prefixo = prefixo; // prefixo usado nas chaves de cache
    }

    salvar(chave, valor, minutos = 60) {
        const dados = {
            valor: valor, // valor a ser armazenado
            expiraEm: new Date().getTime() + (minutos * 60 * 1000) // timestamp de expiração
        };
        localStorage.setItem(this.prefixo + chave, JSON.stringify(dados)); // salvar objeto de cache como JSON
    }

    obter(chave) {
        const dados = localStorage.getItem(this.prefixo + chave); // buscar dados do cache

        if (!dados) return null; // retornar null se não existir

        try {
            const obj = JSON.parse(dados); // converter JSON em objeto

            if (obj.expiraEm < new Date().getTime()) {
                this.deletar(chave); // deletar cache expirado
                return null; // retornar null para cache expirado
            }

            return obj.valor; // retornar valor em cache
        } catch {
            return null; // retornar null se houver erro de parse
        }
    }

    deletar(chave) {
        localStorage.removeItem(this.prefixo + chave); // remover item do cache
    }

    limparExpirados() {
        for (let i = 0; i < localStorage.length; i++) {
            const chave = localStorage.key(i); // obter cada chave no localStorage
            if (chave.startsWith(this.prefixo)) {
                this.obter(chave); // verificar expiração e deletar caso necessário
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
    console.log("=== DEMONSTRAÇÃO DE COOKIES AVANÇADOS ===\n"); // iniciar demonstração no console

    console.log("1. Testando Preferências do Usuário:"); // cabeçalho do primeiro teste
    const prefs = new PreferenciasUsuario(); // criar instância de preferências
    prefs.atualizar("tema", "escuro"); // atualizar preferência de tema
    console.log("Tema atual:", prefs.obter("tema")); // exibir tema atual

    console.log("\n2. Testando Carrinho de Compras:"); // cabeçalho do segundo teste
    const carrinho = new CarrinhoPersistente(); // criar instância do carrinho
    carrinho.adicionarProduto(1, "Notebook", 3000, 1); // adicionar produto 1
    carrinho.adicionarProduto(2, "Mouse", 50, 2); // adicionar produto 2
    carrinho.listarItens(); // listar itens no console

    console.log("\n3. Testando Contador de Visitas:"); // cabeçalho do terceiro teste
    const contador = new ContadorVisitas(); // criar instância do contador
    contador.registrarVisita(); // registrar visita atual
    console.log("Total:", contador.obterTotalVisitas()); // exibir total de visitas

    console.log("✅ Todas as demonstrações foram executadas!"); // mensagem final de conclusão
}

// Descomentar para testar:
// executarDemonstracao();
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
