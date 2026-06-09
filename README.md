# 🍪 Exemplo Didático de Cookies em JavaScript

Um projeto educativo completo para aprender como trabalhar com cookies em HTML, CSS e JavaScript.

## 📁 Estrutura do Projeto

```
cookies/
├── index.html      # Estrutura HTML com interface interativa
├── style.css       # Estilos modernos e responsivos
├── script.js       # Lógica JavaScript com gerenciamento de cookies
└── README.md       # Este arquivo
```

## 🚀 Como Usar

### 1. **Abrir o projeto**
   - Abra o arquivo `index.html` em seu navegador
   - Ou use um servidor local (recomendado)

### 2. **Usar um servidor local** (opcional)
   ```bash
   # Com Python 3
   python -m http.server 8000
   
   # Com Python 2
   python -m SimpleHTTPServer 8000
   
   # Com Node.js (http-server)
   npx http-server
   ```

## 🎯 Funcionalidades Implementadas

### 1️⃣ **Criar um Cookie**
- Digite o nome e valor do cookie
- Defina a validade em dias
- O cookie será armazenado no navegador

**Código-chave:**
```javascript
document.cookie = "nome=valor; expires=data; path=/";
```

### 2️⃣ **Visualizar Todos os Cookies**
- Veja todos os cookies salvos
- Mostra nome e valor de cada cookie

**Código-chave:**
```javascript
const cookies = document.cookie.split(';');
```

### 3️⃣ **Buscar um Cookie Específico**
- Procura o valor de um cookie pelo nome
- Retorna o valor ou mensagem de não encontrado

**Código-chave:**
```javascript
function obterCookie(nome) {
    const nomeCookie = nome + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].trim().indexOf(nomeCookie) === 0) {
            return decodeURIComponent(cookies[i].substring(nomeCookie.length));
        }
    }
    return null;
}
```

### 4️⃣ **Deletar um Cookie**
- Remove um cookie específico
- Definindo data de expiração no passado

**Código-chave:**
```javascript
document.cookie = "nome=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
```

### 5️⃣ **Limpar Todos os Cookies**
- Deleta todos os cookies do domínio
- Requer confirmação do usuário

## 📚 Conceitos Importantes

### O que é um Cookie?
Um cookie é um pequeno arquivo de dados armazenado no navegador que persiste entre sessões. Usado para:
- Manter usuários logados
- Armazenar preferências (tema, idioma)
- Rastrear comportamento do usuário
- Carrinho de compras
- Publicidade direcionada

### Estrutura Completa de um Cookie
```javascript
document.cookie = "nome=valor; expires=data; path=/; domain=.exemplo.com; secure; samesite=Strict";
```

| Atributo | Descrição |
|----------|-----------|
| **nome=valor** | Os dados do cookie |
| **expires** | Data de expiração (formato UTC) |
| **path** | Caminho onde o cookie é acessível (padrão: /) |
| **domain** | Domínio onde o cookie é acessível |
| **secure** | Apenas em conexões HTTPS |
| **samesite** | Proteção contra CSRF (Strict, Lax, None) |

### Tipos de Cookies

#### Cookies de Sessão
```javascript
// Sem expires - deletado ao fechar navegador
document.cookie = "sessionID=abc123";
```

#### Cookies Persistentes
```javascript
// Com expires - persiste além da sessão
const data = new Date();
data.setFullYear(data.getFullYear() + 1);
document.cookie = "preferencias=tema:escuro; expires=" + data.toUTCString();
```

#### Cookies de Terceiros
```javascript
// Domínio diferente - usado por scripts de terceiros
// Exemplo: Google Analytics
```

## 🔒 Segurança

### ✅ Boas Práticas
- ✅ Use `HTTPS` com a flag `secure`
- ✅ Use `HttpOnly` (apenas servidor pode acessar)
- ✅ Use `SameSite` contra CSRF
- ✅ Encode valores especiais
- ✅ Defina expiração apropriada
- ✅ Avise usuários sobre cookies (LGPD/GDPR)

### ❌ Evite
- ❌ Armazenar senhas
- ❌ Armazenar tokens sem proteção
- ❌ Usar dados não-codificados
- ❌ Cookies sem expiração
- ❌ Dados muito grandes

## 📝 Exemplos de Código

### Salvar Preferência de Tema
```javascript
function salvarTema(tema) {
    // Válido por 1 ano
    criarCookie("tema", tema, 365);
}

// Recuperar tema ao carregar
const meuTema = obterCookie("tema") || "claro";
```

### Carrinho de Compras Simples
```javascript
function adicionarAoCarrinho(produtoId) {
    const carrinho = obterCookie("carrinho") || "[]";
    const itens = JSON.parse(carrinho);
    itens.push(produtoId);
    criarCookie("carrinho", JSON.stringify(itens), 7);
}
```

### Rastrear Última Visita
```javascript
// Ao carregar página
const ultimaVisita = obterCookie("ultima_visita");
console.log("Última visita:", ultimaVisita);

// Salvar visita atual
criarCookie("ultima_visita", new Date().toLocaleString(), 365);
```

## 🔄 Alternativas Modernas

| Tecnologia | Limite | Persistência | Acesso |
|-----------|--------|--------------|--------|
| **Cookie** | 4KB | Configurável | Client + Server |
| **LocalStorage** | 5-10MB | Permanente | Client only |
| **SessionStorage** | 5-10MB | Sessão | Client only |
| **IndexedDB** | 50MB+ | Permanente | Client only |

### Exemplo com LocalStorage
```javascript
// Salvar
localStorage.setItem("usuario", "João");

// Recuperar
const usuario = localStorage.getItem("usuario");

// Deletar
localStorage.removeItem("usuario");
```

## 🧪 Testando no Navegador

### No DevTools (F12)
```javascript
// Ver todos os cookies
document.cookie

// Criar cookie
document.cookie = "teste=123; path=/";

// Ver em Application > Cookies
```

## 📖 Referências Úteis

- [MDN Web Docs - Cookies](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Cookies)
- [RFC 6265 - HTTP State Management Mechanism](https://tools.ietf.org/html/rfc6265)
- [OWASP - Cookie Security](https://owasp.org/www-community/attacks/csrf)

## 🎓 Exercícios Propostos

1. **Contador de Visitas**: Crie um cookie que conta quantas vezes o usuário visitou
2. **Preferências do Usuário**: Salve tema, idioma e tamanho de fonte
3. **Carrinho de Compras**: Implemente um carrinho persistente com cookies
4. **Bloqueador de Pop-ups**: Salve um cookie para mostrar pop-up apenas uma vez
5. **Contador Regressivo**: Use cookie para rastrear tempo entre visitas

## 📋 Checklist de Aprendizado

- [ ] Entendi como criar um cookie
- [ ] Sei como ler um valor de cookie
- [ ] Consigo deletar um cookie
- [ ] Entendo a estrutura completa de um cookie
- [ ] Sei as diferenças entre Cookie, LocalStorage e SessionStorage
- [ ] Entendo as implicações de segurança
- [ ] Consigo usar cookies em uma aplicação real

## 🐛 Troubleshooting

### Cookies não estão sendo salvos
- Verifique se o navegador não está em modo privado
- Cookies podem estar desativados nas configurações
- Alguns navegadores têm políticas de rejeição automática

### Erro de Domain ou Path
- Use `path=/` para aceitar todos os caminhos
- O `domain` só funciona com subdomínios autênticos

### Caracteres especiais não funcionam
- Use `encodeURIComponent()` para codificar
- Use `decodeURIComponent()` para decodificar

## 📄 Licença

Este projeto é educacional e pode ser usado livremente.

---

**Criado para fins educacionais** 🎓