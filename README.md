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

🚧 Em desenvolvimento — MVP funcional (V1).