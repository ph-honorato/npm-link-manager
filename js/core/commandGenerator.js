/* =========================================================
   CORE - COMMAND GENERATOR
   Responsável por: gerar os comandos de cada nó e montar
   o conteúdo final do arquivo .bat.
   RF14, RF15, RF16, RF18, RF20, RF22, RF23
========================================================= */

window.Core = window.Core || {};

Core.CommandGenerator = (function () {

  /**
   * Gera o bloco de comandos para um único nó.
   */
  function buildNodeCommands(state, nodeId) {
    const node = Core.State.getNodeById(state, nodeId);
    const isRoot = Core.Graph.isRoot(nodeId);
    const dependencyIds = Core.Graph.getDirectDependencies(state, nodeId);

    const lines = [];

    // RF23: mensagem customizada indicando o nó em processamento
    lines.push('echo ===================================');
    lines.push('echo Processando: ' + node.name);
    lines.push('echo ===================================');

    // Navega ate o diretorio do artefato
    lines.push('cd /d "' + node.path + '"');

    // RF15/RF16: limpeza + install condicional (checkbox "Limpar Ambiente")
    if (state.cleanEnvironment) {
      lines.push('echo Limpando node_modules e dist...');
      lines.push('if exist node_modules rmdir /s /q node_modules');
      lines.push('if exist dist rmdir /s /q dist');
      lines.push('call npm install');
    }

    // RF18: link unico com todos os caminhos das dependencias diretas
    if (dependencyIds.length > 0) {
      const depPaths = dependencyIds.map(function (depId) {
        const depNode = Core.State.getNodeById(state, depId);
        return '"' + depNode.path + '"';
      });
      lines.push('call npm link ' + depPaths.join(' '));
    }

    // RF18: build para nos nao-raiz, start para o no raiz
    if (isRoot) {
      lines.push('call npm start');
    } else {
      lines.push('call npm run build');
    }

    lines.push(''); // linha em branco para separar visualmente os blocos

    return lines;
  }

  /**
   * Monta o conteudo completo do arquivo .bat, percorrendo a ordem
   * de execucao calculada pelo Core.Graph.
   */
  function generateBatContent(state) {
    const executionOrder = Core.Graph.getExecutionOrder(state);

    // RF22: NAO incluir "@echo off", para que os comandos apareçam no terminal
    const lines = [];

    lines.push('echo Iniciando orquestrador de links locais...');
    lines.push('');

    executionOrder.forEach(function (nodeId) {
      const nodeLines = buildNodeCommands(state, nodeId);
      lines.push.apply(lines, nodeLines);
    });

    lines.push('echo Processo finalizado.');
    lines.push('pause');

    return lines.join('\r\n');
  }

  /**
   * Dispara o download do arquivo .bat gerado, no navegador.
   */
  function downloadBatFile(content, fileName) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'setup-links.bat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return {
    buildNodeCommands: buildNodeCommands,
    generateBatContent: generateBatContent,
    downloadBatFile: downloadBatFile
  };

})();