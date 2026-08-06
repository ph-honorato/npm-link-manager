/* =========================================================
   CORE - STATE
   Responsável por: estrutura do estado, persistência em
   localStorage, e operações básicas de leitura/escrita.
   RF00, RF01, RF02, RF11
========================================================= */

window.Core = window.Core || {};

Core.State = (function () {

  const STORAGE_KEY = 'npm-link-orchestrator-state';

  function createInitialState() {
    return {
      root: null,           // { id: 'root', name, path }
      nodes: [],             // [{ id, name, path }]
      edges: [],              // [{ parentId, childId }]
      cleanEnvironment: false
    };
  }

  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialState();
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        root: parsed.root || null,
        nodes: Array.isArray(parsed.nodes) ? parsed.nodes : [],
        edges: Array.isArray(parsed.edges) ? parsed.edges : [],
        cleanEnvironment: !!parsed.cleanEnvironment
      };
    } catch (e) {
      console.error('Falha ao ler estado do localStorage. Reiniciando estado.', e);
      return createInitialState();
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function generateId() {
    return 'n_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function getNodeById(state, id) {
    if (!id) return null;
    if (id === 'root') return state.root;
    return state.nodes.find(function (n) { return n.id === id; }) || null;
  }

  function nameExists(state, name) {
    const normalized = name.trim().toLowerCase();
    if (state.root && state.root.name.trim().toLowerCase() === normalized) {
      return true;
    }
    return state.nodes.some(function (n) {
      return n.name.trim().toLowerCase() === normalized;
    });
  }

  function setRoot(state, name, path) {
    state.root = { id: 'root', name: name.trim(), path: path.trim() };
    saveState(state);
    return state;
  }

  function addNode(state, name, path) {
    const node = {
      id: generateId(),
      name: name.trim(),
      path: path.trim()
    };
    state.nodes.push(node);
    saveState(state);
    return node;
  }

  function edgeExists(state, parentId, childId) {
    return state.edges.some(function (e) {
      return e.parentId === parentId && e.childId === childId;
    });
  }

  function addEdge(state, parentId, childId) {
    if (edgeExists(state, parentId, childId)) {
      return false;
    }
    state.edges.push({ parentId: parentId, childId: childId });
    saveState(state);
    return true;
  }

  function removeEdge(state, parentId, childId) {
    state.edges = state.edges.filter(function (e) {
      return !(e.parentId === parentId && e.childId === childId);
    });
    saveState(state);
  }

  function getChildEdges(state, parentId) {
    return state.edges.filter(function (e) { return e.parentId === parentId; });
  }

  function setCleanEnvironment(state, value) {
    state.cleanEnvironment = !!value;
    saveState(state);
  }

  return {
    createInitialState: createInitialState,
    loadState: loadState,
    saveState: saveState,
    generateId: generateId,
    getNodeById: getNodeById,
    nameExists: nameExists,
    setRoot: setRoot,
    addNode: addNode,
    edgeExists: edgeExists,
    addEdge: addEdge,
    removeEdge: removeEdge,
    getChildEdges: getChildEdges,
    setCleanEnvironment: setCleanEnvironment
  };

})();