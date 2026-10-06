# FIO — guarde o fio para depois

Protótipo web funcional do App 2.

## Conceito

O FIO é uma memória externa para não perder o fio de uma tarefa. A pessoa cria uma tarefa, divide em etapas, trabalha, registra onde parou e depois volta exatamente ao ponto necessário.

## Arquitetura

- HTML/CSS/JavaScript puro
- Sem backend
- Sem login
- Sem banco de dados externo
- Dados no `localStorage` do navegador
- Exportação/importação em JSON
- PWA com service worker
- Pronto para publicação na Vercel

## Rodar localmente

Abra `index.html` para uma prévia simples.

Para testar o modo PWA/offline de forma completa, use um servidor local, por exemplo:

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Publicar no GitHub + Vercel

1. Crie um repositório no GitHub.
2. Envie todos os arquivos desta pasta para o repositório.
3. No Vercel, escolha **Add New Project**.
4. Importe o repositório.
5. Framework Preset: **Other** (ou deixe a detecção automática).
6. Build Command: vazio.
7. Output Directory: `.`.
8. Deploy.

A Vercel passa a publicar cada alteração enviada ao GitHub.

## Dados

Os dados ficam no navegador/dispositivo da pessoa. O menu **Dados** permite exportar e importar um arquivo JSON.

Importante: limpar os dados do navegador pode apagar os dados locais. Por isso, a exportação é parte essencial do protótipo.

## Próximas evoluções

- animação de rotação da roda mais refinada
- reorganização das etapas por arrastar
- múltiplas tarefas dentro de projetos
- edição de tarefas
- histórico de pontos de parada
- confirmação de importação mais detalhada
- ícones e identidade visual próprios
- testes em Android/iOS
