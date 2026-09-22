/* =========================================================
   UI - CONTROLS
   Responsável por: cadastro de nós avulsos, checkbox
   "Limpar Ambiente" e botão de gerar/baixar o script .bat.
   RF01, RF02, RF14, RF15, RF16, RF20, RF21, RNF04
========================================================= */

window.UI = window.UI || {};

UI.Controls = (function () {

  /**
   * Renderiza a seção de cadastro de nó avulso.
   */
  function renderNodeRegistration(container, state, onChange) {
    const section = document.createElement('div');
    section.className = 'section';

    section.innerHTML =
      '<h3>Cadastrar Nó</h3>' +
      '<label for="new-node-name">Nome</label>' +
      '<input type="text" id="new-node-name" placeholder="Ex: journal.task.ui" />' +
      '<label for="new-node-path">Caminho absoluto</label>' +
      '<input type="text" id="new-node-path" placeholder="Ex: C:\\repos\\journal.task.ui" />' +
      '<div class="error-message" id="new-node-error"></div>' +
      '<button id="add-node-btn">+ Adicionar Nó</button>';

    container.appendChild(section);

    const nameInput = section.querySelector('#new-node-name');
    const pathInput = section.querySelector('#new-node-path');
    const errorEl = section.querySelector('#new-node-error');
    const addBtn = section.querySelector('#add-node-btn');

    function handleAdd() {
      const name = nameInput.value.trim();
      const path = pathInput.value.trim();
      errorEl.textContent = '';

      if (!name || !path) {
        errorEl.textContent = 'Preencha nome e caminho antes de adicionar.';
        return;
      }

      // RF02: impedir nome duplicado (considerando raiz + demais nós)
      if (Core.State.nameExists(state, name)) {
        errorEl.textContent = 'Já existe um nó cadastrado com esse nome.';
        return;
      }

      Core.State.addNode(state, name, path);

      nameInput.value = '';
      pathInput.value = '';
      nameInput.focus();

      onChange();
    }

    addBtn.addEventListener('click', handleAdd);

    [nameInput, pathInput].forEach(function (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          handleAdd();
        }
      });
    });
  }

  /**
   * Renderiza a lista simples de nós cadastrados (referência visual
   * para o usuário saber o que já existe, além da árvore).
   */
  function renderNodesPool(container, state) {
    const section = document.createElement('div');
    section.className = 'section';

    const title = document.createElement('h3');
    title.textContent = 'Nós Cadastrados';
    section.appendChild(title);

    if (state.nodes.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-text';
      empty.textContent = 'Nenhum nó cadastrado ainda.';
      section.appendChild(empty);
    } else {
      const list = document.createElement('ul');
      list.className = 'nodes-pool';

      state.nodes.forEach(function (node) {
        const item = document.createElement('li');
        item.innerHTML =
          '<div>' + node.name + '</div>' +
          '<div class="path-text">' + node.path + '</div>';
        list.appendChild(item);
      });

      section.appendChild(list);
    }

    container.appendChild(section);
  }

  /**
   * Renderiza informações do nó raiz (somente leitura nesta versão).
   */
  function renderRootInfo(container, state) {
    const section = document.createElement('div');
    section.className = 'section';

    const title = document.createElement('h3');
    title.textContent = 'Nó Raiz';
    section.appendChild(title);

    const info = document.createElement('div');
    info.className = 'root-info';
    info.innerHTML =
      '<div><strong>' + state.root.name + '</strong></div>' +
      '<div class="path-text">' + state.root.path + '</div>';

    section.appendChild(info);
    container.appendChild(section);
  }

  /**
   * Renderiza o checkbox "Limpar Ambiente" (RF14).
   */
  function renderCleanEnvironmentToggle(container, state, onChange) {
    const section = document.createElement('div');
    section.className = 'section';

    const label = document.createElement('label');
    label.className = 'checkbox-label';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!state.cleanEnvironment;

    checkbox.addEventListener('change', function () {
      Core.State.setCleanEnvironment(state, checkbox.checked);
      onChange();
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode('Limpar Ambiente (remove node_modules/dist e reinstala)'));

    section.appendChild(label);
    container.appendChild(section);
  }

  /**
   * Renderiza o botão principal de geração do script (.bat).
   * RF20, RF21, RNF04 (loading + disable durante processamento).
   */
  function renderGenerateButton(container, state) {
    const section = document.createElement('div');
    section.className = 'section';

    const button = document.createElement('button');
    button.className = 'primary-btn';
    button.id = 'generate-script-btn';
    button.textContent = 'Gerar Script (.bat)';

    button.addEventListener('click', function () {
      generateScript(button, state);
    });

    section.appendChild(button);
    container.appendChild(section);
  }

  /**
   * Executa a geração do script com feedback visual de loading (RNF04).
   * O processamento é rápido, mas simulamos assincronicidade via
   * setTimeout para garantir que o loading seja perceptível e não
   * bloqueie o repaint da UI antes de desabilitar o botão.
   */
  function generateScript(button, state) {
    const originalText = button.textContent;

    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Gerando...';

    setTimeout(function () {
      try {
        const content = Core.CommandGenerator.generateBatContent(state);
        Core.CommandGenerator.downloadBatFile(content, 'setup-links.bat');
      } catch (err) {
        alert('Erro ao gerar o script: ' + err.message);
        console.error(err);
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    }, 300);
  }

  /**
   * Ponto de entrada: renderiza todo o painel direito.
   */
  function render(container, state, onChange) {
    container.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = 'Configuração';
    container.appendChild(title);

    renderRootInfo(container, state);
    renderNodeRegistration(container, state, onChange);
    renderNodesPool(container, state);
    renderCleanEnvironmentToggle(container, state, onChange);
    renderGenerateButton(container, state);
  }

  return {
    render: render
  };

})();