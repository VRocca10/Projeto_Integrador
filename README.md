# GestãoFit

Protótipo web de gestão de academia, desenvolvido com React, Vite e Tailwind CSS.

## Iniciar o projeto

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

## Organização do código

```text
src/
├── App.jsx
├── components/                 # Componentes compartilhados entre features
├── data/                       # Perfis, menus e dados de demonstração
├── lib/
│   └── api/                    # Cliente HTTP e configuração de integração
└── features/
    ├── admin/
    │   ├── admin.service.js    # Contratos de acesso aos endpoints administrativos
    │   ├── attendance/         # Frequência e check-ins
    │   ├── equipment/          # Equipamentos e manutenção
    │   ├── finance/            # Receitas e pagamentos
    │   ├── overview/           # Visão geral administrativa
    │   ├── settings/           # Preferências da academia
    │   ├── shared/             # Componentes compartilhados nas telas administrativas
    │   └── students/           # Cadastro e consulta de alunos
    ├── aluno/
    │   ├── data/               # Dados demonstrativos e conteúdo do aluno
    │   ├── student.service.js  # Acesso aos endpoints do aluno
    │   ├── StudentFeature.jsx  # Seleção das telas do aluno
    │   └── StudentOverview.jsx # Painel inicial do aluno
    ├── auth/                   # Login e seleção do perfil demonstrativo
    │   ├── Login.jsx
    │   └── auth.service.js     # Login, sessão e encerramento da sessão
    ├── dashboard/              # Layout compartilhado e seleção do perfil
    ├── professor/
    │   ├── data/               # Dados demonstrativos e conteúdo do professor
    │   ├── professor.service.js # Acesso aos endpoints do professor
    │   ├── ProfessorFeature.jsx
    │   └── ProfessorOverview.jsx
    └── shared/                 # Componentes compartilhados entre perfis
```

Cada perfil concentra suas próprias telas e dados. A navegação e os componentes visuais reutilizados ficam em módulos compartilhados.

## Preparação para o back-end

O front-end tem um cliente HTTP centralizado em `src/lib/api/client.js` e serviços organizados por feature. Para alternar do modo demonstrativo para a API:

1. Copie `.env.example` para `.env.local`.
2. Configure `VITE_DATA_MODE=api` e informe a URL base em `VITE_API_BASE_URL`.
3. Inicie o front-end novamente para o Vite carregar as variáveis.

O modo padrão (`VITE_DATA_MODE=mock`) preserva o login demonstrativo atual. No modo `api`, o perfil deixa de ser selecionado pelo usuário: ele é retornado pelo servidor junto com a identidade autenticada.

### Contrato inicial esperado

As rotas abaixo são uma proposta de integração para o back-end futuro; ainda não existem neste protótipo.

| Método | Rota | Uso |
| --- | --- | --- |
| `POST` | `/auth/login` | Recebe `{ "email": "...", "password": "..." }` e retorna `{ "user": { "id": "...", "name": "...", "email": "...", "role": "admin\|professor\|aluno" } }` |
| `GET` | `/auth/me` | Retorna `{ "user": { ... } }` para a sessão atual; sem sessão, responde `401` |
| `POST` | `/auth/logout` | Encerra a sessão no servidor |
| `GET` | `/admin/dashboard`, `/admin/finance`, `/admin/attendance`, `/admin/equipment`, `/admin/settings` | Dados administrativos |
| `GET`, `POST` | `/admin/students` | Consulta e cadastro de alunos |
| `PUT` | `/admin/settings` | Atualiza configurações da academia |
| `GET` | `/professor/dashboard`, `/professor/classes`, `/professor/students`, `/professor/attendance`, `/professor/schedule` | Dados do professor |
| `GET` | `/student/dashboard`, `/student/workouts`, `/student/attendance`, `/student/plan`, `/student/schedule` | Dados do aluno |

As respostas de erro devem usar JSON com `message` (ou `title`) e um status HTTP apropriado. O cliente envia cookies e credenciais nas solicitações; recomenda-se que o back-end use cookie de sessão `HttpOnly`, `Secure` e `SameSite`, além de configurar CORS e proteção CSRF de acordo com o ambiente.

Os serviços e o fluxo de autenticação já estão preparados, mas as telas ainda exibem dados demonstrativos; cada tela precisará passar a consumir o serviço correspondente quando o back-end estiver disponível. As permissões devem sempre ser validadas no servidor — esconder menus ou validar o perfil no front-end não protege endpoints.

## Publicar na Vercel

O projeto está configurado como aplicação Vite estática. Para publicar:

1. Envie o projeto para um repositório Git remoto.
2. Na Vercel, importe esse repositório e mantenha os padrões identificados pelo arquivo `vercel.json`: comando `npm run build` e diretório de saída `dist`.
3. Para publicar a demonstração do front-end antes do back-end, configure `VITE_DATA_MODE=mock` nas variáveis de ambiente do projeto Vercel.
4. A cada novo deploy, a Vercel executará o build a partir do repositório.

Quando a API estiver disponível, configure na Vercel `VITE_DATA_MODE=api` e `VITE_API_BASE_URL` com a URL HTTPS pública da API, por exemplo `https://api.exemplo.com/api`, e faça um novo deploy. Variáveis `VITE_*` são incluídas no código enviado ao navegador: não coloque nelas senhas, chaves privadas ou segredos. No modo API, o back-end também deverá permitir a origem do domínio Vercel via CORS e configurar corretamente cookies de sessão e proteção CSRF.

O arquivo `.gitignore` exclui dependências, artefatos de build e arquivos `.env` locais; apenas `.env.example` deve ser versionado. A reescrita configurada na Vercel encaminha URLs da aplicação para `index.html`, permitindo adicionar rotas de front-end sem erro de página não encontrada.
