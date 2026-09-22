# Orquestrador de Links Locais

Ferramenta web local (sem instalação, sem servidor) para automatizar a configuração
de ambiente de desenvolvimento em projetos com múltiplos artefatos/repositórios
que dependem de `npm link` para funcionar corretamente.

## Como funciona

1. Cadastre os artefatos (nós) do seu ambiente, informando nome e caminho local
2. Monte a árvore de dependências entre eles
3. Gere um script `.bat` com todos os comandos na ordem correta
4. Execute o script para configurar o ambiente automaticamente

## Como usar

1. Clone este repositório
2. Abra o arquivo `index.html` diretamente no navegador (Chrome)
3. Cadastre o nó raiz e os demais artefatos
4. Monte a árvore de dependências
5. Clique em "Gerar Script (.bat)" e execute o arquivo baixado

> ⚠️ **Atenção**: dependendo das configurações de segurança da máquina, pode não
> ser possível executar o arquivo `.bat` diretamente com duplo clique. Nesse caso,
> abra o **Prompt de Comando (CMD)**, navegue até a pasta onde o arquivo foi
> baixado e execute-o manualmente digitando o nome do arquivo (ex: `setup-links.bat`).

## Status

✅ Finalizado — MVP funcional (V1).

---

# Local Link Orchestrator

Local web tool (no installation, no server required) for automating development environment setup in projects with multiple artifacts/repositories that depend on `npm link` to work properly.

## How It Works

1. Register the artifacts (nodes) in your environment, providing their names and local paths
2. Build the dependency tree between them
3. Generate a `.bat` script with all commands in the correct order
4. Run the script to configure the environment automatically

## How to Use

1. Clone this repository
2. Open the `index.html` file directly in your browser (Chrome)
3. Register the root node and the other artifacts
4. Build the dependency tree
5. Click **"Generate Script (.bat)"** and run the downloaded file

> ⚠️ **Warning**: depending on your machine's security settings, you may not be able to run the `.bat` file directly by double-clicking it. In this case, open **Command Prompt (CMD)**, navigate to the folder where the file was downloaded, and run it manually by entering the file name (e.g., `setup-links.bat`).

## Status

✅ Completed — Functional MVP (V1).
