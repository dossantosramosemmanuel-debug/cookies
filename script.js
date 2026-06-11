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
        nome = document.getElementById("cookieName").value.trim(); // nome do cookie inserido
        valor = document.getElementById("cookieValue").value.trim(); // valor do cookie inserido
        dias = parseInt(document.getElementById("cookieDays").value) || 7; // quantidade de dias do cookie
    }

    // Validação: nome e valor são obrigatórios
    if (!nome || !valor) {
        exibirResultado("❌ Por favor, preencha nome e valor do cookie", "error"); // mensagem de erro para o usuário
        logarConsole("Erro: Cookie não criado - dados incompletos", "error"); // log de erro no console do app
        return; // interrompe a execução da função sem criar o cookie
    }

    // Calcular a data de expiração a partir do número de dias informado
    const data = new Date();
    data.setTime(data.getTime() + (dias * 24 * 60 * 60 * 1000)); // converter dias para milissegundos
    const expires = "expires=" + data.toUTCString(); // formatar expiração no padrão UTC

    // Criar o cookie com nome, valor codificado e data de expiração
    document.cookie = nome + "=" + encodeURIComponent(valor) + ";" + expires + ";path=/";

    // Informar o usuário sobre criação bem-sucedida
    exibirResultado(`✅ Cookie "${nome}" criado com sucesso!`, "success");
    logarConsole(`Cookie criado: ${nome} = ${valor} (válido por ${dias} dias)`, "success");

    // Limpar os campos do formulário após a criação do cookie
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
    const nomeCookie = nome + "="; // prefixo para comparar o nome do cookie
    const cookies = document.cookie.split(';'); // separar os cookies em um array

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim(); // remover espaços em branco das extremidades

        // Verificar se o cookie atual começa com o nome desejado
        if (cookie.indexOf(nomeCookie) === 0) {
            return decodeURIComponent(cookie.substring(nomeCookie.length, cookie.length)); // retornar valor decodificado
        }
    }

    return null; // cookie não encontrado
}

/**
 * FUNÇÃO 3: Buscar e exibir um cookie específico
 */
function buscarCookie() {
    const nome = document.getElementById("cookieSearch").value.trim(); // nome do cookie a buscar

    if (!nome) {
        exibirResultado("❌ Digite o nome do cookie", "error"); // avisar quando o campo estiver vazio
        return; // sair sem buscar
    }

    const valor = obterCookie(nome); // obter o valor do cookie pelo nome

    if (valor !== null) {
        exibirResultado(`✅ Cookie encontrado!<br><strong>${nome}</strong> = ${valor}`, "success"); // exibir resultado positivo
        logarConsole(`Cookie encontrado: ${nome} = ${valor}`, "success"); // logar resultado no console
    } else {
        exibirResultado(`❌ Cookie "${nome}" não encontrado`, "error"); // exibir mensagem de erro
        logarConsole(`Cookie não encontrado: ${nome}`, "error"); // logar erro no console
    }
}

/**
 * FUNÇÃO 4: Deletar um cookie específico
 * 
 * Para deletar um cookie, definir sua data de expiração para o passado
 */
function deletarCookie() {
    const nome = document.getElementById("cookieDelete").value.trim(); // nome do cookie a remover

    if (!nome) {
        exibirResultado("❌ Digite o nome do cookie a deletar", "error"); // mensagem quando o campo estiver vazio
        return; // sair sem deletar
    }

    // Verificar se o cookie existe antes de tentar deletar
    if (obterCookie(nome) === null) {
        exibirResultado(`❌ Cookie "${nome}" não existe`, "error"); // informar que não existe cookie com esse nome
        logarConsole(`Falha ao deletar: ${nome} não encontrado`, "error"); // registrar falha no console
        return; // sair sem deletar
    }

    // Deletar o cookie definindo uma expiração no passado
    document.cookie = nome + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    exibirResultado(`✅ Cookie "${nome}" deletado com sucesso!`, "success"); // informar sucesso
    logarConsole(`Cookie deletado: ${nome}`, "success"); // registrar no console
    document.getElementById("cookieDelete").value = ""; // limpar campo de entrada
}

/**
 * FUNÇÃO 5: Exibir todos os cookies salvos
 */
function exibirCookies() {
    const cookies = document.cookie.split(';'); // separar os cookies atuais
    const listaCookies = document.getElementById("listaCookies"); // elemento onde a lista será exibida

    listaCookies.innerHTML = ""; // limpar conteúdo anterior da lista

    if (document.cookie === "") {
        listaCookies.innerHTML = '<p style="color: #999;">Nenhum cookie salvo ainda</p>'; // mensagem quando não há cookies
        logarConsole("Nenhum cookie encontrado", "info"); // logar informação
        return; // sair sem tentar exibir cookies
    }

    cookies.forEach((cookie) => {
        const [nome, valor] = cookie.split("="); // separar nome e valor
        const nomeLimpo = nome.trim(); // remover espaços no nome
        const valorDecodificado = decodeURIComponent(valor || ""); // decodificar valor do cookie

        const item = document.createElement("div"); // criar elemento para exibir o cookie
        item.className = "cookie-item"; // aplicar classe de estilo
        item.innerHTML = `
            <span><strong>${nomeLimpo}:</strong> ${valorDecodificado}</span>
        `; // preencher HTML do item
        listaCookies.appendChild(item); // adicionar item à lista
    });

    logarConsole(`Exibindo ${cookies.length} cookie(s)`, "success"); // registrar quantos cookies foram exibidos
}

/**
 * FUNÇÃO 6: Limpar TODOS os cookies
 */
function limparTodosCookies() {
    if (document.cookie === "") {
        exibirResultado("❌ Nenhum cookie para limpar", "error"); // informar quando não há cookies
        return; // sair sem limpar nada
    }

    if (!confirm("⚠️ Tem certeza que deseja deletar TODOS os cookies?")) {
        return; // se o usuário cancelar, não faz nada
    }

    const cookies = document.cookie.split(";"); // separar os cookies existentes
    const quantidade = cookies.length; // contar quantos cookies existem

    cookies.forEach((cookie) => {
        const nomeCookie = cookie.split("=")[0].trim(); // obter apenas o nome
        if (nomeCookie) {
            document.cookie = nomeCookie + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // deletar cookie
        }
    });

    exibirResultado(`✅ ${quantidade} cookie(s) deletado(s)!`, "success"); // mostrar mensagem de sucesso
    logarConsole(`Todos os cookies foram deletados (${quantidade} removidos)`, "success"); // logar ação
    document.getElementById("listaCookies").innerHTML = ""; // limpar visualização da lista
}

/**
 * FUNÇÃO 7: Exibir resultado em um div
 */
function exibirResultado(mensagem, tipo) {
    const resultado = document.getElementById("resultado"); // elemento de resultado
    resultado.innerHTML = mensagem; // inserir mensagem HTML
    resultado.className = `resultado show ${tipo}`; // aplicar classes de estilo e tipo

    setTimeout(() => {
        resultado.classList.remove("show"); // remover exibição após 5 segundos
    }, 5000);
}

/**
 * FUNÇÃO 8: Registrar ações no console de logs
 */
function logarConsole(mensagem, tipo = "info") {
    const console = document.getElementById("console"); // elemento do console visual
    const linha = document.createElement("div"); // criar linha de log
    linha.className = "console-line"; // aplicar estilo de linha de log

    const agora = new Date(); // pegar data/hora atuais
    const hora = agora.toLocaleTimeString("pt-BR"); // formatar hora no padrão brasileiro

    let tipoClass = ""; // classe CSS para tipo de mensagem
    let icone = "ℹ️"; // ícone padrão de informação

    if (tipo === "success") {
        tipoClass = "console-success"; // classe para mensagem de sucesso
        icone = "✅"; // ícone de sucesso
    } else if (tipo === "error") {
        tipoClass = "console-error"; // classe para mensagem de erro
        icone = "❌"; // ícone de erro
    } else if (tipo === "action") {
        tipoClass = "console-action"; // classe para mensagem de ação
        icone = "▶️"; // ícone de ação
    }

    linha.innerHTML = `<span class="console-time">[${hora}]</span><span class="${tipoClass}">${icone} ${mensagem}</span>`; // construir linha HTML
    console.appendChild(linha); // adicionar linha ao console visual

    // Manter scroll sempre no final do console
    console.scrollTop = console.scrollHeight;
}

/**
 * FUNÇÃO 9: Limpar console
 */
function limparConsole() {
    document.getElementById("console").innerHTML = ""; // apagar todas as linhas do console visual
}

// ============================================================================
// EXEMPLOS ADICIONAIS DE USO DE COOKIES
// ============================================================================

/**
 * EXEMPLO: Salvar preferência de tema
 */
function salvarPreferenciaTemaSeo() {
    const tema = "escuro"; // valor fixo do tema escolhido
    criarCookie("tema", tema, 365); // criar cookie válido por 365 dias
}

/**
 * EXEMPLO: Salvar dados de login
 */
function salvarDadosLogin() {
    const usuario = "joao@email.com"; // e-mail de exemplo
    const token = "abc123xyz789"; // token de exemplo
    const diasSessao = 30; // duração de 30 dias para o cookie de sessão

    criarCookie("usuario", usuario, diasSessao); // salvar usuário
    criarCookie("token", token, diasSessao); // salvar token
}

/**
 * EXEMPLO: Cookies com caracteres especiais
 * O encodeURIComponent cuida de encoding automático
 */
function salvarDadosComCaracteres() {
    const nome = "João Silva"; // valor com acento
    const email = "joão@email.com"; // valor com caracteres especiais

    criarCookie("nome_usuario", nome, 7); // criar cookie para nome
    criarCookie("email_usuario", email, 7); // criar cookie para e-mail
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

// Ao carregar a página, registrar alguns logs iniciais no console visual
document.addEventListener("DOMContentLoaded", function() {
    logarConsole("🍪 Sistema de Cookies iniciado!", "success");
    logarConsole("Console pronto para registrar ações", "info");
});
