// ============================================================================
// EXEMPLO DIDÁTICO DE COOKIES EM JAVASCRIPT
// ============================================================================

/**
 * FUNÇÃO 1: Criar um novo cookie
 * 
 * Parâmetros:
 * - nome: nome do cookie
 * - valor: valor armazenado no cookie
 * - dias: quantos dias o cookie deve durar (opcional, padrão = 7)
 * 
 * Exemplo: criarCookie("usuario", "João Silva", 30);
 */
function criarCookie(nome = null, valor = null, dias = null) {
    // Se não passar parâmetros, pega os valores dos inputs HTML
    if (nome === null) {
        nome = document.getElementById("cookieName").value.trim();
        valor = document.getElementById("cookieValue").value.trim();
        dias = parseInt(document.getElementById("cookieDays").value) || 7;
    }

    // Validação
    if (!nome || !valor) {
        exibirResultado("❌ Por favor, preencha nome e valor do cookie", "error");
        logarConsole("Erro: Cookie não criado - dados incompletos", "error");
        return;
    }

    // Calcular data de expiração
    const data = new Date();
    data.setTime(data.getTime() + (dias * 24 * 60 * 60 * 1000));
    const expires = "expires=" + data.toUTCString();

    // Criar o cookie
    document.cookie = nome + "=" + encodeURIComponent(valor) + ";" + expires + ";path=/";

    // Feedback ao usuário
    exibirResultado(`✅ Cookie "${nome}" criado com sucesso!`, "success");
    logarConsole(`Cookie criado: ${nome} = ${valor} (válido por ${dias} dias)`, "success");

    // Limpar inputs
    document.getElementById("cookieName").value = "";
    document.getElementById("cookieValue").value = "";
    document.getElementById("cookieDays").value = "7";
}

/**
 * FUNÇÃO 2: Obter valor de um cookie específico
 * 
 * Procura nos cookies pelo nome e retorna o valor
 * Retorna null se o cookie não for encontrado
 */
function obterCookie(nome) {
    // Dividir todos os cookies por "; "
    const nomeCookie = nome + "=";
    const cookies = document.cookie.split(';');

    // Procurar pelo cookie específico
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();

        // Verificar se este é o cookie que procuramos
        if (cookie.indexOf(nomeCookie) === 0) {
            // Retornar o valor decodificado
            return decodeURIComponent(cookie.substring(nomeCookie.length, cookie.length));
        }
    }

    return null; // Cookie não encontrado
}

/**
 * FUNÇÃO 3: Buscar e exibir um cookie específico
 */
function buscarCookie() {
    const nome = document.getElementById("cookieSearch").value.trim();

    if (!nome) {
        exibirResultado("❌ Digite o nome do cookie", "error");
        return;
    }

    const valor = obterCookie(nome);

    if (valor !== null) {
        exibirResultado(`✅ Cookie encontrado!<br><strong>${nome}</strong> = ${valor}`, "success");
        logarConsole(`Cookie encontrado: ${nome} = ${valor}`, "success");
    } else {
        exibirResultado(`❌ Cookie "${nome}" não encontrado`, "error");
        logarConsole(`Cookie não encontrado: ${nome}`, "error");
    }
}

/**
 * FUNÇÃO 4: Deletar um cookie específico
 * 
 * Para deletar um cookie, definir sua data de expiração para o passado
 */
function deletarCookie() {
    const nome = document.getElementById("cookieDelete").value.trim();

    if (!nome) {
        exibirResultado("❌ Digite o nome do cookie a deletar", "error");
        return;
    }

    // Verificar se o cookie existe
    if (obterCookie(nome) === null) {
        exibirResultado(`❌ Cookie "${nome}" não existe`, "error");
        logarConsole(`Falha ao deletar: ${nome} não encontrado`, "error");
        return;
    }

    // Deletar definindo uma data no passado
    document.cookie = nome + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    exibirResultado(`✅ Cookie "${nome}" deletado com sucesso!`, "success");
    logarConsole(`Cookie deletado: ${nome}`, "success");
    document.getElementById("cookieDelete").value = "";
}

/**
 * FUNÇÃO 5: Exibir todos os cookies salvos
 */
function exibirCookies() {
    const cookies = document.cookie.split(';');
    const listaCookies = document.getElementById("listaCookies");

    // Limpar lista anterior
    listaCookies.innerHTML = "";

    if (document.cookie === "") {
        listaCookies.innerHTML = '<p style="color: #999;">Nenhum cookie salvo ainda</p>';
        logarConsole("Nenhum cookie encontrado", "info");
        return;
    }

    // Adicionar cada cookie à lista
    cookies.forEach((cookie) => {
        const [nome, valor] = cookie.split("=");
        const nomeLimpo = nome.trim();
        const valorDecodificado = decodeURIComponent(valor || "");

        const item = document.createElement("div");
        item.className = "cookie-item";
        item.innerHTML = `
            <span><strong>${nomeLimpo}:</strong> ${valorDecodificado}</span>
        `;
        listaCookies.appendChild(item);
    });

    logarConsole(`Exibindo ${cookies.length} cookie(s)`, "success");
}

/**
 * FUNÇÃO 6: Limpar TODOS os cookies
 */
function limparTodosCookies() {
    if (document.cookie === "") {
        exibirResultado("❌ Nenhum cookie para limpar", "error");
        return;
    }

    if (!confirm("⚠️ Tem certeza que deseja deletar TODOS os cookies?")) {
        return;
    }

    const cookies = document.cookie.split(";");
    const quantidade = cookies.length;

    // Deletar cada cookie
    cookies.forEach((cookie) => {
        const nomeCookie = cookie.split("=")[0].trim();
        if (nomeCookie) {
            document.cookie = nomeCookie + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    });

    exibirResultado(`✅ ${quantidade} cookie(s) deletado(s)!`, "success");
    logarConsole(`Todos os cookies foram deletados (${quantidade} removidos)`, "success");
    document.getElementById("listaCookies").innerHTML = "";
}

/**
 * FUNÇÃO 7: Exibir resultado em um div
 */
function exibirResultado(mensagem, tipo) {
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = mensagem;
    resultado.className = `resultado show ${tipo}`;

    // Auto-desaparecer após 5 segundos
    setTimeout(() => {
        resultado.classList.remove("show");
    }, 5000);
}

/**
 * FUNÇÃO 8: Registrar ações no console de logs
 */
function logarConsole(mensagem, tipo = "info") {
    const console = document.getElementById("console");
    const linha = document.createElement("div");
    linha.className = "console-line";

    const agora = new Date();
    const hora = agora.toLocaleTimeString("pt-BR");

    let tipoClass = "";
    let icone = "ℹ️";

    if (tipo === "success") {
        tipoClass = "console-success";
        icone = "✅";
    } else if (tipo === "error") {
        tipoClass = "console-error";
        icone = "❌";
    } else if (tipo === "action") {
        tipoClass = "console-action";
        icone = "▶️";
    }

    linha.innerHTML = `<span class="console-time">[${hora}]</span><span class="${tipoClass}">${icone} ${mensagem}</span>`;
    console.appendChild(linha);

    // Manter scroll no final
    console.scrollTop = console.scrollHeight;
}

/**
 * FUNÇÃO 9: Limpar console
 */
function limparConsole() {
    document.getElementById("console").innerHTML = "";
}

// ============================================================================
// EXEMPLOS ADICIONAIS DE USO DE COOKIES
// ============================================================================

/**
 * EXEMPLO: Salvar preferência de tema
 */
function salvarPreferenciaTemaSeo() {
    const tema = "escuro"; // ou "claro"
    criarCookie("tema", tema, 365); // válido por 1 ano
}

/**
 * EXEMPLO: Salvar dados de login
 */
function salvarDadosLogin() {
    const usuario = "joao@email.com";
    const token = "abc123xyz789";
    const diasSessao = 30;

    criarCookie("usuario", usuario, diasSessao);
    criarCookie("token", token, diasSessao);
}

/**
 * EXEMPLO: Cookies com caracteres especiais
 * O encodeURIComponent cuida de encoding automático
 */
function salvarDadosComCaracteres() {
    const nome = "João Silva";
    const email = "joão@email.com";

    criarCookie("nome_usuario", nome, 7);
    criarCookie("email_usuario", email, 7);
}

/**
 * INFORMAÇÕES IMPORTANTES SOBRE COOKIES:
 * 
 * 1. LIMITE DE TAMANHO:
 *    - Máximo 4KB por cookie
 *    - Máximo ~180 cookies por domínio
 * 
 * 2. SEGURANÇA:
 *    - Nunca armazene senhas ou tokens sensíveis
 *    - Use HTTPS com a flag "Secure"
 *    - Use "HttpOnly" para evitar acesso via JavaScript
 *    - Use "SameSite" para proteção contra CSRF
 * 
 * 3. PRIVACIDADE:
 *    - Usuário pode deletar cookies a qualquer momento
 *    - Alguns navegadores deletam cookies automaticamente
 *    - Informar ao usuário sobre cookies (LGPD/GDPR)
 * 
 * 4. ALTERNATIVAS MODERNAS:
 *    - LocalStorage: Persiste até ser deletado manualmente
 *    - SessionStorage: Deletado ao fechar a aba
 *    - IndexedDB: Banco de dados no navegador
 *    - Service Workers: Cache avançado
 */

// ============================================================================
// LOGGING INICIAL
// ============================================================================

// Ao carregar a página, registrar alguns cookies já existentes
document.addEventListener("DOMContentLoaded", function() {
    logarConsole("🍪 Sistema de Cookies iniciado!", "success");
    logarConsole("Console pronto para registrar ações", "info");
});
