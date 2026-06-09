# 📖 Guia Rápido de Referência - Cookies

## 🎯 Operações Básicas

### ✏️ Criar um Cookie
```javascript
// Simples (sessão)
document.cookie = "usuario=João";

// Com expiração
const data = new Date();
data.setDate(data.getDate() + 7); // 7 dias
document.cookie = `usuario=João;expires=${data.toUTCString()}`;

// Com todas as opções
document.cookie = `usuario=João;expires=${data.toUTCString()};path=/;domain=.exemplo.com;secure;samesite=Strict`;
```

### 📖 Ler um Cookie
```javascript
// Ver todos
console.log(document.cookie);

// Buscar específico
function obterCookie(nome) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === nome) return decodeURIComponent(value);
    }
    return null;
}

// Usar
console.log(obterCookie("usuario")); // João
```

### 🗑️ Deletar um Cookie
```javascript
// Método: definir data no passado
document.cookie = "usuario=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";

// Ou função auxiliar
function deletarCookie(nome) {
    document.cookie = `${nome}=;expires=${new Date(0).toUTCString()};path=/;`;
}

deletarCookie("usuario");
```

---

## 🔄 Comparação: Cookie vs LocalStorage vs SessionStorage

| Aspecto | Cookie | LocalStorage | SessionStorage |
|---------|--------|--------------|----------------|
| **Tamanho** | ~4KB | 5-10MB | 5-10MB |
| **Expiração** | Manual | Nunca | Fecha aba |
| **Domínio** | Servidor acessa | Apenas cliente | Apenas cliente |
| **Segurança** | HttpOnly (seguro) | XSS vulnerável | XSS vulnerável |
| **Uso** | Autenticação | Preferências | Dados temporários |

### 📊 Tabela de Comparação
```
┌─────────────┬────────────────┬─────────────┬────────────────┐
│ Operação    │ Cookie         │ LocalStorage│ SessionStorage │
├─────────────┼────────────────┼─────────────┼────────────────┤
│ Salvar      │ document.cookie│ setItem()   │ setItem()      │
│ Ler         │ document.cookie│ getItem()   │ getItem()      │
│ Deletar     │ expires=past   │ removeItem()│ removeItem()   │
│ Limpar tudo │ loop delete    │ clear()     │ clear()        │
└─────────────┴────────────────┴─────────────┴────────────────┘
```

---

## 💾 LocalStorage (Alternativa Moderna)

```javascript
// Salvar
localStorage.setItem("usuario", "João");
localStorage.setItem("tema", JSON.stringify({ cor: "escuro" }));

// Ler
const usuario = localStorage.getItem("usuario");
const tema = JSON.parse(localStorage.getItem("tema"));

// Deletar específico
localStorage.removeItem("usuario");

// Limpar tudo
localStorage.clear();

// Obter todas as chaves
for (let i = 0; i < localStorage.length; i++) {
    console.log(localStorage.key(i));
}
```

---

## 🔐 Segurança - Boas Práticas

### ✅ FAÇA

```javascript
// 1. Codifique valores especiais
const email = "user@email.com";
document.cookie = `email=${encodeURIComponent(email)}`;

// 2. Sempre defina expiração
const data = new Date();
data.setDate(data.getDate() + 30);
document.cookie = `token=xyz;expires=${data.toUTCString()}`;

// 3. Use path específico
document.cookie = "preferencias=xyz;path=/conta/";

// 4. Use secure + samesite em produção
document.cookie = "token=xyz;secure;samesite=Strict";

// 5. Valide dados
if (obterCookie("usuario") === "admin") {
    // ...
}
```

### ❌ EVITE

```javascript
// ❌ Armazenar senhas
document.cookie = "senha=minha_senha_123";

// ❌ Dados muito grandes
const dadosGrandes = Array(5000).fill("texto");
document.cookie = `dados=${dadosGrandes}`;

// ❌ Sem expiração
document.cookie = "persistente=true"; // Nunca expira

// ❌ Valores não-codificados
document.cookie = `email=${email}`; // Se email tiver &;= quebra

// ❌ Sem HttpOnly (no servidor)
// Sempre use HttpOnly quando possível
```

---

## 🛠️ Padrões Úteis

### Padrão 1: Gerenciador de Cookies
```javascript
const Cookies = {
    set: (nome, valor, dias = 7) => {
        const data = new Date();
        data.setDate(data.getDate() + dias);
        document.cookie = `${nome}=${encodeURIComponent(valor)};expires=${data.toUTCString()};path=/`;
    },
    
    get: (nome) => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [key, value] = cookie.trim().split('=');
            if (key === nome) return decodeURIComponent(value);
        }
        return null;
    },
    
    delete: (nome) => {
        document.cookie = `${nome}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    },
    
    getAll: () => {
        const result = {};
        document.cookie.split(';').forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            if (key) result[key] = decodeURIComponent(value);
        });
        return result;
    }
};

// Usar
Cookies.set("usuario", "João", 30);
console.log(Cookies.get("usuario")); // João
Cookies.delete("usuario");
```

### Padrão 2: Dados Estruturados
```javascript
// Salvar objeto em cookie
const usuario = { nome: "João", id: 123 };
Cookies.set("usuario", JSON.stringify(usuario));

// Recuperar objeto
const usuarioRecuperado = JSON.parse(Cookies.get("usuario"));
console.log(usuarioRecuperado.nome); // João
```

### Padrão 3: Contador com Cookie
```javascript
function incrementarVisitas() {
    let visitas = parseInt(Cookies.get("visitas") || 0);
    visitas++;
    Cookies.set("visitas", visitas, 365);
    return visitas;
}

// Usar
console.log(incrementarVisitas()); // 1
console.log(incrementarVisitas()); // 2
```

### Padrão 4: Cache com Validade
```javascript
function cacheComValidade(chave, valor, minutosValidade) {
    const dados = {
        valor: valor,
        expiraEm: Date.now() + (minutosValidade * 60 * 1000)
    };
    localStorage.setItem(chave, JSON.stringify(dados));
}

function obterDoCache(chave) {
    const dados = JSON.parse(localStorage.getItem(chave));
    if (!dados) return null;
    
    if (dados.expiraEm < Date.now()) {
        localStorage.removeItem(chave);
        return null;
    }
    
    return dados.valor;
}

// Usar
cacheComValidade("resultado_api", { dados: [1,2,3] }, 30);
console.log(obterDoCache("resultado_api")); // { dados: [1,2,3] }
```

---

## 🧪 Testar no Console (DevTools - F12)

```javascript
// Ver todos os cookies
document.cookie

// Criar
document.cookie = "teste=123;path=/"

// Buscar
document.cookie.split(';').find(c => c.includes('teste'))

// Deletar
document.cookie = "teste=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;"

// LocalStorage
localStorage.setItem("chave", "valor")
localStorage.getItem("chave")
localStorage.removeItem("chave")

// Ver no navegador
// Chrome/Edge: DevTools > Application > Cookies
// Firefox: Storage tab > Cookies
```

---

## 📋 Atributos de Cookie Explicados

```javascript
document.cookie = "nome=valor; atributo1=valor1; atributo2=valor2";
```

| Atributo | Exemplo | Significado |
|----------|---------|------------|
| **expires** | `expires=Wed, 21 Oct 2025 07:28:00 GMT` | Data de expiração UTC |
| **max-age** | `max-age=3600` | Segundos até expiração (sobrescreve expires) |
| **path** | `path=/` | Caminho onde cookie é acessível |
| **domain** | `domain=.exemplo.com` | Domínio onde cookie é acessível |
| **secure** | `secure` | Apenas em HTTPS |
| **samesite** | `samesite=Strict` | Proteção CSRF (Strict, Lax, None) |
| **httponly** | `httponly` | Não acessível via JavaScript (servidor) |

---

## ⚡ Casos de Uso Comuns

### 1️⃣ Lembrar Login do Usuário
```javascript
// Login
Cookies.set("usuario_id", "123", 30);
Cookies.set("usuario_email", "user@example.com", 30);

// Verificar ao carregar página
if (Cookies.get("usuario_id")) {
    console.log("Usuário já estava logado");
}
```

### 2️⃣ Preferência de Tema
```javascript
// Salvar preferência
Cookies.set("tema", "escuro", 365);

// Ao carregar, aplicar tema
const tema = Cookies.get("tema") || "claro";
document.body.className = `tema-${tema}`;
```

### 3️⃣ Carrinho de Compras
```javascript
const carrinho = {
    produtos: [
        { id: 1, nome: "Notebook", preco: 3000, qtd: 1 },
        { id: 2, nome: "Mouse", preco: 50, qtd: 2 }
    ]
};

Cookies.set("carrinho", JSON.stringify(carrinho), 7);
```

### 4️⃣ Contador de Visitas
```javascript
const visitas = (parseInt(Cookies.get("visitas")) || 0) + 1;
Cookies.set("visitas", visitas, 365);
console.log(`Você já visitou ${visitas} vezes`);
```

### 5️⃣ Avisos Mostrados Uma Única Vez
```javascript
const avisoShown = Cookies.get("aviso_politica_exibido");
if (!avisoShown) {
    mostrarAviso();
    Cookies.set("aviso_politica_exibido", "true", 365);
}
```

---

## 🚀 Performance

### Dicas de Otimização
- ✅ Mantenha cookies pequenos (<4KB)
- ✅ Use apenas quando necessário persistir entre páginas
- ✅ Para dados grandes, use IndexedDB
- ✅ Limpe cookies expirados periodicamente
- ✅ Use gzip para transmissão de cookies

### Benchmark
```javascript
// Velocidade relativa
LocalStorage:    ████████ (Muito rápido)
Cookies:        ██████   (Rápido)
IndexedDB:      ██       (Mais lento, mas potente)
SessionStorage: ████████ (Muito rápido)
```

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Cookie não salva | Modo privado ativo? Cookies desativados? |
| Valor não aparece | Use `encodeURIComponent()` |
| Não funciona em HTTPS | Adicione `secure;samesite=Strict` |
| Acessível de outro site | Evite sem domínio específico |
| Caracteres estranhos | Decodifique com `decodeURIComponent()` |

---

## 📚 Referências Rápidas

- **MDN Cookies**: https://developer.mozilla.org/docs/Web/HTTP/Cookies
- **RFC 6265**: https://tools.ietf.org/html/rfc6265
- **OWASP Cookie**: https://cheatsheetseries.owasp.org/cheatsheets/Cookie_Security_Cheat_Sheet.html

---

**Criado como referência rápida e prática para desenvolvimento com cookies** 🍪
