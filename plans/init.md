# Plano: CLI dfl-components (estilo shadcn/ui)

## Resumo
Criar uma CLI `dfl-components` para distribuir componentes do DevFellowship via GitHub.

**Uso:** `npx dfl-components add button`

## Decisões
- **Nome:** `dfl-components`
- **Estrutura:** Monorepo (CLI + registry no mesmo repo)
- **Visibilidade:** Repositório público (sem autenticação)
- **Features iniciais:** `init` + `add`

---

## Estrutura Final

```
/dfl-components-cli
├── /registry                    # Componentes para distribuição
│   ├── registry.json            # Índice de componentes
│   ├── /components
│   │   ├── button.json
│   │   ├── card.json
│   │   └── input.json
│   ├── /hooks
│   │   └── use-hybrid-auth.json
│   ├── /providers
│   │   ├── auth-provider.json
│   │   └── feature-flag-provider.json
│   └── /pages
│       └── auth-pages.json
├── /packages/cli                # Pacote CLI para npm
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   └── /src
│       ├── index.ts
│       ├── /commands
│       │   ├── init.ts
│       │   └── add.ts
│       └── /utils
│           ├── get-config.ts
│           ├── get-registry.ts
│           └── logger.ts
└── /scripts
    └── migrate-to-registry.ts   # Script de migração
```

---

## Passos de Implementação

### Fase 0: Setup
1. **Copiar plano para `/plans/init.md`** no repositório

### Fase 1: Estrutura do Registry

1. **Criar `/registry/registry.json`**
   - Índice com todos os componentes disponíveis
   - Formato compatível com shadcn (name, type, description, files, registryDependencies)

2. **Criar JSONs individuais de componentes**
   - Cada componente tem seu JSON com código embutido
   - Ex: `/registry/components/button.json`

3. **Criar script de migração** (`/scripts/migrate-to-registry.ts`)
   - Converte `src/data/mockComponents.ts` para formato registry
   - Extrai dependências entre componentes

### Fase 2: CLI Package

4. **Criar `/packages/cli/package.json`**
```json
{
  "name": "dfl-components",
  "bin": { "dfl-components": "./dist/index.js" },
  "dependencies": {
    "commander": "^12.0.0",
    "prompts": "^2.4.2",
    "chalk": "^5.3.0",
    "ora": "^8.0.1",
    "fs-extra": "^11.2.0",
    "node-fetch": "^3.3.2",
    "cosmiconfig": "^9.0.0",
    "zod": "^3.23.8"
  }
}
```

5. **Implementar comando `init`** (`/packages/cli/src/commands/init.ts`)
   - Pergunta paths de instalação (components, hooks, providers, pages)
   - Cria `dfl-components.json` no projeto do usuário

6. **Implementar comando `add`** (`/packages/cli/src/commands/add.ts`)
   - Busca registry.json do GitHub raw
   - Resolve dependências recursivamente
   - Baixa e escreve arquivos no projeto

### Fase 3: Integração

7. **Configurar monorepo** (atualizar root `package.json`)
```json
{
  "workspaces": ["packages/*"],
  "scripts": {
    "build:cli": "npm run build -w packages/cli"
  }
}
```

8. **Testar localmente**
   - `npm link` no packages/cli
   - Testar em projeto de teste

9. **Publicar no npm**
   - `npm publish` do packages/cli

---

## Arquivos a Modificar/Criar

| Arquivo | Ação |
|---------|------|
| `/registry/registry.json` | Criar |
| `/registry/components/*.json` | Criar (7 componentes) |
| `/packages/cli/package.json` | Criar |
| `/packages/cli/src/index.ts` | Criar |
| `/packages/cli/src/commands/init.ts` | Criar |
| `/packages/cli/src/commands/add.ts` | Criar |
| `/packages/cli/src/utils/*.ts` | Criar |
| `/scripts/migrate-to-registry.ts` | Criar |
| `/package.json` (root) | Modificar (adicionar workspaces) |

---

## Formato do dfl-components.json (criado pelo `init`)

```json
{
  "typescript": true,
  "aliases": {
    "components": "@/components/dfl",
    "hooks": "@/hooks",
    "providers": "@/providers",
    "pages": "@/pages"
  },
  "registry": "https://raw.githubusercontent.com/[usuario]/dfl-components-cli/main/registry"
}
```

---

## Formato de Componente no Registry

```json
{
  "name": "button",
  "type": "registry:component",
  "title": "Button",
  "description": "Reusable button component",
  "category": "UI",
  "version": "1.2.0",
  "tags": ["button", "form"],
  "registryDependencies": [],
  "files": [
    {
      "path": "button.tsx",
      "type": "registry:component",
      "content": "// código do componente aqui"
    }
  ]
}
```

---

## URLs do GitHub Raw

```
https://raw.githubusercontent.com/[usuario]/dfl-components-cli/main/registry/registry.json
https://raw.githubusercontent.com/[usuario]/dfl-components-cli/main/registry/components/button.json
```

---

## Arquivos de Referência

- `src/data/mockComponents.ts` - Dados atuais dos componentes
- `src/types/component.ts` - Interface Component
- `components.json` - Referência do formato shadcn
