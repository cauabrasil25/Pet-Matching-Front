# Pet-Matching

Este repositório contém a interface web do projeto Pet-Matching (Next.js).

**Pré-requisitos**

- Node.js (recomendado: 18.x — o projeto foi testado com `v18.19.1`). Se você receber avisos de engine, tente atualizar para Node 20.
- npm (recomendado: 9.x) ou outro gerenciador compatível.
- Git (opcional, para clonar o repositório).

Recomenda-se usar `nvm` para gerenciar versões do Node:

```bash
nvm install 18
nvm use 18
```

**Instalação**

No diretório raiz do projeto, rode:

```bash
npm install
```

Se ocorrerem erros de resolução de dependências (`ERESOLVE`), tente primeiro atualizar as dependências no `package.json`. Como alternativa temporária, use:

```bash
npm install --legacy-peer-deps
```

Se ocorrerem erros de rede (`ECONNRESET`), verifique sua conexão e proxy, e tente novamente.

**Rodando em modo desenvolvimento**

```bash
npm run dev
```

O Next.js inicia em `http://localhost:3000` por padrão.

**Build e execução em produção**

```bash
npm run build
npm run start
```

**Verificações e lint**

```bash
npm run lint
```

**Observações**

- Os scripts disponíveis estão em [package.json](package.json).
- Se você modificar dependências, confirme a instalação limpa removendo `node_modules` e lockfile (`package-lock.json`) antes de rodar `npm install` novamente:

```bash
rm -rf node_modules package-lock.json
npm install
```

Se quiser, posso adicionar um arquivo `.nvmrc` com a versão recomendada do Node ou ajustar o `package.json` com engines específicas.
