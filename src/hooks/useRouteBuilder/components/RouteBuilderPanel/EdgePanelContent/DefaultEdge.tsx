'use client';

import { useAutoReflect } from '@/hooks/useRouteBuilder/hooks/useAutoReflect';
import EdgeOptions from './EdgeOptions';
import { useDefaultEdgeOptions } from '@/hooks/useRouteBuilder/hooks/useDefaultEdgeOptions';

export default function DefaultEdge() {
  const { options, changeEdgeHasStairs, changeEdgeIsAccessible, changeEdgeIsIndoor, changeEdgeLevel } =
    useDefaultEdgeOptions();
  const [autoReflect, setAutoReflect] = useAutoReflect();

  return (
    <EdgeOptions
      level={options.level}
      hasStairs={options.hasStairs}
      isAccessible={options.isAccessible}
      isIndoor={options.isIndoor}
      handleChangeLevel={changeEdgeLevel}
      handleChangeHasStairs={changeEdgeHasStairs}
      handleChangeIsAccessible={changeEdgeIsAccessible}
      handleChangeIsIndoor={changeEdgeIsIndoor}
      autoReflect={autoReflect}
      handleChangeAutoReflect={setAutoReflect}
    />
  );
}
