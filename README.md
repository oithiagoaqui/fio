# FIO — guarde o fio para depois

Protótipo web funcional do App 2.

## Conceito

O FIO é uma memória externa para não perder o fio de uma tarefa. A pessoa cria uma tarefa, divide o caminho em etapas, trabalha, registra onde parou e depois volta exatamente ao ponto necessário.

## O que esta versão faz

- Primeiro uso começa vazio, sem tarefa de demonstração.
- Se existir um ponto de parada salvo, o FIO abre diretamente na tela **“Você estava aqui.”** na próxima abertura.
- Timeline vertical de etapas, com um elemento visual de fio/espiral.
- A timeline pode ser arrastada verticalmente para avançar ou voltar entre etapas.
- **Concluir etapa** avança o fio.
- **Parei aqui** salva o contexto para uma retomada orientada.
- **Clonar tarefa** cria uma cópia limpa da tarefa.
- **Excluir tarefa** remove a tarefa após confirmação.
- Dados locais no navegador, sem login e sem banco externo.
- Exportação e importação em JSON.
- PWA com service worker.
- Pronto para publicação na Vercel.

## Arquitetura

- HTML/CSS/JavaScript puro
- Sem backend
- Sem login
- Sem banco de dados externo
- `localStorage` para os dados
- Exportação/importação em JSON
- Service worker para recursos da aplicação

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
5. Framework Preset: **Other**.
6. Build Command: vazio.
7. Output Directory: `.`.
8. Deploy.

A Vercel passa a publicar cada alteração enviada ao GitHub.

## Dados e backup

Os dados são guardados localmente no navegador. O FIO não precisa de uma conta ou banco remoto.

Como esses dados podem ser perdidos se os dados/cache do navegador forem apagados, é recomendado exportar um backup de tempos em tempos. O arquivo gerado se chama aproximadamente:

`fio-backup-AAAA-MM-DD.json`

Normalmente ele ficará na pasta **Downloads** do computador ou celular.

## Retomada

Ao usar **Parei aqui**, o FIO salva a etapa atual, a observação e o momento da parada. Na próxima abertura, se houver uma tarefa interrompida, ela vira a primeira tela: **“Você estava aqui.”**

## Próximas evoluções

- animação da timeline/fio mais refinada
- reorganização das etapas por arrastar
- múltiplas tarefas dentro de projetos com agrupamento mais elaborado
- histórico de pontos de parada
- edição de nomes e etapas
- confirmação de importação mais detalhada
- ícones e identidade visual próprios
- testes em Android/iOS


## Usar como aplicativo no celular

O FIO é preparado como **PWA (Progressive Web App)**.

Isso significa que, depois de publicado em um endereço HTTPS:

- o navegador pode oferecer **Instalar aplicativo** / **Adicionar à tela inicial**;
- Android usa o ícone `icons/icon-512.png` / `icons/icon-192.png`;
- iPhone/iPad usa `icons/apple-touch-icon.png`;
- o nome exibido é **FIO**;
- a abertura instalada usa `display: standalone`, aproximando a experiência de um app;
- o service worker permite que a interface continue disponível offline depois de carregada;
- os dados continuam no armazenamento local do navegador/dispositivo.

### Observação importante

“Adicionar à tela inicial” não transforma o site em um aplicativo nativo. O FIO continua sendo uma aplicação web, mas passa a se comportar visualmente muito mais como um app. Para esta fase do projeto, essa é a abordagem intencional.
