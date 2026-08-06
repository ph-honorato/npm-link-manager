/* =========================================================
   UI - TREE
   Responsável por: renderizar a árvore de nós/dependências
   e o seletor inline de "+ adicionar dependência".
   RF05, RF06, RF07, RF08, RF09, RNF07
========================================================= */

window.UI = window.UI || {};

UI.Tree = (function () {

  // Controla qual nó está com o seletor de dependência aberto no momento.
  // Como não usamos framework, mantemos esse estado local no módulo.
  let openSelectorParentId = null;
  let pendingSelectedChildId = null;

  /**
   * Retorna a lista de nós que podem ser adicionados como dependência
   * de um determinado nó pai (RF07: exclui os que já são dependência direta;
   * exclui o próprio nó para evitar auto-referência).
   */
  function getAvailableNodesForParent(state, parentId) {
    const existingChildIds = Core.State.getChildEdges(state, parentId)
      .map(function (edge) { return edge.childId; });

    return state.nodes.filter(function (node) {
      const isSelf = node.id === parentId;
      const alreadyChild = existingChildIds.indexOf(node.id) !== -1;
      return !isSelf && !alreadyChild;
    });
  }

  /**
   * Renderiza a linha de um único nó (nome + botão de remover, se aplicável)
   * mais o botão/seletor de "adicionar dependência".
   */
  function renderNodeRow(state, nodeId, depth, parentId, onChange) {
    const node = Core.State.getNodeById(state, nodeId);

    const row = document.createElement('div');
    row.className = 'tree-row';
    row.style.paddingLeft = (depth * 24) + 'px';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'node-name';
    nameSpan.textContent = node.name;
    row.appendChild(nameSpan);

    // RF09: botão de remover relação (não exibido para o nó raiz, que não tem "pai")
    if (parentId !== null) {
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.title = 'Remover dependência';
      removeBtn.textContent = 'x';
      removeBtn.addEventListener('click', function () {
        Core.State.removeEdge(state, parentId, nodeId);
        onChange();
      });
      row.appendChild(removeBtn);
    }

    return row;
  }

  /**
   * Renderiza o controle de "+ adicionar dependência" ou o seletor inline,
   * dependendo do estado atual (openSelectorParentId).
   */
  function renderAddDependencyControl(state, parentId, depth, onChange) {
    const wrapper = document.createElement('div');
    wrapper.className = 'tree-row';
    wrapper.style.paddingLeft = ((depth + 1) * 24) + 'px';

    const isOpen = openSelectorParentId === parentId;

    if (!isOpen) {
      // RF06: botão que abre o seletor inline
      const addBtn = document.createElement('button');
      addBtn.className = 'add-dep-btn';
      addBtn.textContent = '+ adicionar dependência';
      addBtn.addEventListener('click', function () {
        openSelectorParentId = parentId;
        pendingSelectedChildId = null;
        onChange();
      });
      wrapper.appendChild(addBtn);
      return wrapper;
    }

    // Seletor inline aberto
    const selectorRow = document.createElement('div');
    selectorRow.className = 'selector-row tree-row';
    selectorRow.style.paddingLeft = '0px';

    const availableNodes = getAvailableNodesForParent(state, parentId);

    const select = document.createElement('select');

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = availableNodes.length > 0
      ? 'Selecione um nó...'
      : 'Nenhum nó disponível';
    select.appendChild(placeholderOption);

    availableNodes.forEach(function (node) {
      const option = document.createElement('option');
      option.value = node.id;
      option.textContent = node.name;
      select.appendChild(option);
    });

    select.disabled = availableNodes.length === 0;

    select.addEventListener('change', function () {
      pendingSelectedChildId = select.value || null;
      confirmBtn.disabled = !pendingSelectedChildId;
    });

    // RF06.1/RF06.2: confirmação desabilitada até selecionar um nó
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'confirm-dep-btn';
    confirmBtn.textContent = 'Adicionar';
    confirmBtn.disabled = true;

    confirmBtn.addEventListener('click', function () {
      if (!pendingSelectedChildId) return;

      const added = Core.State.addEdge(state, parentId, pendingSelectedChildId);
      if (!added) {
        // RF07: relação já existente (defesa extra, já filtrado no select)
        alert('Essa dependência já foi adicionada anteriormente.');
      }

      openSelectorParentId = null;
      pendingSelectedChildId = null;
      onChange();
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-dep-btn';
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.addEventListener('click', function () {
      openSelectorParentId = null;
      pendingSelectedChildId = null;
      onChange();
    });

    selectorRow.appendChild(select);
    selectorRow.appendChild(confirmBtn);
    selectorRow.appendChild(cancelBtn);
    wrapper.appendChild(selectorRow);

    return wrapper;
  }

  /**
   * Renderiza recursivamente um nó, seus filhos (dependências) e o
   * controle de adicionar dependência, respeitando a indentação (RNF07).
   */
  function renderSubtree(state, nodeId, depth, parentId, container, onChange) {
    container.appendChild(renderNodeRow(state, nodeId, depth, parentId, onChange));

    const childEdges = Core.State.getChildEdges(state, nodeId);
    childEdges.forEach(function (edge) {
      renderSubtree(state, edge.childId, depth + 1, nodeId, container, onChange);
    });

    container.appendChild(renderAddDependencyControl(state, nodeId, depth, onChange));
  }

  /**
   * Ponto de entrada: renderiza a árvore completa a partir do nó raiz,
   * dentro do elemento container informado.
   */
  function render(container, state, onChange) {
    container.innerHTML = '';

    if (!state.root) {
      const emptyMsg = document.createElement('p');
      emptyMsg.className = 'empty-text';
      emptyMsg.textContent = 'Nenhum nó raiz definido.';
      container.appendChild(emptyMsg);
      return;
    }

    renderSubtree(state, 'root', 0, null, container, onChange);
  }

  return {
    render: render
  };

})();