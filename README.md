# Pet-Matching

Este repositório contém a interface web do projeto Pet-Matching, feita com Next.js.

## Estrutura do projeto

- `src/app/` — Páginas e rotas do Next.js (App Router)
- `src/components/` — Componentes React reutilizáveis (auth, dashboard, layout, pets, ui)
- `src/services/` — Cliente HTTP tipado e serviços de negócio (animal, application, auth, questionnaire)
- `src/types/` — Definições TypeScript (animal, application, auth, questionnaire)
- `src/app/globals.css` — Estilos globais

## Pré-requisitos

- Node.js 18.x (o projeto foi validado com `v18.19.1`).
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

**Arquitetura**

O projeto foi refatorado para **não utilizar aliases TypeScript** (`@/...`). Todos os imports agora usam **caminhos relativos**:

```typescript
// ✅ Correto (relativo)
import { AppShell } from '../../components/layout/AppShell';
import type { AnimalResponse } from '../types/animal';

// ❌ Evitar (alias removido)
// import { AppShell } from '@/components/layout/AppShell';
```

Isso elimina a dependência de `baseUrl` e `paths` no `tsconfig.json`, evitando problemas de compatibilidade futura com TypeScript 7.0+.

**Observações**

- Os scripts disponíveis estão em [package.json](package.json).
- O projeto não usa mais alias `@/` no TypeScript; os imports foram convertidos para caminhos relativos.
- O build foi validado com sucesso após essa limpeza.
- Se você modificar dependências, confirme a instalação limpa removendo `node_modules` e lockfile (`package-lock.json`) antes de rodar `npm install` novamente:

```bash
rm -rf node_modules package-lock.json
npm install
```

Se quiser, posso adicionar um arquivo `.nvmrc` com a versão recomendada do Node ou ajustar o `package.json` com engines específicas.
