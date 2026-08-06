/* =========================================================
   MAIN
   Ponto de entrada da aplicação. Responsável por:
   - Carregar o estado inicial
   - Decidir entre tela de cadastro do nó raiz (RF00) ou
     tela principal (árvore + controles)
   - Orquestrar re-renderizações via callback onChange
========================================================= */

(function () {

  let state = Core.State.loadState();

  function renderApp() {
    if (!state.root) {
      // RF00: nó raiz ainda não definido, exibe tela obrigatória
      UI.RootSetup.render(state, function (updatedState) {
        state = updatedState;
        renderApp();
      });
      return;
    }

    // Nó raiz já definido: exibe layout principal (árvore + controles)
    const app = document.getElementById('app');
    app.innerHTML = '';

    const layout = document.createElement('div');
    layout.className = 'main-layout';

    const leftPanel = document.createElement('div');
    leftPanel.className = 'panel panel-left';
    const leftTitle = document.createElement('h2');
    leftTitle.textContent = 'Árvore de Dependências';
    leftPanel.appendChild(leftTitle);

    const treeContainer = document.createElement('div');
    treeContainer.id = 'tree-container';
    leftPanel.appendChild(treeContainer);

    const rightPanel = document.createElement('div');
    rightPanel.className = 'panel panel-right';
    rightPanel.id = 'controls-container';

    layout.appendChild(leftPanel);
    layout.appendChild(rightPanel);

    app.appendChild(layout);

    function onChange() {
      UI.Tree.render(treeContainer, state, onChange);
      UI.Controls.render(rightPanel, state, onChange);
    }

    onChange();
  }

  document.addEventListener('DOMContentLoaded', renderApp);

})();