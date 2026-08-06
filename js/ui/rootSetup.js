/* =========================================================
   UI - ROOT SETUP
   Responsável por: exibir a tela inicial obrigatória de
   cadastro do nó raiz, antes de liberar o restante da UI.
   RF00 (reutiliza validação de nome único - RF02)
========================================================= */

window.UI = window.UI || {};

UI.RootSetup = (function () {

  /**
   * Renderiza a tela de configuração do nó raiz dentro de #app.
   * @param {object} state - Estado atual da aplicação.
   * @param {function} onComplete - Callback chamado após o nó raiz ser definido com sucesso.
   */
  function render(state, onComplete) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    const overlay = document.createElement('div');
    overlay.className = 'root-setup-overlay';

    const card = document.createElement('div');
    card.className = 'root-setup-card';

    card.innerHTML =
      '<h2>Configuração Inicial</h2>' +
      '<p class="hint-text">Antes de continuar, cadastre o nó raiz da aplicação (ex: Journal.Solution.App).</p>' +
      '<label for="root-name">Nome do nó raiz</label>' +
      '<input type="text" id="root-name" placeholder="Ex: Journal.Solution.App" />' +
      '<label for="root-path">Caminho absoluto</label>' +
      '<input type="text" id="root-path" placeholder="Ex: C:\\repos\\journal-solution-app" />' +
      '<div class="error-message" id="root-error"></div>' +
      '<button id="root-setup-confirm">Confirmar</button>';

    overlay.appendChild(card);
    app.appendChild(overlay);

    const nameInput = document.getElementById('root-name');
    const pathInput = document.getElementById('root-path');
    const errorEl = document.getElementById('root-error');
    const confirmBtn = document.getElementById('root-setup-confirm');

    function handleConfirm() {
      const name = nameInput.value.trim();
      const path = pathInput.value.trim();
      errorEl.textContent = '';

      if (!name || !path) {
        errorEl.textContent = 'Preencha nome e caminho antes de continuar.';
        return;
      }

      if (Core.State.nameExists(state, name)) {
        errorEl.textContent = 'Já existe um nó cadastrado com esse nome.';
        return;
      }

      Core.State.setRoot(state, name, path);

      if (typeof onComplete === 'function') {
        onComplete(state);
      }
    }

    confirmBtn.addEventListener('click', handleConfirm);

    // Permite confirmar pressionando Enter em qualquer um dos campos
    [nameInput, pathInput].forEach(function (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          handleConfirm();
        }
      });
    });

    nameInput.focus();
  }

  return {
    render: render
  };

})();