import { atom, useAtomValue, useSetAtom } from 'jotai';
import type { UUID } from '../types/route';
import { atomWithReset, RESET, useAtomCallback } from 'jotai/utils';
import { getNodeByUUIDAtom } from './useNodes';
import { getEdgeByUUIDAtom } from './useEdges';

// ===== Node ===== //

const selectedNodeIdAtom = atomWithReset<UUID | null>(null);
const selectedNodeAtom = atom((get) => {
  try {
    const getNode = get(getNodeByUUIDAtom);
    const selectedNodeId = get(selectedNodeIdAtom);
    return selectedNodeId ? getNode(selectedNodeId) : null;
  } catch {
    return null;
  }
});

/** 選択されたターゲットを更新する関数を提供する */
export const useSelectNodeSetter = () => {
  const set = useSetAtom(selectedNodeIdAtom);

  const selectNode = (target: UUID | null) => {
    set(target);
  };

  const resetNode = () => {
    set(RESET);
  };

  return {
    selectNode,
    resetNode,
  } as const;
};

/** 選択されたターゲットを取得する関数を提供する */
export const useGetSelectedNodeFn = () => {
  return useAtomCallback((get) => get(selectedNodeAtom));
};

/** 選択されたターゲットを提供する */
export const useSelectedNodeValue = () => {
  return useAtomValue(selectedNodeAtom);
};

// ===== Edge ===== //

const selectedEdgeIdAtom = atomWithReset<UUID | null>(null);
const selectedEdgeAtom = atom((get) => {
  try {
    const getEdge = get(getEdgeByUUIDAtom);
    const selectedEdgeId = get(selectedEdgeIdAtom);
    return selectedEdgeId ? getEdge(selectedEdgeId) : null;
  } catch {
    return null;
  }
});
const getSelectedEdgeAtom = atom((get) => () => get(selectedEdgeAtom));

/** 選択されたターゲットを更新する関数を提供する */
export const useSelectEdgeSetter = () => {
  const set = useSetAtom(selectedEdgeIdAtom);

  const selectEdge = (target: UUID | null) => {
    set(target);
  };

  const resetEdge = () => {
    set(RESET);
  };

  return {
    selectEdge,
    resetEdge,
  } as const;
};

/** 選択されたターゲットを取得する関数を提供する */
export const useGetSelectedEdgeFn = () => {
  return useAtomCallback((get) => () => get(selectedEdgeAtom));
};

/** 選択されたターゲットを提供する */
export const useSelectedEdgeValue = () => {
  return useAtomValue(selectedEdgeAtom);
};
