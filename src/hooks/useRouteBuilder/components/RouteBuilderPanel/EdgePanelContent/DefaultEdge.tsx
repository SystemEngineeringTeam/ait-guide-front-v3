'use client';

import EdgeOptions from './EdgeOptions';
import { useDefaultEdgeOptions } from '@/hooks/useRouteBuilder/hooks/useDefaultEdgeOptions';

export default function DefaultEdge() {
  const { options, changeEdgeHasStairs, changeEdgeIsAccessible, changeEdgeIsIndoor, changeEdgeLevel } =
    useDefaultEdgeOptions();

  return (
    <EdgeOptions
      title="デフォルトオプション"
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
