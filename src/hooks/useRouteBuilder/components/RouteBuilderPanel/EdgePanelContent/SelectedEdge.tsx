'use client';

import type { RouteEdge } from '@/hooks/useRouteBuilder/types/route';
import { useEdgesSetter } from '../../../hooks/useEdges';
import EdgeOptions from './EdgeOptions';
import { useAutoReflect, useAutoReflectOptions } from '@/hooks/useRouteBuilder/hooks/useAutoReflect';

interface Props {
  edge: RouteEdge;
}

export default function SelectedEdge({ edge }: Props) {
  const { changeEdgeLevel, changeEdgeHasStairs, changeEdgeIsAccessible, changeEdgeIsIndoor } = useEdgesSetter();
  const [autoReflect, setAutoReflect] = useAutoReflect();
  const [autoReflectOptions, setAutoReflectOptions] = useAutoReflectOptions();

  const handleChange = (level: RouteEdge['level']) => {
    changeEdgeLevel(edge.uuid, level);
  };

  return (
    <EdgeOptions
      autoReflect={autoReflect}
      handleChangeAutoReflect={setAutoReflect}
      autoReflectOptions={autoReflectOptions}
      handleChangeAutoReflectOptions={setAutoReflectOptions}
      level={edge.level}
      hasStairs={edge.hasStairs}
      isAccessible={edge.isAccessible}
      isIndoor={edge.isIndoor}
      handleChangeLevel={handleChange}
      handleChangeHasStairs={(hasStairs) => changeEdgeHasStairs(edge.uuid, hasStairs)}
      handleChangeIsAccessible={(isAccessible) => changeEdgeIsAccessible(edge.uuid, isAccessible)}
      handleChangeIsIndoor={(isIndoor) => changeEdgeIsIndoor(edge.uuid, isIndoor)}
    />
  );
}
