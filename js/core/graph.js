/* =========================================================
   CORE - GRAPH
   Responsável por: montagem do grafo de dependências e
   cálculo da ordem de execução via ordenação topológica.
   RF17, RF19
========================================================= */

window.Core = window.Core || {};

Core.Graph = (function () {

  /**
   * Monta um mapa de "parentId -> [childIds]" a partir das edges do estado.
   * Cada childId representa uma dependência direta do parentId.
   */
  function buildChildrenMap(state) {
    const map = {};
    state.edges.forEach(function (edge) {
      if (!map[edge.parentId]) {
        map[edge.parentId] = [];
      }
      map[edge.parentId].push(edge.childId);
    });
    return map;
  }

  /**
   * Retorna a lista de IDs das dependências diretas de um nó.
   */
  function getDirectDependencies(state, nodeId) {
    const childrenMap = buildChildrenMap(state);
    return childrenMap[nodeId] || [];
  }

  /**
   * Calcula a ordem de execução (do "mais folha" até o nó raiz),
   * garantindo que cada nó apareça apenas UMA VEZ (RF19), mesmo que
   * seja dependência de múltiplos "pais" (DAG).
   *
   * Utiliza DFS pós-ordem a partir do nó raiz: primeiro visita as
   * dependências (filhos), depois adiciona o próprio nó à lista.
   * Isso garante que toda dependência apareça antes de quem depende dela.
   */
  function getExecutionOrder(state) {
    if (!state.root) {
      throw new Error('Nó raiz não definido. Não é possível calcular a ordem de execução.');
    }

    const childrenMap = buildChildrenMap(state);
    const visited = {};
    const order = [];

    function visit(nodeId) {
      if (visited[nodeId]) {
        return; // RF19: já processado, não duplicar
      }
      visited[nodeId] = true;

      const children = childrenMap[nodeId] || [];
      children.forEach(function (childId) {
        visit(childId);
      });

      order.push(nodeId);
    }

    visit('root');

    return order; // ex: ['task_id', 'journalTaskUi_id', 'root']
  }

  /**
   * Verifica se um nó é o nó raiz.
   */
  function isRoot(nodeId) {
    return nodeId === 'root';
  }

  return {
    buildChildrenMap: buildChildrenMap,
    getDirectDependencies: getDirectDependencies,
    getExecutionOrder: getExecutionOrder,
    isRoot: isRoot
  };

})();