'use client';

import { useAutoReflect, useAutoReflectOptions } from '@/hooks/useRouteBuilder/hooks/useAutoReflect';
import EdgeOptions from './EdgeOptions';
import { useDefaultEdgeOptions } from '@/hooks/useRouteBuilder/hooks/useDefaultEdgeOptions';

export default function DefaultEdge() {
  const { options, changeEdgeHasStairs, changeEdgeIsAccessible, changeEdgeIsIndoor, changeEdgeLevel } =
    useDefaultEdgeOptions();
  const [autoReflect, setAutoReflect] = useAutoReflect();
  const [autoReflectOptions, setAutoReflectOptions] = useAutoReflectOptions();

  return (
    <EdgeOptions
      autoReflect={autoReflect}
      handleChangeAutoReflect={setAutoReflect}
      autoReflectOptions={autoReflectOptions}
      handleChangeAutoReflectOptions={setAutoReflectOptions}
      level={options.level}
      hasStairs={options.hasStairs}
      isAccessible={options.isAccessible}
      isIndoor={options.isIndoor}
      handleChangeLevel={changeEdgeLevel}
      handleChangeHasStairs={changeEdgeHasStairs}
      handleChangeIsAccessible={changeEdgeIsAccessible}
      handleChangeIsIndoor={changeEdgeIsIndoor}
    />
  );
}
